import { expect } from 'chai';
import hre from 'hardhat';
import { ethers } from 'ethers';
import { deploy, decodeDealManagerEvents, Accounts } from './setup';
import { DealsManager, ERC20Mock, DealVault } from '../typechain-types';
import '@nomicfoundation/hardhat-ethers';

const accounts: Accounts = {} as any;

describe('DealsManager', function () {
  before(async () => {
    const [wallet1, wallet2, wallet3, wallet4] =
      await hre.ethers.getSigners();

    accounts.deployerAccount = wallet1;
    accounts.financialAccount = wallet2;
    accounts.dealsManagerAccount = wallet3;
    accounts.investorAccount = wallet4;
  });

  describe('Deployment', () => {
    let erc20: ERC20Mock;
    let dealsManager: DealsManager;

    it('deploy erc20 mock', async () => {
      const ERC20Mock = await hre.ethers.getContractFactory('ERC20Mock');
      erc20 = await ERC20Mock.connect(accounts.deployerAccount).deploy();
    });

    it('deploy deals manager', async () => {
      const DealsManager = await hre.ethers.getContractFactory('DealsManager');
      dealsManager = await DealsManager.connect(accounts.deployerAccount).deploy(
        accounts.dealsManagerAccount.address,
        erc20.target
      );
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
        const vaultFunds = ethers.parseEther('100');
        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).mint(
            milestones,
            vaultFunds,
            accounts.financialAccount.address
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
        const vaultFunds = ethers.parseEther('100');

        const tx = await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        const receipt = await tx.wait();
        expect(receipt).to.not.be.null;
        if (!receipt) return;

        expect(receipt.logs).to.have.length(5);

        const parsedEvents = decodeDealManagerEvents(receipt, dealsManager.interface.formatJson());
        const dealCreated = parsedEvents.find(
          (e) => e && e.eventName === 'DealCreated'
        );
        expect(dealCreated).to.not.be.null;
        expect(dealCreated?.args).to.deep.equal({
          dealId: BigInt(0),
          borrower: accounts.financialAccount.address,
          maxDeposit: vaultFunds
        });
      });

      it('should fail if borrower address is zero', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [0, 0, 100, 0, 0, 0, 0];
        const vaultFunds = ethers.parseEther('100');

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).mint(
            milestones,
            vaultFunds,
            ethers.ZeroAddress
          )
        ).to.be.rejectedWith('Invalid borrower address');
      });

      it('should fail if max deposit is zero', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [0, 0, 100, 0, 0, 0, 0];

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).mint(
            milestones,
            0,
            accounts.financialAccount.address
          )
        ).to.be.rejectedWith('Max deposit must be positive');
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
        const vaultFunds = ethers.parseEther('100');
        await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        const dealStatus = await dealsManager.status(0);
        const dealMilestones = await dealsManager.milestones(0);
        const dealVault = await dealsManager.vault(0);

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
        const vaultFunds = ethers.parseEther('100');
        await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 2)
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
        const vaultFunds = ethers.parseEther('100');
        await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1)
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
        const vaultFunds = ethers.parseEther('100');
        await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // mint investor tokens
        await erc20.connect(accounts.deployerAccount).mint(
          accounts.investorAccount.address,
          ethers.parseEther('500')
        );

        // allow vault to transfer investor funds
        await erc20.connect(accounts.investorAccount).approve(
          vaultAddress,
          ethers.parseEther('100')
        );

        // deposits investor funds
        await dealVault.connect(accounts.investorAccount).deposit(
          ethers.parseEther('100'),
          accounts.investorAccount.address
        );

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1);

        const status = await dealsManager.status(0);
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
        const vaultFunds = ethers.parseEther('100');
        await dealsManager.connect(accounts.dealsManagerAccount).mint(
          milestones,
          vaultFunds,
          accounts.financialAccount.address
        );

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // mint investor tokens
        await erc20.connect(accounts.deployerAccount).mint(
          accounts.investorAccount.address,
          ethers.parseEther('500')
        );

        // allow vault to transfer investor funds
        await erc20.connect(accounts.investorAccount).approve(
          vaultAddress,
          ethers.parseEther('100')
        );

        // deposits investor funds
        await dealVault.connect(accounts.investorAccount).deposit(
          ethers.parseEther('100'),
          accounts.investorAccount.address
        );

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1);

        const status = await dealsManager.status(0);
        expect(status).to.be.equal(1);
      });
    });

    describe('setDealCompleted', () => {
      it('should complete a deal when all milestones are done', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // Fund the vault with more than maxDeposit
        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.financialAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(vaultAddress, ethers.parseEther('100'));

        await erc20
          .connect(accounts.financialAccount)
          .approve(vaultAddress, ethers.parseEther('500'));

        await dealVault
          .connect(accounts.investorAccount)
          .deposit(ethers.parseEther('100'), accounts.investorAccount.address);

        // Complete all milestones
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 2);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 3);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 4);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 5);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 6);
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 7);

        // Transfer funds from borrower to vault
        await erc20
          .connect(accounts.financialAccount)
          .approve(await dealsManager.getAddress(), ethers.parseEther('110'));

        await dealsManager
          .connect(accounts.financialAccount)
          .donateToDeal(0, ethers.parseEther('110'));

        // Ensure vault has enough funds
        const vaultBalance = await erc20.balanceOf(vaultAddress);
        const totalAssets = await dealVault.totalAssets();
        expect(vaultBalance).to.be.equal(ethers.parseEther('110'));
        expect(totalAssets).to.be.equal(ethers.parseEther('110'));

        // Complete the deal
        const tx = await dealsManager.connect(accounts.dealsManagerAccount).setDealCompleted(0);
        const receipt = await tx.wait();
        expect(receipt).to.not.be.null;
        if (!receipt) return;

        const parsedEvents = decodeDealManagerEvents(receipt, dealsManager.interface.formatJson());
        const dealCompleted = parsedEvents.find(
          (e) => e && e.eventName === 'DealCompleted'
        );
        expect(dealCompleted).to.not.be.null;
        expect(dealCompleted?.args).to.deep.equal({ dealId: BigInt(0) });

        const status = await dealsManager.status(0);
        expect(status).to.equal(8);
      });

      it('should fail to complete a deal if not all milestones are done', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).setDealCompleted(0)
        ).to.be.rejectedWith('all milestones must be completed');
      });
    });

    describe('proceed edge cases', () => {
      it('should fail to proceed to invalid milestone number', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 0)
        ).to.be.rejectedWith('wrong milestone to proceed to');

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 8)
        ).to.be.rejectedWith('wrong milestone to proceed to');
      });

      it('should handle milestone with zero percentage correctly', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // Fund the vault
        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(vaultAddress, ethers.parseEther('100'));

        await dealVault
          .connect(accounts.investorAccount)
          .deposit(ethers.parseEther('100'), accounts.investorAccount.address);

        // Proceed through milestone 1 (0%)
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1);
        const borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(0);

        // Proceed through milestone 2 (0%)
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 2);
        const borrowerBalance2 = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance2).to.equal(0);

        // Proceed through milestone 3 (100%)
        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 3);
        const borrowerBalance3 = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance3).to.equal(ethers.parseEther('100'));
      });
    });

    describe('borrower management', () => {
      it('should change the borrower of a deal', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        // Create a deal with initial borrower
        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        // Change the borrower
        const tx = await dealsManager
          .connect(accounts.dealsManagerAccount)
          .changeDealBorrower(0, accounts.investorAccount.address);

        const receipt = await tx.wait();
        expect(receipt).to.not.be.null;
        if (!receipt) return;

        const parsedEvents = decodeDealManagerEvents(receipt, dealsManager.interface.formatJson());
        const borrowerChanged = parsedEvents.find(
          (e) => e && e.eventName === 'DealBorrowerChanged'
        );
        expect(borrowerChanged).to.not.be.null;
        expect(borrowerChanged?.args).to.deep.equal({
          dealId: BigInt(0),
          oldBorrower: accounts.financialAccount.address,
          newBorrower: accounts.investorAccount.address
        });
      });

      it('should fail to change borrower if deal does not exist', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        await expect(
          dealsManager
            .connect(accounts.dealsManagerAccount)
            .changeDealBorrower(0, accounts.investorAccount.address)
        ).to.be.rejectedWith('Deal not found');
      });

      it('should fail to change borrower to zero address', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager
            .connect(accounts.dealsManagerAccount)
            .changeDealBorrower(0, ethers.ZeroAddress)
        ).to.be.rejectedWith('Invalid borrower address');
      });

      it('should fail to change borrower to the same address', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager
            .connect(accounts.dealsManagerAccount)
            .changeDealBorrower(0, accounts.financialAccount.address)
        ).to.be.rejectedWith('Same borrower');
      });

      it('should fail to change borrower if not called by owner', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager
            .connect(accounts.investorAccount)
            .changeDealBorrower(0, accounts.investorAccount.address)
        ).to.be.revertedWithCustomError(dealsManager, 'OwnableUnauthorizedAccount');
      });
    });

    describe('ownership management', () => {
      it('should transfer ownership to a new address', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        // Step 1: Current owner initiates transfer
        const tx = await dealsManager.connect(accounts.dealsManagerAccount).transferOwnership(accounts.investorAccount.address);
        const receipt = await tx.wait();
        expect(receipt).to.not.be.null;
        if (!receipt) return;

        // Verify ownership hasn't changed yet
        const currentOwner = await dealsManager.owner();
        expect(currentOwner).to.equal(accounts.dealsManagerAccount.address);

        // Step 2: New owner accepts ownership
        const acceptTx = await dealsManager.connect(accounts.investorAccount).acceptOwnership();
        const acceptReceipt = await acceptTx.wait();
        expect(acceptReceipt).to.not.be.null;
        if (!acceptReceipt) return;

        // Verify ownership has been transferred
        const newOwner = await dealsManager.owner();
        expect(newOwner).to.equal(accounts.investorAccount.address);

        // Verify OwnershipTransferred event
        const parsedEvents = decodeDealManagerEvents(acceptReceipt, dealsManager.interface.formatJson());
        const ownershipTransferred = parsedEvents.find(
          (e) => e && e.eventName === 'OwnershipTransferred'
        );
        expect(ownershipTransferred).to.not.be.null;
        expect(ownershipTransferred?.args).to.deep.equal({
          previousOwner: accounts.dealsManagerAccount.address,
          newOwner: accounts.investorAccount.address
        });
      });

      it('should fail to transfer ownership if not called by owner', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        await expect(
          dealsManager.connect(accounts.investorAccount).transferOwnership(accounts.investorAccount.address)
        ).to.be.revertedWithCustomError(dealsManager, 'OwnableUnauthorizedAccount');
      });

      it('should fail to transfer ownership to zero address', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        await expect(
          dealsManager.connect(accounts.dealsManagerAccount).transferOwnership(ethers.ZeroAddress)
        ).to.be.revertedWithCustomError(dealsManager, 'OwnableInvalidOwner');
      });

      it('should fail to accept ownership if not the pending owner', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        // Transfer ownership to investor account
        await dealsManager.connect(accounts.dealsManagerAccount).transferOwnership(accounts.investorAccount.address);

        // Try to accept ownership with a different account
        await expect(
          dealsManager.connect(accounts.financialAccount).acceptOwnership()
        ).to.be.revertedWithCustomError(dealsManager, 'OwnableUnauthorizedAccount');
      });
    });

    describe('transferFromVault', () => {
      it('should transfer funds from vault to borrower', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // Fund the vault
        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(vaultAddress, ethers.parseEther('100'));

        await dealVault
          .connect(accounts.investorAccount)
          .deposit(ethers.parseEther('100'), accounts.investorAccount.address);

        const initialBorrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .transferFromVault(0, ethers.parseEther('50'), true);

        const finalBorrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(finalBorrowerBalance - initialBorrowerBalance).to.equal(ethers.parseEther('50'));
      });

      it('should transfer funds from vault to owner', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // Fund the vault
        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(vaultAddress, ethers.parseEther('100'));

        await dealVault
          .connect(accounts.investorAccount)
          .deposit(ethers.parseEther('100'), accounts.investorAccount.address);

        const initialOwnerBalance = await erc20.balanceOf(accounts.dealsManagerAccount.address);
        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .transferFromVault(0, ethers.parseEther('50'), false);

        const finalOwnerBalance = await erc20.balanceOf(accounts.dealsManagerAccount.address);
        expect(finalOwnerBalance - initialOwnerBalance).to.equal(ethers.parseEther('50'));
      });

      it('should fail to transfer if amount is zero', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager
            .connect(accounts.dealsManagerAccount)
            .transferFromVault(0, 0, true)
        ).to.be.rejectedWith('Amount must be positive');
      });

      it('should fail to transfer if deal does not exist', async () => {
        const { dealsManager } = await deploy(hre, accounts);

        await expect(
          dealsManager
            .connect(accounts.dealsManagerAccount)
            .transferFromVault(0, ethers.parseEther('50'), true)
        ).to.be.rejectedWith('Deal not found');
      });
    });

    describe('donateToDeal', () => {
      it('should fail to donate if not called by borrower', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(await dealsManager.getAddress(), ethers.parseEther('100'));

        await expect(
          dealsManager
            .connect(accounts.investorAccount)
            .donateToDeal(0, ethers.parseEther('100'))
        ).to.be.rejectedWith('Only borrower can donate');
      });

      it('should fail to donate if amount is zero', async () => {
        const { dealsManager } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          0, 0, 100, 0, 0, 0, 0
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        await expect(
          dealsManager
            .connect(accounts.financialAccount)
            .donateToDeal(0, 0)
        ).to.be.rejectedWith('Amount must be positive');
      });

      it('should fail to donate if deal does not exist', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);

        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.financialAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.financialAccount)
          .approve(await dealsManager.getAddress(), ethers.parseEther('100'));

        await expect(
          dealsManager
            .connect(accounts.financialAccount)
            .donateToDeal(0, ethers.parseEther('100'))
        ).to.be.rejectedWith('Deal not found');
      });
    });

    describe('proceed with different milestone distributions', () => {
      it('should handle multiple non-zero milestone percentages', async () => {
        const { dealsManager, erc20 } = await deploy(hre, accounts);
        const milestones: [number, number, number, number, number, number, number] = [
          20, 30, 10, 15, 5, 10, 10
        ];
        const vaultFunds = ethers.parseEther('100');

        await dealsManager
          .connect(accounts.dealsManagerAccount)
          .mint(milestones, vaultFunds, accounts.financialAccount.address);

        const vaultAddress = await dealsManager.vault(0);
        const dealVault = await hre.ethers.getContractAt('DealVault', vaultAddress) as DealVault;

        // Fund the vault
        await erc20
          .connect(accounts.deployerAccount)
          .mint(accounts.investorAccount.address, ethers.parseEther('500'));

        await erc20
          .connect(accounts.investorAccount)
          .approve(vaultAddress, ethers.parseEther('100'));

        await dealVault
          .connect(accounts.investorAccount)
          .deposit(ethers.parseEther('100'), accounts.investorAccount.address);

        // Proceed through milestones and verify transfers
        let borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(0);

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 1);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('20'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 2);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('50'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 3);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('60'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 4);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('75'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 5);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('80'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 6);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('90'));

        await dealsManager.connect(accounts.dealsManagerAccount).proceed(0, 7);
        borrowerBalance = await erc20.balanceOf(accounts.financialAccount.address);
        expect(borrowerBalance).to.equal(ethers.parseEther('100'));
      });
    });
  });
});
