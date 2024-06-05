import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';

import { logger } from '@/logger';

import { Notification } from './notifications.entities';

@Injectable()
export class SubscriptionsService {
  subscriptions: Record<string, webpush.PushSubscription> = {};

  register(email: string, subscription: webpush.PushSubscription) {
    logger.info({ subscription }, `Registering subscription for ${email}`);
    this.subscriptions[email] = subscription;
  }

  send(email: string, notification: Notification) {
    if (this.subscriptions[email] === undefined) {
      logger.warn(`No subscription found for ${email}`);
      return;
    }

    webpush
      .sendNotification(this.subscriptions[email], JSON.stringify(notification))
      .catch((err) => {
        if (err.statusCode === 410) delete this.subscriptions[email];
      });
  }
}
