import { Injectable } from '@nestjs/common';

import { MongooseRepository } from '@/repository.mongoose';

import { Notification } from './notifications.entities';
import { NotificationsModel } from './notifications.model';

@Injectable()
export class NotificationsRepository extends MongooseRepository<Notification> {
  constructor() {
    super(NotificationsModel);
  }

  bulkCreateByRecipent(
    recipients: string[],
    notification: Partial<Notification>,
  ): Promise<Notification[]> {
    const notifications = recipients.map((recipient) => ({
      userId: recipient,
      ...notification,
    }));

    return this.createMany(notifications);
  }

  markAsRead(userId: string, notificationId: string): Promise<number> {
    return this.update(
      { _id: notificationId, userId },
      { $set: { read: true } },
    );
  }

  markAsReadByDealId(userId: string, dealId: string): Promise<number> {
    return this.update({ dealId: dealId, userId }, { $set: { read: true } });
  }
}
