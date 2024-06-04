import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { s3Service } from '@/aws/s3.service';
import { BlockchainService } from '@/blockchain/blockchain.service';
import { config } from '@/config';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@/errors';
import { NotificationsService } from '@/notifications/notifications.service';
import { Page } from '@/types';
import { User } from '@/users/users.model';
import { UsersService } from '@/users/users.service';

import {
  Deal,
  DealLog,
  DealParticipant,
  DealStatus,
  DocumentFile,
  Milestone,
  MilestoneApprovalStatus,
} from './deals.entities';
import { DealsRepository } from './deals.repository';

export interface ListDealsQuery {
  status?: DealStatus;
}

@Injectable()
export class DealsService {
  constructor(
    private readonly dealsRepository: DealsRepository,
    private readonly users: UsersService,
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

  selectParticipantsEmailsBasedOnUser(
    user: User,
    deal: Partial<Deal>,
  ): string[] {
    return deal.buyers
      .concat(deal.suppliers)
      .map((participant) => {
        if (participant.email !== user.email) {
          return participant.email;
        }
      })
      .filter((v) => v);
  }

  async findDealsByUser(
    userId: string,
    query: ListDealsQuery,
  ): Promise<Deal[]> {
    return this.dealsRepository.findByUser(userId, query);
  }

  async createDeal(user: User, dealPayload: Partial<Deal>): Promise<Deal> {
    dealPayload.status = DealStatus.Proposal;

    dealPayload.buyers = dealPayload.buyers?.map((buyer) => {
      if (buyer.id === user.id) {
        return {
          ...buyer,
          approved: true,
        };
      }
      return { ...buyer, new: true };
    });
    dealPayload.suppliers = dealPayload.suppliers?.map((supplier) => {
      if (supplier.id === user.id) {
        return {
          ...supplier,
          approved: true,
        };
      }
      return {
        ...supplier,
        new: true,
      };
    });

    const deal = await this.dealsRepository.create(dealPayload);

    if (deal.buyers && deal.suppliers) {
      // invite users not registered in the platform
      const participantsNotRegistered = deal.buyers
        .concat(deal.suppliers)
        .filter((participant) => !participant.id);

      if (participantsNotRegistered.length > 0) {
        await this.notifications.sendInviteToSignupNotification(
          participantsNotRegistered.map((p) => p.email),
          deal,
          user.email,
        );
      }
    }

    await this.notifications.sendNewProposalNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      user.email,
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

  async findUserDealById(dealId: string, user: User): Promise<Deal> {
    const deal = await this.dealsRepository.findById(dealId);
    if (!deal) {
      throw new BadRequestError('Deal not found');
    }

    await this.checkDealAccess(deal, user);

    const participant = deal.buyers.find((b) => b.id === user.id);
    if (participant) {
      deal.new = participant.new || false;
    } else {
      const participant = deal.suppliers.find((s) => s.id === user.id);
      if (participant) {
        deal.new = participant.new || false;
      }
    }

    return deal;
  }

  async confirmDeal(dealId: string, user: User): Promise<Deal> {
    const deal = await this.findById(dealId);

    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal is not in proposal status');
    }

    await this.checkAuthorizedToUpdateDeal(deal, user);

    const dealUpdate: Partial<Deal> = {};

    dealUpdate.buyers = deal.buyers.map((buyer) => {
      if (buyer.id === user.id) {
        return {
          ...buyer,
          approved: true,
          new: false,
        };
      }

      return {
        ...buyer,
      };
    });

    dealUpdate.suppliers = deal.suppliers.map((supplier) => {
      if (supplier.id === user.id) {
        return {
          ...supplier,
          approved: true,
          new: false,
        };
      }

      return {
        ...supplier,
      };
    });

    if (
      dealUpdate.buyers
        .concat(dealUpdate.suppliers)
        .every((participant) => participant.approved)
    ) {
      dealUpdate.status = DealStatus.Confirmed;

      if (config.automaticDealsAcceptance && deal.buyers.length > 0) {
        const buyer = await this.users.findByEmail(deal.buyers[0].email);

        const txHash = await this.blockchain.mintNFT(
          deal.milestones.map((m) => m.fundsDistribution),
          buyer.walletAddress,
        );
        const nftID = await this.blockchain.getNftID(txHash);
        dealUpdate.nftID = nftID;
        dealUpdate.mintTxHash = txHash;
      }
    }

    await this.notifications.sendDealConfirmedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
    );

    return this.dealsRepository.updateById(dealId, dealUpdate);
  }

  checkAuthorizedToUpdateDeal(deal: Deal, user: User): void {
    if (
      deal.buyers.concat(deal.suppliers).some((participant) => {
        if (participant.id === user.id) {
          return true;
        }
      })
    ) {
      return;
    }

    throw new UnauthorizedError('You are not allowed to update this deal');
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
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      user.email,
    );

