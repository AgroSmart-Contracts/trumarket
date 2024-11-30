import { parseEther } from 'viem';
import hre from 'hardhat';

import deployed from './addresses/deployed.json';

async function main() {
  const [deployerAccount, financialAccount, dealsManagerAccount] =
    await hre.viem.getWalletClients();

  const erc20 = await hre.viem.getContractAt(
    'ERC20Mock',
    deployed['ERC20'] as `0x${string}`
  );

  await erc20.write.mint([
    deployerAccount.account.address,
    parseEther('10000'),
  ]);
  await erc20.write.mint([
    financialAccount.account.address,
    parseEther('10000'),
  ]);
  await erc20.write.mint([
    dealsManagerAccount.account.address,
    parseEther('10000'),
  ]);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
