import { privateKeyToAccount } from 'viem/accounts';
import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import contracts from './addresses/vaults.json';
import deployed from './addresses/deployed.json';

const pk = '0xe91d1e08333eb6e5ac05905ad77994df445e81213c49d59821f5b2ba8415b7f6';
const vaultAddress = '0xCf3d072edE5dD8bF26915896856237F9b25A4BD0';
//  || contracts['dealVault'];

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  const account = privateKeyToAccount(pk);

  const vault = await hre.viem.getContractAt(
    'DealVault' as string,
    vaultAddress as `0x${string}`
  );

  const totalAssets = await vault.read.totalAssets([], {
    account: bobWalletClient.account,
  });

  const totalToRedeem = await vault.read.maxRedeem([account.address], {
    account,
  });
  // const maxDeposit = await vault.read.maxDeposit([vaultAddress], {
  //   account: bobWalletClient.account,
  // });
  const maxDeposit = 0;

  // await vault.write.redeem([totalToRedeem, account.address, account.address], {
  //   account,
  // });

  console.log({ totalAssets, maxDeposit, totalToRedeem });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
