import { Inject, Injectable } from '@nestjs/common';
import { parseAbi, parseEventLogs, PublicClient, verifyMessage } from 'viem';

import { InternalServerError } from '../errors';

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('EvmProvider')
    private evmProvider: PublicClient,
  ) {}

  async getNftID(txHash: string): Promise<number> {
    const receipt = await this.evmProvider.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    const logs = parseEventLogs({
      abi: parseAbi([`event DealCreated(uint256 dealId)`]),
      eventName: 'DealCreated',
      logs: receipt.logs,
    });

    if (!logs.length) {
      throw new InternalServerError('no deal created event was emitted');
    }

    return Number(logs[0].args.dealId);
  }

  async verifyMessage(
    walletAddress: `0x${string}`,
    message: string,
    signature: `0x${string}`,
  ): Promise<boolean> {
    return verifyMessage({
      address: walletAddress,
      message: message,
      signature: signature,
    });
  }
}
