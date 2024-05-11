import { Module } from '@nestjs/common';

import { BlockchainModule } from '@/blockchain/blockchain.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { UsersModule } from '@/users/users.module';

import { DealsController } from './deals.controller';
import { DealsRepository } from './deals.repository';
import { DealsService } from './deals.service';

@Module({
  controllers: [DealsController],
  providers: [DealsService, DealsRepository],
  imports: [UsersModule, BlockchainModule, NotificationsModule],
  exports: [DealsService],
})
export class DealsModule {}
