import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { s3Service } from '@/aws/s3.service';
import { BlockchainService } from '@/blockchain/blockchain.service';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from '@/errors';
import { logger } from '@/logger';
import { NotificationsService } from '@/notifications/notifications.service';
import { AccountType, User } from '@/users/users.model';
import { UsersService } from '@/users/users.service';

import { Deal, DealLog, DealStatus, DocumentFile } from './deals.entities';
import { DealsRepository } from './deals.repository';

export interface ListDealsQuery {
  status?: DealStatus;
}

@Injectable()
export class DealsService {
  constructor(
    private readonly dealsRepository: DealsRepository,
    private readonly usersService: UsersService,
    private readonly notifications: NotificationsService,
    private readonly blockchain: BlockchainService,
  ) {}

  private async uploadFile(
    file: { path: string; originalname: string },
    dealId: string,
  ): Promise<string | undefined> {
    if (process.env.E2E_TEST) {
      fs.unlinkSync(file.path);
      return Math.random().toString(36).substring(2, 10);
    }

    const fileBuffer = fs.readFileSync(file.path);

    const timestamp = Date.now();
    const key = `deals/${dealId}/${timestamp}-${file.originalname}`;

    const uploadedUrl = await s3Service.uploadFile(key, fileBuffer);
    return uploadedUrl;
  }

  selectDealEmailBasedOnUser(user: User, deal: Deal): string {
    if (user.accountType === 'buyer') {
      return deal.proposalBuyerEmail;
    } else if (user.accountType === 'supplier') {
      return deal.proposalSupplierEmail;
    } else {
      throw new InternalServerError('Invalid account type');
    }
  }

  async findDealsByUser(
    userId: string,
    query: ListDealsQuery,
  ): Promise<Deal[]> {
    return this.dealsRepository.findByUser(userId, query);
  }

