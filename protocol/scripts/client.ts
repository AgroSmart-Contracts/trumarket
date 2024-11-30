import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

const deployed: Record<string, `0x${string}`> = {
  'Deals Manager': '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  ERC20: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  'Deal Vault': '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
};

const whitelistActions = {
  mintDeal: false,
  mintERC20forBob: false,
  mintERC20forVault: false,
  mintBobShares: false,
  redeemBobShares: false,
};

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  if (whitelistActions.mintDeal) {
    const dealsManager = await hre.viem.getContractAt(
      'DealsManager' as string,
      deployed['Deals Manager']
    );
    await dealsManager.write.mint();

    const deals = await dealsManager.read.balanceOf([
      bobWalletClient.account.address,
    ]);

    console.log(deals);
  }

  const erc20 = await hre.viem.getContractAt('ERC20Mock', deployed['ERC20']);

  if (whitelistActions.mintERC20forBob) {
    const bobErc20Amount = parseEther('10');
    await erc20.write.mint([bobWalletClient.account.address, bobErc20Amount]);
  }

  if (whitelistActions.mintERC20forVault) {
    const vaultErc20Amount = parseEther('10');
    await erc20.write.mint([deployed['Deal Vault'], vaultErc20Amount]);
  }

  console.log(
    `BOB: ${formatEther(
      await erc20.read.balanceOf([bobWalletClient.account.address])
    )} tokens`
  );

  const dealVault = await hre.viem.getContractAt(
    'DealVault',
    deployed['Deal Vault']
  );

  if (whitelistActions.mintBobShares) {
    await erc20.write.approve([deployed['Deal Vault'], parseEther('5')]);

    await dealVault.write.deposit(
      [parseEther('5'), bobWalletClient.account.address],
      { account: bobWalletClient.account }
    );
  }

  if (whitelistActions.redeemBobShares) {
    await dealVault.write.redeem([
      parseEther('5'),
      bobWalletClient.account.address,
      bobWalletClient.account.address,
    ]);
  }

  console.log(
    `BOB: ${formatEther(
      await dealVault.read.balanceOf([bobWalletClient.account.address])
    )} shares`
  );
  console.log(
    `DEAL VAULT: ${formatEther(
      await erc20.read.balanceOf([deployed['Deal Vault']])
    )} tokens`
  );
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
