import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { config } from '@/config';

import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [NotificationsController],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.emailHost,
        auth: {
          user: config.emailUsername,
          pass: config.emailPassword,
        },
      },
      defaults: {
        from: `"TruMarket" <${config.mailTo}>`,
      },
    }),
  ],
  providers: [
    NotificationsService,
    NotificationsRepository,
    SubscriptionsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
