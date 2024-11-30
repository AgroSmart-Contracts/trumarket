import { parseEther } from 'viem';
import hre from 'hardhat';
import deployed from './addresses/deployed.json';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [bobWalletClient, aliceWalletClient, dealsManagerAccount] =
    await hre.viem.getWalletClients();

  const dealsManager = await hre.viem.getContractAt(
    'DealsManager' as string,
    deployed['Deals Manager'] as `0x${string}`,
    {
      client: {
        wallet: dealsManagerAccount,
      },
    }
  );

  const tx = await dealsManager.write.mint([
    [0, 0, 100, 0, 0, 0, 0],
    parseEther('0'),
    dealsManagerAccount.account.address,
  ]);

  // await dealsManager.write.proceed([2, 1]);

  const status = await dealsManager.read.status([0]);

  console.log('Minted NFT with next details:', {
    owner: dealsManagerAccount.account.address,
    milestones: [0, 0, 100, 0, 0, 0, 0],
    status,
  });

  const vault = await dealsManager.read.vault([0]);

  fs.writeFileSync(
    path.join(__dirname, './addresses/vaults.json'),
    `
{
  "dealVault":"${vault}"
}
`
  );
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
