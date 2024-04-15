import { formatEther } from 'viem';
import { parseEther } from 'viem';
import hre from 'hardhat';

import deployed from './addresses/deployed.json';

const wallet = '0x6bc9A4Cd646754f3bEd42b779F9b0C061D279e9D';

async function main() {
  const [deployerAccount, financialAccount, dealsManagerAccount] =
    await hre.viem.getWalletClients();

  const erc20 = await hre.viem.getContractAt(
    'ERC20Mock',
    deployed['ERC20'] as `0x${string}`
  );

  await erc20.write.mint([wallet, parseEther('10000')]);
  await deployerAccount.sendTransaction({
    to: wallet,
    value: parseEther('100'),
  });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
