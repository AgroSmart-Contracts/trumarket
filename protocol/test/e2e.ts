import { expect } from 'chai';
import hre from 'hardhat';
import { GetContractReturnType, parseEther } from 'viem';
import { decodeDealManagerEvents, deploy } from './utils';
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

        expect(receipt.logs).to.have.length(2);

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

        expect(receipt2.logs).to.have.length(2);

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

        expect(dealStatus).to.be.equal(0);
        expect(dealMilestones).to.be.deep.equal(milestones);
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
    });
  });
});
