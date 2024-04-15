import { parseAbi, parseEther } from 'viem';
import hre from 'hardhat';
import deployed from './addresses/deployed.json';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployerAccount, financialAccount, dealsManagerAccount] =
    await hre.viem.getWalletClients();

  const dealsManager = await hre.viem.getContractAt(
    'DealsManager' as string,
    deployed['Deals Manager'] as `0x${string}`,
    {
      client: { wallet: dealsManagerAccount },
    }
  );

  const provider = await hre.viem.getPublicClient();

  const startBlock = BigInt(0);
  const endBlock = await provider.getBlockNumber();

  const logs = await provider.getLogs({
    fromBlock: startBlock,
    toBlock: endBlock,
    address: deployed['Deals Manager'] as `0x${string}`,
    events: parseAbi([
      `event DealCreated(uint256 dealId)`,
      `event DealMilestoneChanged(uint256 dealId, uint8 milestone)`,
      `event DealCompleted(uint256 dealId)`,
    ]),
  });

  logs.forEach((log) => {
    console.log(log);
  });

  const block = await provider.getBlock({
    blockNumber: BigInt(5),
  });

  console.log(new Date(+block.timestamp.toString() * 1000));
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