    return this.dealsRepository.updateById(dealId, dealUpdate);
  }

  async setDealAsViewed(dealId: string, user: User): Promise<Deal> {
    const deal = await this.findById(dealId);

    await this.checkAuthorizedToUpdateDeal(deal, user);

    const update: Partial<Deal> = {};

    update.buyers = deal.buyers.map((buyer) => {
      if (buyer.id === user.id) {
        return {
          ...buyer,
          new: false,
        };
      }

      return {
        ...buyer,
      };
    });

    update.suppliers = deal.suppliers.map((supplier) => {
      if (supplier.id === user.id) {
        return {
          ...supplier,
          new: false,
        };
      }

      return {
        ...supplier,
      };
    });

    const dealUpdated = await this.dealsRepository.updateById(dealId, update);

    dealUpdated.new = false;

    return dealUpdated;
  }

  async setDocumentsAsViewed(dealId: string, user: User): Promise<Deal> {
    const deal = await this.findById(dealId);

    await this.checkAuthorizedToUpdateDeal(deal, user);

    const dealUpdated = await this.dealsRepository.updateById(dealId, {
      newDocuments: false,
    });

    return dealUpdated;
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

    this.checkAuthorizedToUpdateDeal(deal, user);

    if (deal.status !== DealStatus.Proposal) {
      throw new BadRequestError('Deal cannot be updated');
    }

    await this.notifications.sendChangesInProposalNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      user.email,
    );

    dealPayload.buyers = deal.buyers.map((buyer) => {
      if (buyer.id === user.id) {
        return {
          ...buyer,
          approved: true,
        };
      }

      return {
        ...buyer,
        approved: false,
      };
    });

    dealPayload.suppliers = deal.suppliers.map((supplier) => {
      if (supplier.id === user.id) {
        return {
          ...supplier,
          approved: true,
        };
      }

      return {
        ...supplier,
        approved: false,
      };
    });

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

    this.checkDealSupplier(
      deal,
      user,
      'You are not allowed to upload documents for this deal',
    );

    const uploadedUrl = await this.uploadFile(file, dealId);

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

    this.checkDealAccess(
      deal,
      user,
      'You are not allowed to upload the cover image for this deal',
    );

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

    this.checkDealSupplier(
      deal,
      user,
      'You are not allowed to delete documents',
    );

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

    this.checkDealSupplier(
      deal,
      user,
      'You are not allowed to upload documents for this deal',
    );

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

    await this.notifications.sendNewMilestoneDocumentUploadedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      milestone,
      user.email,
    );

    return document;
  }

  async updateMilestoneDocument(
    dealId: string,
    milestoneId: string,
    docId: string,
    description: string,
    user: User,
  ): Promise<DocumentFile> {
    const deal = await this.findById(dealId);

    this.checkDealSupplier(
      deal,
      user,
      'You are not allowed to update documents in this deal',
    );

    if (deal.milestones[deal.currentMilestone].id !== milestoneId) {
      throw new ForbiddenError(
        'You are not allowed to update documents in this milestone',
      );
    }

    const milestone = deal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new BadRequestError('Milestone not found');
    }

    const document = await this.dealsRepository.updateMilestoneDocument(
      dealId,
      milestoneId,
      docId,
      description,
    );

    this.notifications.sendNewMilestoneDocumentUploadedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      milestone,
      user.email,
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

    this.checkDealSupplier(
      deal,
      user,
      'You are not allowed to remove documents from this deal',
    );

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

  checkDealAccess(deal: Deal, user: User, errorMessage?: string): void {
    if (
      deal.buyers.concat(deal.suppliers).some((participant) => {
        if (participant.id === user.id) {
          return true;
        }
      })
    ) {
      return;
    }

    throw new UnauthorizedError(
      errorMessage || 'You are not allowed to access this deal information',
    );
  }

  checkDealBuyer(deal: Deal, user: User, errorMessage?: string): void {
    if (
      deal.buyers.some((participant) => {
        if (participant.id === user.id) {
          return true;
        }
      })
    ) {
      return;
    }

    throw new UnauthorizedError(
      errorMessage || 'Only a deal buyer can do this operation on this deal',
    );
  }

  checkDealSupplier(deal: Deal, user: User, errorMessage?: string): void {
    if (
      deal.suppliers.some((participant) => {
        if (participant.id === user.id) {
          return true;
        }
      })
    ) {
      return;
    }

    throw new UnauthorizedError(
      errorMessage || 'Only a deal supplier can do this operation on this deal',
    );
  }

  async findDealsLogs(dealId: string, user: User): Promise<DealLog[]> {
    const deal = await this.findById(dealId);
    await this.checkDealAccess(deal, user);
    return this.dealsRepository.findDealsLogs(deal.nftID);
  }

  async assignUserToDeals(user: User): Promise<void> {
    return this.dealsRepository.assignUserToDeals(user.id, user.email);
  }

  async updateCurrentMilestone(
    dealId: string,
    currentMilestone: number,
    signature: string,
    user: User,
  ): Promise<Deal> {
    const deal = await this.findById(dealId);

    this.checkDealBuyer(
      deal,
      user,
      'User not authorized to update the current milestone for this deal',
    );

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

    await this.blockchain.changeMilestoneStatus(
      deal.nftID as number,
      currentMilestone,
    );

    await this.notifications.sendMilestoneApprovedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      deal.milestones[currentMilestone],
      user.email,
    );

    return this.dealsRepository.updateById(dealId, {
      currentMilestone: deal.currentMilestone + 1,
    });
  }

  async submitMilestoneReviewRequest(
    dealId: string,
    milestoneId: string,
    user: User,
  ): Promise<Milestone> {
    const deal = await this.findById(dealId);

    this.checkDealSupplier(
      deal,
      user,
      'Only supplier can submit milestone review request',
    );

    const milestoneIndex = deal.milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    } else if (milestoneIndex !== deal.currentMilestone) {
      throw new BadRequestError('Milestone is not the current milestone');
    } else if (
      ![
        MilestoneApprovalStatus.Pending,
        MilestoneApprovalStatus.Denied,
      ].includes(deal.milestones[milestoneIndex].approvalStatus)
    ) {
      throw new BadRequestError('Milestone is not pending or denied');
    }

    const milestone = await this.dealsRepository.upadteMilestoneStatus(
      dealId,
      milestoneId,
      MilestoneApprovalStatus.Submitted,
    );

    this.notifications.sendMilestoneApprovalRequestNotification(
      deal.buyers.map((b) => b.email),
      deal,
      milestone,
      user.email,
    );

    return milestone;
  }

  async approveMilestone(
    dealId: string,
    milestoneId: string,
    user: User,
  ): Promise<Milestone> {
    const deal = await this.findById(dealId);

    if (deal.nftID === undefined) {
      throw new BadRequestError('Deal NFT must be minted first');
    }

    this.checkDealBuyer(deal, user, 'Only buyer can approve milestone');

    const milestoneIndex = deal.milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    } else if (milestoneIndex !== deal.currentMilestone) {
      throw new BadRequestError('Milestone is not the current milestone');
    } else if (
      deal.milestones[milestoneIndex].approvalStatus !==
      MilestoneApprovalStatus.Submitted
    ) {
      throw new BadRequestError('Milestone review was not submitted');
    }

    await this.blockchain.changeMilestoneStatus(
      deal.nftID as number,
      milestoneIndex + 1,
    );

    const milestone = this.dealsRepository.upadteMilestoneStatus(
      dealId,
      milestoneId,
      MilestoneApprovalStatus.Approved,
    );

    await this.notifications.sendMilestoneApprovedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      deal.milestones[milestoneIndex],
      user.email,
    );

    if (milestoneIndex == 6) {
      await this.dealsRepository.updateById(dealId, {
        status: DealStatus.Finished,
      });

      await this.notifications.sendDealCompletedNotification(
        this.selectParticipantsEmailsBasedOnUser(user, deal),
        deal,
      );
    }

    return milestone;
  }

  async denyMilestone(
    dealId: string,
    milestoneId: string,
    user: User,
  ): Promise<Milestone> {
    const deal = await this.findById(dealId);

    this.checkDealBuyer(deal, user, 'Only buyer can deny milestone');

    const milestoneIndex = deal.milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    } else if (milestoneIndex !== deal.currentMilestone) {
      throw new BadRequestError('Milestone is not the current milestone');
    } else if (
      deal.milestones[milestoneIndex].approvalStatus !==
      MilestoneApprovalStatus.Submitted
    ) {
      throw new BadRequestError('Milestone review was not submitted');
    }

    const milestone = await this.dealsRepository.upadteMilestoneStatus(
      dealId,
      milestoneId,
      MilestoneApprovalStatus.Denied,
    );

    await this.notifications.sendMilestoneDeniedNotification(
      this.selectParticipantsEmailsBasedOnUser(user, deal),
      deal,
      milestone,
      user.email,
    );

    return milestone;
  }

  async getDealsParticipantsByEmails(
    usersEmails: string[],
  ): Promise<DealParticipant[]> {
    const users = await this.users.findByEmails(usersEmails);

    return usersEmails.map((email) => {
      const user = users.find((u) => u.email === email);

      if (user) {
        return {
          id: user.id,
          email: user.email,
        };
      }

      return { email };
    });
  }

  async paginate(
    offset: number,
    status: DealStatus,
    emailsSearch: string,
  ): Promise<Page<Deal>> {
    const query = {} as any;

    if (status) {
      query.status = status;
    }

    if (emailsSearch) {
      query.$or = [
        { 'buyers.email': { $regex: new RegExp(emailsSearch, 'i') } },
        { 'suppliers.email': { $regex: new RegExp(emailsSearch, 'i') } },
      ];
    }

    return this.dealsRepository.paginate(query, offset);
  }
}
