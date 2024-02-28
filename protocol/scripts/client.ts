import { parseEther, formatEther } from 'viem';
import hre from 'hardhat';

async function main() {
  const [bobWalletClient, aliceWalletClient] =
    await hre.viem.getWalletClients();

  const publicClient = await hre.viem.getPublicClient();
  const bobBalance = await publicClient.getBalance({
    address: bobWalletClient.account.address,
  });

  console.log(
    `Balance of ${bobWalletClient.account.address}: ${formatEther(
      bobBalance
    )} ETH`
  );

  // const hash = await bobWalletClient.sendTransaction({
  //   to: aliceWalletClient.account.address,
  //   value: parseEther('1'),
  // });
  // await publicClient.waitForTransactionReceipt({ hash });

  const lockContract = await hre.viem.getContractAt(
    'Lock',
    '0x5fbdb2315678afecb367f032d93f642f64180aa3'
  );

  console.log(await lockContract.read.owner());
  const unlockTime = await lockContract.read.unlockTime();
  console.log(new Date(Number(unlockTime) * 1000));

  await lockContract.write.withdraw();
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
