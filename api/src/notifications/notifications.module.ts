import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { config } from '@/config';

import { NotificationsService } from './notifications.service';

@Module({
  controllers: [],
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
        from: '"TruMarket" <Alessandro.cordano@trumarket.tech>',
      },
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
