import DealsLogs from '../deals-logs/deals-logs.model';
import SyncDealsLogsJob from '../deals-logs/sync-deals-logs-job.model';
import { logger } from '../logger';
import { createPublicClient, http, parseAbi } from 'viem';

export const syncDealsLogs = async () => {
  logger.debug('Syncing deals logs');

  const jobs = await SyncDealsLogsJob.find();

  await Promise.all(
    jobs.map(async (job) => {
      try {
        const client = createPublicClient({
          transport: http(job.chainProvider),
        });

        const fromBlock = job.lastBlock
          ? BigInt(job.lastBlock + 1)
          : BigInt('0');
        const toBlock = await client.getBlockNumber();

        if (fromBlock > toBlock) {
          return;
        }

        logger.debug(
          {
            fromBlock,
            toBlock,
            contractAddress: job.contract,
            provider: job.chainProvider,
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
