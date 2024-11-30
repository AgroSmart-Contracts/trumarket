import { TransactionReceipt, decodeEventLog, parseEther } from 'viem';
import { Accounts } from './types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export function decodeDealManagerEvents(receipt: TransactionReceipt, abi: any) {
  const parsedEvents: { eventName: string; args: any }[] = [];

  receipt.logs.forEach((log, index) => {
    console.log(index);
    try {
      const data: any = decodeEventLog({
        abi: abi,
        data: log.data,
        topics: log.topics,
      });
      console.log(data);
      parsedEvents.push(data);
    } catch (e) {
      console.log(e);
    }
  });

  return parsedEvents;
}

export async function deploy(
  hre: HardhatRuntimeEnvironment,
  accounts: Accounts
) {
  const erc20 = await hre.viem.deployContract('ERC20Mock');

  const dealsManager = await hre.viem.deployContract('DealsManager', [
    accounts.dealsManagerAccount.address,
    erc20.address,
  ]);

  return {
    erc20,
    dealsManager,
  };
}

export async function setupCompleteDealToRedeem(
  hre: HardhatRuntimeEnvironment,
  accounts: Accounts
) {
  const { dealsManager, erc20 } = await deploy(hre, accounts);
  const milestones: [number, number, number, number, number, number, number] = [
    10, 0, 20, 0, 30, 0, 40,
  ];
  const vaultFunds = parseEther('100');
  await dealsManager.write.mint(
    [milestones, vaultFunds, accounts.financialAccount.address],
    { account: accounts.dealsManagerAccount }
  );

  const vaultAddress = await dealsManager.read.vault([BigInt(0)]);
  const vault = await hre.viem.getContractAt('DealVault', vaultAddress);

  // mint investor tokens
  await erc20.write.mint(
    [accounts.investorAccount.address, parseEther('500')],
    {
      account: accounts.deployerAccount,
    }
  );

  // allow vault to transfer investor funds
  await erc20.write.approve([vaultAddress, vaultFunds], {
    account: accounts.investorAccount,
  });

  // deposits investor funds
  await vault.write.deposit(
    [parseEther('100'), accounts.investorAccount.address],
    {
      account: accounts.investorAccount,
    }
  );

  await dealsManager.write.proceed([BigInt(0), 1], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 2], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 3], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 4], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 5], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 6], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 7], {
    account: accounts.dealsManagerAccount,
  });

  const status = await dealsManager.read.status([BigInt(0)]);
  // expect(status).to.be.equal(7);

  const financialWalletBalance = await erc20.read.balanceOf([
    accounts.financialAccount.address,
  ]);

  // expect(financialWalletBalance).to.be.equal(vaultFunds);

  await erc20.write.mint([accounts.financialAccount.address, parseEther('10')]);

  const financialWalletBalanceWithInterests = await erc20.read.balanceOf([
    accounts.financialAccount.address,
  ]);

  // expect(financialWalletBalanceWithInterests).to.be.equal(parseEther('110'));

  const dealVaultAddress = await dealsManager.read.vault([BigInt(0)]);

  await erc20.write.transfer([dealVaultAddress, parseEther('110')], {
    account: accounts.financialAccount,
  });

  const vaultBalance = await erc20.read.balanceOf([dealVaultAddress]);

  // expect(vaultBalance).to.be.equal(parseEther('110'));

  await dealsManager.write.setDealCompleted([BigInt(0)], {
    account: accounts.dealsManagerAccount,
  });

  const dealVault = await hre.viem.getContractAt('DealVault', dealVaultAddress);

  return {
    dealVault,
    erc20,
  };
}

export async function setupPartialDealToRedeem(
  hre: HardhatRuntimeEnvironment,
  accounts: Accounts
) {
  const { dealsManager, erc20 } = await deploy(hre, accounts);
  const milestones: [number, number, number, number, number, number, number] = [
    10, 0, 20, 0, 30, 0, 40,
  ];
  const vaultFunds = parseEther('100');
  await dealsManager.write.mint(
    [milestones, vaultFunds, accounts.financialAccount.address],
    { account: accounts.dealsManagerAccount }
  );

  const vaultAddress = await dealsManager.read.vault([BigInt(0)]);
  const vault = await hre.viem.getContractAt('DealVault', vaultAddress);

  // mint investor tokens
  await erc20.write.mint(
    [accounts.investorAccount.address, parseEther('500')],
    {
      account: accounts.deployerAccount,
    }
  );

  // allow vault to transfer investor funds
  await erc20.write.approve([vaultAddress, vaultFunds], {
    account: accounts.investorAccount,
  });

  // deposits investor funds
  await vault.write.deposit(
    [parseEther('100'), accounts.investorAccount.address],
    {
      account: accounts.investorAccount,
    }
  );

  await dealsManager.write.proceed([BigInt(0), 1], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 2], {
    account: accounts.dealsManagerAccount,
  });
  await dealsManager.write.proceed([BigInt(0), 3], {
    account: accounts.dealsManagerAccount,
  });

  const dealVaultAddress = await dealsManager.read.vault([BigInt(0)]);

  const dealVault = await hre.viem.getContractAt('DealVault', dealVaultAddress);

  return {
    dealVault,
    erc20,
  };
}

export async function setupUnstartedDealToRedeem(
  hre: HardhatRuntimeEnvironment,
  accounts: Accounts
) {
  const { dealsManager, erc20 } = await deploy(hre, accounts);
  const milestones: [number, number, number, number, number, number, number] = [
    10, 0, 20, 0, 30, 0, 40,
  ];
  const vaultFunds = parseEther('100');
  await dealsManager.write.mint(
    [milestones, vaultFunds, accounts.financialAccount.address],
    { account: accounts.dealsManagerAccount }
  );

  const vaultAddress = await dealsManager.read.vault([BigInt(0)]);
  const vault = await hre.viem.getContractAt('DealVault', vaultAddress);

  // mint investor tokens
  await erc20.write.mint(
    [accounts.investorAccount.address, parseEther('500')],
    {
      account: accounts.deployerAccount,
    }
  );

  // allow vault to transfer investor funds
  await erc20.write.approve([vaultAddress, vaultFunds], {
    account: accounts.investorAccount,
  });

  // deposits investor funds
  await vault.write.deposit(
    [parseEther('100'), accounts.investorAccount.address],
    {
      account: accounts.investorAccount,
    }
  );

  const status = await dealsManager.read.status([BigInt(0)]);
  // expect(status).to.be.equal(7);

  const financialWalletBalance = await erc20.read.balanceOf([
    accounts.financialAccount.address,
  ]);

  // expect(financialWalletBalance).to.be.equal(vaultFunds);

  const dealVaultAddress = await dealsManager.read.vault([BigInt(0)]);

  // expect(vaultBalance).to.be.equal(parseEther('110'));

  const dealVault = await hre.viem.getContractAt('DealVault', dealVaultAddress);

  return {
    dealVault,
    erc20,
  };
}
