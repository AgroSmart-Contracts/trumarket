import hre from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';
import { parseEther } from 'viem';

async function main() {
  const [deployerAccount, financialAccount, dealsManagerAccount] =
    await hre.viem.getWalletClients();

  const erc20 = await hre.viem.deployContract('ERC20Mock');

  console.log(`ERC20 deployed to ${erc20.address}`);

  const dealsManager = await hre.viem.deployContract('DealsManager', [
    dealsManagerAccount.account.address,
    erc20.address,
  ]);

  console.log(`Deals Manager deployed to ${dealsManager.address}`);

  // const maxDeposit = parseEther('100');
  // const maxMint = parseEther('108');

  // const dealVault = await hre.viem.deployContract('DealVault', [
  //   erc20.address,
  //   maxDeposit,
  //   maxMint,
  // ]);

  fs.writeFileSync(
    path.join(__dirname, './addresses/deployed.json'),
    `
{
  "Deals Manager":"${dealsManager.address}",
  "ERC20":"${erc20.address}"
}
`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
