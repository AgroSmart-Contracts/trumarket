import { Logger, Module } from '@nestjs/common';

import { BlockchainModule } from '@/blockchain/blockchain.module';
import { DealsModule } from '@/deals/deals.module';
import { UsersModule } from '@/users/users.module';

import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, BlockchainModule, DealsModule],
  controllers: [AdminController],
  providers: [Logger],
  exports: [],
})
export class AdminModule {}
