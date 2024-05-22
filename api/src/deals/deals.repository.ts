import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { logger } from '@/logger';
import { AccountType } from '@/users/users.model';

import DealsLogs from '../deals-logs/deals-logs.model';
import { NotFoundError } from '../errors';
import { MongooseRepository } from '../repository.mongoose';
import {
  Deal,
  DealLog,
  DealStatus,
  DocumentFile,
  Milestone,
  MilestoneApprovalStatus,
} from './deals.entities';
import DealModel from './deals.model';

export interface FindByUserQuery {
  status?: DealStatus;
}

@Injectable()
export class DealsRepository extends MongooseRepository<Deal> {
  constructor() {
    super(DealModel);
  }

  async findByUser(userId: string, query: FindByUserQuery): Promise<Deal[]> {
    return (
      await this.find({
        $or: [{ buyerId: userId }, { supplierId: userId }],
        ...query,
      })
    ).map((deal) => {
      if (deal.buyerId === userId && deal.newForBuyer) {
        deal.new = true;
      } else if (deal.supplierId === userId && deal.newForSupplier) {
        deal.new = true;
      }

      return deal;
    });
  }

  async findByEmail(email: string): Promise<Deal> {
    return this.findOne({ email });
  }

  async pushDocument(
    dealId: string,
    document: { url: string; description: string },
  ): Promise<DocumentFile> {
    const deal = await DealModel.findByIdAndUpdate(
      dealId,
      {
        $push: { docs: document },
      },
      { new: true },
    );

    return deal.docs[deal.docs.length - 1];
  }

  async pullDocument(dealId: string, docId: string): Promise<DocumentFile> {
    const deal = await DealModel.findByIdAndUpdate(
      dealId,
      {
        $pull: { docs: { _id: docId } },
      },
      { new: true },
    );

    return deal.docs[deal.docs.length - 1];
  }

  async pushMilestoneDocument(
    dealId: string,
    milestoneId: string,
    document: { url: string; description: string },
  ): Promise<DocumentFile> {
    const deal = await DealModel.findOneAndUpdate(
      { _id: dealId, 'milestones._id': milestoneId },
      {
        $set: { newDocuments: true },
        $push: { 'milestones.$.docs': document },
      },
      { new: true },
    );

    const milestone = deal.milestones.find(
      (m) => m.toJSON().id === milestoneId,
    );

    if (!milestone) {
      throw new NotFoundError('milestone not found');
    }

    const doc = milestone.docs.pop();

    return doc.toJSON();
  }

  async upadteMilestoneStatus(
    dealId: string,
    milestoneId: string,
    approvalStatus: MilestoneApprovalStatus,
  ): Promise<Milestone> {
    const update: UpdateQuery<Deal> = {
      $set: { 'milestones.$.approvalStatus': approvalStatus },
    };

    if (approvalStatus === MilestoneApprovalStatus.Approved) {
      update.$inc = { currentMilestone: 1 };
    }

    const deal = await DealModel.findOneAndUpdate(
      { _id: dealId, 'milestones._id': milestoneId },
      update,
      { new: true },
    );

    const milestone = deal.milestones.find(
      (m) => m.toJSON().id === milestoneId,
    );

    if (!milestone) {
      throw new NotFoundError('milestone not found');
    }

    return milestone.toJSON();
  }

  async pullMilestoneDocument(
    dealId: string,
    milestoneId: string,
    docId: string,
  ): Promise<void> {
    await DealModel.findOneAndUpdate(
      { _id: dealId, 'milestones._id': milestoneId },
      {
        $pull: { 'milestones.$.docs': { _id: docId } },
      },
      { new: true },
    );
  }

  async assignUserToDeals(
    userId: string,
    userEmail: string,
    accountType: AccountType,
  ): Promise<void> {
    if (accountType === AccountType.Buyer) {
      await DealModel.updateMany(
        { proposalBuyerEmail: userEmail },
        { $set: { buyerId: userId } },
      );
    } else if (accountType === AccountType.Supplier) {
      await DealModel.updateMany(
        { proposalSupplierEmail: userEmail },
        { $set: { supplierId: userId } },
      );
    } else {
      logger.warn(
        `Impossible to assign user to deal with account type ${accountType}`,
      );
    }
  }

  async findDealsLogs(dealId: string): Promise<DealLog[]> {
    const logs = await DealsLogs.find({ dealId });
    return logs.map((l) => l.toJSON());
  }
}
