import { expect } from 'chai';
import hre from 'hardhat';
import { Account, GetContractReturnType, parseEther } from 'viem';
import {
  decodeDealManagerEvents,
  deploy,
  setupCompleteDealToRedeem,
  setupPartialDealToRedeem,
  setupUnstartedDealToRedeem,
} from './utils';
import { Accounts } from './types';

const accounts: Accounts = {} as any;

describe('DealsManager', function () {
  before(async () => {
    const [wallet1, wallet2, wallet3, wallet4] =
      await hre.viem.getWalletClients();

    accounts.deployerAccount = wallet1.account;
    accounts.financialAccount = wallet2.account;
    accounts.dealsManagerAccount = wallet3.account;
    accounts.investorAccount = wallet4.account;
  });

  describe('Deployment', () => {
    let erc20: GetContractReturnType;
    let dealsManager: GetContractReturnType;

    it('deploy erc20 mock', async () => {
      erc20 = await hre.viem.deployContract('ERC20Mock');
    });

    it('deploy deals manager', async () => {
      dealsManager = await hre.viem.deployContract('DealsManager', [
        accounts.dealsManagerAccount.address,
        erc20.address,
      ]);
    });
  });

  describe('DealsManger', () => {
    describe('mint', () => {
      it('should fail if milestones funds distribution is not equal to 100', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 1, 0, 0, 0, 0];
        const vaultFunds = parseEther('100');
        await expect(
          dealsManager.write.mint(
            [milestones, vaultFunds, accounts.financialAccount.address],
            { account: accounts.dealsManagerAccount }
          )
        ).to.rejectedWith('Milestones distribution should be 100');
      });

      it('should generate deal if account used is the deals manager account', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 100, 0, 0, 0, 0];
        const vaultFunds = parseEther('100');

        const hash = await dealsManager.write.mint(
          [milestones, vaultFunds, accounts.financialAccount.address],
          { account: accounts.dealsManagerAccount }
        );

        const receipt = await (
          await hre.viem.getPublicClient()
        ).getTransactionReceipt({ hash });

        expect(receipt.logs).to.have.length(4);

        const parsedEvents = decodeDealManagerEvents(receipt, dealsManager.abi);

        const dealCreated = parsedEvents.find(
          (e) => (e.eventName = 'DealCreated') && 'dealId' in e.args
        );
        expect(dealCreated).to.be.not.null;
        expect(dealCreated?.args).to.be.deep.equal({ dealId: BigInt('0') });

        const hash2 = await dealsManager.write.mint(
          [milestones, vaultFunds, accounts.financialAccount.address],
          { account: accounts.dealsManagerAccount }
        );

        const receipt2 = await (
          await hre.viem.getPublicClient()
        ).getTransactionReceipt({ hash: hash2 });

        expect(receipt2.logs).to.have.length(4);

        const parsedEvents2 = decodeDealManagerEvents(
          receipt2,
          dealsManager.abi
        );

        const dealCreated2 = parsedEvents2.find(
          (e) => (e.eventName = 'DealCreated') && 'dealId' in e.args
        );
        expect(dealCreated2).to.be.not.null;
        expect(dealCreated2?.args).to.be.deep.equal({ dealId: BigInt('1') });
      });
    });

    describe('read deals details', () => {
      it('should be possible to get milestones, status and vault of minted deals', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 100, 0, 0, 0, 0];
        const vaultFunds = parseEther('100');
        const hash = await dealsManager.write.mint(
          [milestones, vaultFunds, accounts.financialAccount.address],
          { account: accounts.dealsManagerAccount }
        );

        const dealStatus = await dealsManager.read.status([BigInt(0)]);
        const dealMilestones = await dealsManager.read.milestones([BigInt(0)]);
        const dealVault = await dealsManager.read.vault([BigInt(0)]);

        expect(dealStatus).to.be.equal(0);
        expect(dealMilestones).to.be.deep.equal(milestones);
        expect(dealVault).to.contains('0x');
      });
    });

    describe('proceed', () => {
      it('should fail if there is an attempt of skip milestone', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 100, 0, 0, 0, 0];
        const vaultFunds = parseEther('100');
        const hash = await dealsManager.write.mint(
          [milestones, vaultFunds, accounts.financialAccount.address],
          { account: accounts.dealsManagerAccount }
        );

        await expect(
          dealsManager.write.proceed([BigInt(0), 2], {
            account: accounts.dealsManagerAccount,
          })
        ).to.be.rejectedWith('wrong milestone to proceed to');
      });

      it('should fail to next milestone if vault was not funded', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 100, 0, 0, 0, 0];
        const vaultFunds = parseEther('100');
        await dealsManager.write.mint(
          [milestones, vaultFunds, accounts.financialAccount.address],
          { account: accounts.dealsManagerAccount }
        );

        await expect(
          dealsManager.write.proceed([BigInt(0), 1], {
            account: accounts.dealsManagerAccount,
          })
        ).to.be.rejectedWith('Vault not funded completely');
      });

      it('should be possible to set milestone 1 if the vault was totally funded', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [0, 0, 100, 0, 0, 0, 0];
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
        await erc20.write.approve([vaultAddress, parseEther('100')], {
          account: accounts.investorAccount,
        });

        // deposits investor funds
        await vault.write.deposit(
          [parseEther('100'), accounts.investorAccount.address],
          { account: accounts.investorAccount }
        );

        await dealsManager.write.proceed([BigInt(0), 1], {
          account: accounts.dealsManagerAccount,
        });

        const status = await dealsManager.read.status([BigInt(0)]);
        expect(status).to.be.equal(1);
      });

      it('should move 10% of the funds in milestone 1', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [50, 0, 0, 0, 0, 0, 50];
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
          { account: accounts.investorAccount }
        );

        await dealsManager.write.proceed([BigInt(0), 1], {
          account: accounts.dealsManagerAccount,
        });

        const status = await dealsManager.read.status([BigInt(0)]);
        expect(status).to.be.equal(1);

        const financialWalletBalance = await erc20.read.balanceOf([
          accounts.financialAccount.address,
        ]);

        expect(financialWalletBalance).to.be.equal(parseEther('50'));
      });

      it('should transfer all funds until the end of the deal', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ] = [10, 0, 20, 0, 30, 0, 40];
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
          { account: accounts.investorAccount }
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
        expect(status).to.be.equal(7);

        const financialWalletBalance = await erc20.read.balanceOf([
          accounts.financialAccount.address,
        ]);

        expect(financialWalletBalance).to.be.equal(vaultFunds);
      });
    });
  });
});

