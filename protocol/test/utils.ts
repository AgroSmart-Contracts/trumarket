import { TransactionReceipt, decodeEventLog, parseEther } from 'viem';
import { Accounts } from './types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export function decodeDealManagerEvents(receipt: TransactionReceipt, abi: any) {
  const parsedEvents: { eventName: string; args: any }[] = [];

  receipt.logs.forEach((log, index) => {
    console.log(index);
    try {
      const data = decodeEventLog({
        abi: abi,
        data: log.data,
        topics: log.topics,
      });
      console.log(data);
      parsedEvents.push(data);
    } catch (e) {
      console.log(e);
    }
  });

  return parsedEvents;
}

export async function deploy(
  hre: HardhatRuntimeEnvironment,
  accounts: Accounts
) {
  const erc20 = await hre.viem.deployContract('ERC20Mock');

  const dealsManager = await hre.viem.deployContract('DealsManager', [
    accounts.dealsManagerAccount.address,
    erc20.address,
  ]);

  return {
    erc20,
    dealsManager,
  };
}
