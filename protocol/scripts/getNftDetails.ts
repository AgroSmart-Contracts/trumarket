import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import contracts from './addresses/vaults.json';
import deployed from './addresses/deployed.json';

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  const dealsManager = await hre.viem.getContractAt(
    'DealsManager' as string,
    deployed['Deals Manager'] as `0x${string}`
  );

  const status = await dealsManager.read.status([0]);
  const vaultAddress = await dealsManager.read.vault([0]);

  console.log({ status, vaultAddress });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
