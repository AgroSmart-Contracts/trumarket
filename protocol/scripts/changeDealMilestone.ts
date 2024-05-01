import hre from 'hardhat';
import deployed from './addresses/deployed.json';

async function main() {
  const [deployerAccount, financialAccount, dealsManagerAccount] =
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

  const tx = await dealsManager.write.proceed([0, 3]);

  console.log({ tx });

  const status = await dealsManager.read.status([0]);

  console.log({ status });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
