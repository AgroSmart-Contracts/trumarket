import { Module } from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';

import { config } from '../config';
import { BlockchainService } from './blockchain.service';

@Module({
  controllers: [],
  providers: [
    BlockchainService,
    {
      provide: 'EvmProvider',
      useFactory: async (): Promise<PublicClient> => {
        const client = await createPublicClient({
          transport: http(config.blockchainRpcUrl),
        });
        return client as PublicClient;
      },
    },
  ],
  exports: [BlockchainService],
})
export class BlockchainModule {}
