import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import contracts from './addresses/vaults.json';
import deployed from './addresses/deployed.json';

const vaultAddress =
  '0xCafac3dD18aC6c6e92c921884f9E4176737C052c' || contracts['dealVault'];

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  const vault = await hre.viem.getContractAt(
    'DealVault' as string,
    vaultAddress as `0x${string}`
  );
  const erc20 = await hre.viem.getContractAt(
    'ERC20Mock',
    deployed['ERC20'] as `0x${string}`
  );

  const bobErc20Amount = parseEther('100');
  await erc20.write.mint([bobWalletClient.account.address, bobErc20Amount]);

  await erc20.write.approve([vaultAddress as `0x${string}`, parseEther('100')]);

  await vault.write.deposit(
    [parseEther('100'), bobWalletClient.account.address],
    { account: bobWalletClient.account }
  );
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
