import hre from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [dealsManagerAccount] = await hre.viem.getWalletClients();

  const erc20 = await hre.viem.deployContract('ERC20Mock');

  console.log(`ERC20 deployed to ${erc20.address}`);

  const dealsManager = await hre.viem.deployContract('DealsManager', [
    dealsManagerAccount.account.address,
    erc20.address,
  ]);

  console.log(`Deals Manager deployed to ${dealsManager.address}`);

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