  async createDeal(user: User, dealPayload: Partial<Deal>): Promise<Deal> {
    dealPayload.status = DealStatus.Proposal;

    if (user.accountType === AccountType.Buyer) {
      dealPayload.buyerId = user.id;
      dealPayload.buyerConfirmed = true;
      dealPayload.proposalBuyerEmail = user.email;

      if (!dealPayload.proposalSupplierEmail) {
        throw new BadRequestError('proposalSupplierEmail is required');
      }

      const supplier = await this.usersService.findByEmail(
        dealPayload.proposalSupplierEmail,
      );

      if (supplier && supplier.accountType !== AccountType.Supplier) {
        throw new BadRequestError('User must be a supplier');
      } else if (supplier) {
        dealPayload.supplierId = supplier.id;
      } else {
        await this.notifications.sendInviteToSignupNotification(
          dealPayload.proposalSupplierEmail,
        );
      }
    } else if (user.accountType === AccountType.Supplier) {
      dealPayload.supplierId = user.id;
      dealPayload.supplierConfirmed = true;
      dealPayload.proposalSupplierEmail = user.email;

      if (!dealPayload.proposalBuyerEmail) {
        throw new BadRequestError('proposalBuyerEmail is required');
      }

      const buyer = await this.usersService.findByEmail(
        dealPayload.proposalBuyerEmail,
      );

      if (buyer && buyer.accountType !== AccountType.Buyer) {
        throw new BadRequestError('User must be a buyer');
      } else if (buyer) {
        dealPayload.buyerId = buyer.id;
      } else {
        await this.notifications.sendInviteToSignupNotification(
          dealPayload.proposalBuyerEmail,
        );
      }
    } else {
      throw new UnauthorizedError('User must be a buyer or a supplier');
    }

    const deal = await this.dealsRepository.create(dealPayload);

    await this.notifications.sendNewProposalNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );
    return deal;
  }

  async findById(dealId: string): Promise<Deal> {
    const deal = await this.dealsRepository.findById(dealId);
    if (!deal) {
      throw new BadRequestError('Deal not found');
    }
    return deal;
  }

  async confirmDeal(dealId: string, user: User): Promise<Deal> {
    const deal = await this.findById(dealId);

    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal is not in proposal status');
    }

    const dealUpdate: Partial<Deal> = {};

    if (user.accountType === 'buyer') {
      if (deal.buyerId !== user.id) {
        logger.debug(
          `User ${user.id} is confirming deal ${dealId}, but buyer is ${deal.supplierId}`,
        );
        throw new BadRequestError(
          'You are not authorized to confirm this deal',
        );
      }
      dealUpdate.buyerConfirmed = true;
      if (deal.supplierConfirmed) {
        dealUpdate.status = DealStatus.Confirmed;
      }
    } else if (user.accountType === 'supplier') {
      logger.debug(
        `User ${user.id} is confirming deal ${dealId}, but supplier is ${deal.supplierId}`,
      );
      if (deal.supplierId !== user.id) {
        throw new BadRequestError(
          'You are not authorized to confirm this deal',
        );
      }
      dealUpdate.supplierConfirmed = true;
      if (deal.buyerConfirmed) {
        dealUpdate.status = DealStatus.Confirmed;
      }
    } else {
      throw new InternalServerError('Invalid account type');
    }

    await this.notifications.sendDealConfirmedNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );

    return this.dealsRepository.updateById(dealId, dealUpdate);
  }

  checkAuthorizedToUpdateDeal(deal: Deal, user: User): void {
    if (deal.buyerId !== user.id && deal.supplierId !== user.id) {
      throw new UnauthorizedError('You are not allowed to update this deal');
    }
  }

  async cancelDeal(dealId: string, user: User): Promise<Deal> {
    const deal = await this.findById(dealId);

    await this.checkAuthorizedToUpdateDeal(deal, user);

    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal cannot be canceled');
    }
    const dealUpdate: Partial<Deal> = {
      status: DealStatus.Cancelled,
    };

    await this.notifications.sendProposalCancelledNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );

    return this.dealsRepository.updateById(dealId, dealUpdate);
  }

  async updateDeal(
    dealId: string,
    dealPayload: Partial<Deal>,
    user: User,
  ): Promise<Deal> {
    if (Object.keys(dealPayload).length === 0) {
      throw new BadRequestError('No data to update');
    }

    const deal = await this.findById(dealId);

    await this.checkAuthorizedToUpdateDeal(deal, user);

    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal cannot be updated');
    }

    if (user.accountType === AccountType.Buyer) {
      dealPayload.supplierConfirmed = false;
      dealPayload.buyerConfirmed = true;
    } else if (user.accountType === AccountType.Supplier) {
      dealPayload.buyerConfirmed = false;
      dealPayload.supplierConfirmed = true;
    }

    await this.notifications.sendChangesInProposalNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );

    return this.dealsRepository.updateById(dealId, dealPayload);
  }

  async deleteDeal(dealId: string): Promise<void> {
    const deal = await this.findById(dealId);
    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal cannot be deleted');
    }
    await this.dealsRepository.delete(dealId);
  }

  async uploadDealDocument(
    dealId: string,
    file: { path: string; originalname: string },
    description: string,
    user: User,
  ): Promise<DocumentFile> {
    const deal = await this.findById(dealId);

    if (deal.supplierId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to upload documents for this deal',
      );
    }

    const uploadedUrl = await this.uploadFile(file, dealId);

    await this.notifications.sendNewDocumentUploadedNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );

    return this.dealsRepository.pushDocument(dealId, {
      url: uploadedUrl,
      description,
    });
  }

  async uploadDealCoverImage(
    dealId: string,
    file: { path: string; originalname: string },
    user: User,
  ): Promise<Deal> {
    const deal = await this.findById(dealId);

    if (deal.supplierId !== user.id && deal.buyerId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to upload the cover image for this deal',
      );
    }

    const uploadedUrl = await this.uploadFile(file, dealId);

    return this.dealsRepository.updateById(dealId, {
      coverImageUrl: uploadedUrl,
    });
  }

  async removeDocumentFromDeal(
    dealId: string,
    documentId: string,
    user: User,
  ): Promise<void> {
    const deal = await this.findById(dealId);

    if (deal.supplierId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to delete documents from this deal',
      );
    }

    await this.dealsRepository.pullDocument(dealId, documentId);
  }

  async uploadDocumentToMilestone(
    dealId: string,
    milestoneId: string,
    file: { path: string; originalname: string },
    description: string,
    user: User,
  ): Promise<DocumentFile> {
    const deal = await this.findById(dealId);
    if (deal.supplierId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to upload documents for this deal',
      );
    }

    if (deal.milestones[deal.currentMilestone].id !== milestoneId) {
      throw new ForbiddenError(
        'You are not allowed to upload documents for this milestone',
      );
    }

    const milestone = deal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new BadRequestError('Milestone not found');
    }

    const uploadedUrl = await this.uploadFile(file, dealId);
    const document = await this.dealsRepository.pushMilestoneDocument(
      dealId,
      milestoneId,
      {
        url: uploadedUrl,
        description,
      },
    );

    await this.notifications.sendNewDocumentUploadedNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
    );

    return document;
  }

  async removeDocumentFromMilestone(
    dealId: string,
    milestoneId: string,
    documentId: string,
    user: User,
  ): Promise<void> {
    const deal = await this.findById(dealId);
    if (deal.supplierId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to remove documents from this deal',
      );
    }
    const milestone = deal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new BadRequestError('Milestone not found');
    }
    await this.dealsRepository.pullMilestoneDocument(
      dealId,
      milestoneId,
      documentId,
    );
  }

  async assignNftIdToDeal(
    dealId: string,
    nftID: number,
    mintTxHash: string,
  ): Promise<Deal> {
    await this.findById(dealId);
    return this.dealsRepository.updateById(dealId, { nftID, mintTxHash });
  }

  checkDealAccess(deal: Deal, user: User): void {
    if (deal.buyerId !== user.id && deal.supplierId !== user.id) {
      throw new UnauthorizedError(
        'You are not allowed to access this deal information',
      );
    }
  }

  async findDealsLogs(dealId: string, user: User): Promise<DealLog[]> {
    const deal = await this.findById(dealId);
    await this.checkDealAccess(deal, user);
    return this.dealsRepository.findDealsLogs(dealId);
  }

  async assignUserToDeals(user: User): Promise<void> {
    return this.dealsRepository.assignUserToDeals(
      user.id,
      user.email,
      user.accountType as AccountType,
    );
  }

  async updateCurrentMilestone(
    dealId: string,
    currentMilestone: number,
    signature: string,
    user: User,
  ): Promise<Deal> {
    const deal = await this.findById(dealId);
    if (deal.buyerId !== user.id) {
      throw new UnauthorizedError(
        'User not authorized to update the current milestone for this deal',
      );
    }

    if (deal.nftID === undefined) {
      throw new BadRequestError('Deal NFT must be minted first');
    }

    if (
      currentMilestone < 0 ||
      currentMilestone >= deal.milestones.length ||
      deal.currentMilestone + 1 !== currentMilestone
    ) {
      throw new BadRequestError(
        `Cannot update milestone. The next milestone to update is Milestone ${deal.currentMilestone + 1}`,
      );
    }

    const validSignature = await this.blockchain.verifyMessage(
      user.walletAddress as `0x${string}`,
      `Approve milestone ${currentMilestone} of deal ${deal.nftID}`,
      signature as `0x${string}`,
    );

    if (!validSignature) {
      throw new ForbiddenError('Invalid signature');
    }

    // TODO: update in smart contract before updating in database

    await this.notifications.sendMilestoneApprovedNotification(
      this.selectDealEmailBasedOnUser(user, deal),
      deal,
      deal.milestones[currentMilestone],
    );

    return this.dealsRepository.updateById(dealId, {
      currentMilestone: deal.currentMilestone + 1,
    });
  }
}