describe('DealVault', () => {
  before(async () => {
    const [wallet1, wallet2, wallet3, wallet4] =
      await hre.viem.getWalletClients();

    accounts.deployerAccount = wallet1.account;
    accounts.financialAccount = wallet2.account;
    accounts.dealsManagerAccount = wallet3.account;
    accounts.investorAccount = wallet4.account;
  });

  describe('redeem', () => {
    it('should transfer funds + interest', async () => {
      const { erc20, dealVault } = await setupCompleteDealToRedeem(
        hre,
        accounts
      );

      const investorBalance = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      expect(investorBalance).to.be.equal(parseEther('400'));

      const sharesToRedeem = await dealVault.read.maxRedeem([
        accounts.investorAccount.address,
      ]);

      await dealVault.write.redeem(
        [
          sharesToRedeem,
          accounts.investorAccount.address,
          accounts.investorAccount.address,
        ],
        {
          account: accounts.investorAccount,
        }
      );

      const investorBalanceEnd = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      const expectedBalance = parseEther('509');
      expect(+investorBalanceEnd.toString()).to.be.above(
        +expectedBalance.toString()
      );
    });

    it('should transfers funds if the deal did not start yet', async () => {
      const { erc20, dealVault } = await setupUnstartedDealToRedeem(
        hre,
        accounts
      );

      const investorBalance = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      expect(investorBalance).to.be.equal(parseEther('400'));

      const sharesToRedeem = await dealVault.read.maxRedeem([
        accounts.investorAccount.address,
      ]);

      await dealVault.write.redeem(
        [
          sharesToRedeem,
          accounts.investorAccount.address,
          accounts.investorAccount.address,
        ],
        {
          account: accounts.investorAccount,
        }
      );

      const investorBalanceEnd = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      expect(investorBalanceEnd).to.be.equal(parseEther('500'));
    });

    it('should fail because the deal is not completed', async () => {
      const { erc20, dealVault } = await setupPartialDealToRedeem(
        hre,
        accounts
      );

      const investorBalance = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      expect(investorBalance).to.be.equal(parseEther('400'));

      const sharesToRedeem = await dealVault.read.maxRedeem([
        accounts.investorAccount.address,
      ]);

      await expect(
        dealVault.write.redeem(
          [
            sharesToRedeem,
            accounts.investorAccount.address,
            accounts.investorAccount.address,
          ],
          {
            account: accounts.investorAccount,
          }
        )
      ).to.be.rejectedWith('Unfinished Deal');

      const amountToWithdraw = await dealVault.read.maxWithdraw([
        accounts.investorAccount.address,
      ]);

      await expect(
        dealVault.write.withdraw(
          [
            amountToWithdraw,
            accounts.investorAccount.address,
            accounts.investorAccount.address,
          ],
          {
            account: accounts.investorAccount,
          }
        )
      ).to.be.rejectedWith('Unfinished Deal');

      const investorBalanceEnd = await erc20.read.balanceOf([
        accounts.investorAccount.address,
      ]);

      expect(investorBalanceEnd).to.be.equal(parseEther('400'));
    });
  });
});
