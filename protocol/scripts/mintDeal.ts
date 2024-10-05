import { parseAbi, parseEther, parseEventLogs } from 'viem';
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

  const tx = await dealsManager.write.mint([
    [0, 0, 100, 0, 0, 0, 0],
    parseEther('100'),
    financialAccount.account.address,
  ]);

  const provider = await hre.viem.getPublicClient();

  const receipt = await provider.getTransactionReceipt({
    hash: tx,
  });

  const logs = parseEventLogs({
    abi: parseAbi([`event DealCreated(uint256 dealId)`]),
    eventName: 'DealCreated',
    logs: receipt.logs,
  });

  // await dealsManager.write.proceed([1, 1]);

  const status = await dealsManager.read.status([0]);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
