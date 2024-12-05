import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import contracts from './addresses/vaults.json';
import deployed from './addresses/deployed.json';

const vaultAddress = '0xead0ceCD53c8B263AAB6752106Bf4282E93e9eE1';
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
