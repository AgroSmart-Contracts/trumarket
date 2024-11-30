import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import contracts from './addresses/vaults.json';
import deployed from './addresses/deployed.json';

const vaultAddress = '0xbf9fBFf01664500A33080Da5d437028b07DFcC55';
//  || contracts['dealVault'];

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  const vault = await hre.viem.getContractAt(
    'DealVault' as string,
    vaultAddress as `0x${string}`
  );

  const totalAssets = await vault.read.totalAssets([], {
    account: bobWalletClient.account,
  });
  const maxDeposit = await vault.read.maxDeposit([vaultAddress], {
    account: bobWalletClient.account,
  });

  console.log({ totalAssets, maxDeposit });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
