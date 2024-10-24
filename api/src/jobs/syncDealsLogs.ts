import { createPublicClient, http, parseAbi } from 'viem';

import { config } from '@/config';
import financeAppClient from '@/infra/finance-app/financeAppClient';

import DealsLogs from '../deals-logs/deals-logs.model';
import SyncDealsLogsJob from '../deals-logs/sync-deals-logs-job.model';
import { logger } from '../logger';

export const syncDealsLogs = async () => {
  logger.debug('Syncing deals logs');

  const jobs = await SyncDealsLogsJob.find();

  if (!jobs.length) {
    const job = await SyncDealsLogsJob.create({
      contract: config.dealsManagerContractAddress,
      lastBlock: 0,
      type: 'syncDealsLogs',
    });
    jobs.push(job);
  }

  await Promise.all(
    jobs.map(async (job) => {
      try {
        logger.debug({ contract: job.contract }, 'Syncing deals logs');
        const client = createPublicClient({
          transport: http(config.blockchainRpcUrl as string),
        });

        const fromBlock = job.lastBlock
          ? BigInt(job.lastBlock + 1)
          : BigInt('0');
        const toBlock = await client.getBlockNumber();

        logger.debug({ fromBlock, toBlock }, 'got block number');

        if (fromBlock > toBlock) {
          return;
        }

        logger.debug(
          {
            fromBlock,
            toBlock,
            contractAddress: job.contract,
          },
          'syncing deals logs from deals contract',
        );
        const logs = await client.getLogs({
          fromBlock,
          toBlock,
          address: job.contract as `0x${string}`,
          events: parseAbi([
            `event DealCreated(uint256 dealId)`,
            `event DealMilestoneChanged(uint256 dealId, uint8 milestone)`,
            `event DealCompleted(uint256 dealId)`,
          ]),
        });

        const dealsLogs = logs.map((log) => {
          const dealLog: any = {
            dealId: +log.args.dealId.toString(),
            event: log.eventName,
            args: log.args,
            blockNumber: +log.blockNumber.toString(),
            blockTimestamp: new Date(),
            txHash: log.transactionHash,
            message: '',
          };

          switch (log.eventName) {
            case 'DealCreated':
              dealLog.message = 'Deal created.';
              break;
            case 'DealCompleted':
              dealLog.message = 'Deal completed.';
              break;
            case 'DealMilestoneChanged':
              dealLog.message = `Deal status changed to milestone ${log.args.milestone}.`;
              break;
          }

          return dealLog;
        });

        await Promise.all(
          dealsLogs.map(async (dealLog) => {
            try {
              console.log(
                dealLog.dealId.toString(),
                dealLog.event,
                dealLog.message,
                dealLog.txHash,
              );
              await financeAppClient.createActivity(
                dealLog.dealId.toString(),
                dealLog.event,
                dealLog.message,
                dealLog.txHash,
                dealLog.blockTimestamp,
              );
            } catch (err) {
              console.warn(
                `Error creating activity for deal ${dealLog.dealId}: ${err.message}`,
              );
            }
          }),
        );

        await DealsLogs.create(dealsLogs);
        await SyncDealsLogsJob.findByIdAndUpdate(job._id, {
          $set: {
            lastBlock: +toBlock.toString(),
            lastExecution: new Date(),
            lastStatus: 'success',
            error: '',
          },
        });
      } catch (err) {
        await SyncDealsLogsJob.findByIdAndUpdate(job._id, {
          $set: {
            lastExecution: new Date(),
            lastStatus: 'failed',
            error: err.message,
          },
        });
      }
    }),
  );
};
