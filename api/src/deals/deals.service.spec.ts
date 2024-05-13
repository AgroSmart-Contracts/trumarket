import { Test, TestingModule } from '@nestjs/testing';

import { BlockchainService } from '@/blockchain/blockchain.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { AccountType, User } from '@/users/users.model';
import { UsersRepository } from '@/users/users.repository';
import { UsersService } from '@/users/users.service';

import { Deal, DealStatus } from './deals.entities';
import { DealsRepository } from './deals.repository';
import { DealsService, ListDealsQuery } from './deals.service';

describe('DealsService', () => {
  let dealsService: DealsService;
  let dealsRepository: DealsRepository;
  let usersService: UsersService;
  let notificationsService: NotificationsService;
  let blockchainService: BlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        DealsRepository,
        UsersService,
        NotificationsService,
        BlockchainService,
        {
          provide: 'EvmProvider',
          useValue: {
            getTransactionReceipt: jest.fn(),
          },
        },
        UsersRepository,
      ],
    }).compile();

    dealsService = module.get<DealsService>(DealsService);
    dealsRepository = module.get<DealsRepository>(DealsRepository);
    usersService = module.get<UsersService>(UsersService);
    blockchainService = module.get<BlockchainService>(BlockchainService);
    notificationsService =
      module.get<NotificationsService>(NotificationsService);
  });

  describe('createDeal', () => {
    it('should create a new deal and send signup email to supplier if he does not exist in the database', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
      } as User;

      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
        proposalSupplierEmail: 'supplier@mail.com',
      };

      const createdDeal: Deal = {
        name: 'New Deal',
        proposalBuyerEmail: user.email,
        proposalSupplierEmail: user.email,
        description: 'This is a new deal',
        investmentAmount: 100,
      } as Deal;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(notificationsService, 'sendInviteToSignupNotification')
        .mockResolvedValue(undefined);
      jest
        .spyOn(dealsRepository, 'create')
        .mockResolvedValue(createdDeal as Deal);
      jest
        .spyOn(notificationsService, 'sendNewProposalNotification')
        .mockResolvedValue(undefined);

      const result = await dealsService.createDeal(user, dealPayload);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        dealPayload.proposalSupplierEmail,
      );
      expect(dealsRepository.create).toHaveBeenCalledWith({
        buyerConfirmed: true,
        buyerId: 'user1',
        description: 'This is a new deal',
        investmentAmount: 100,
        name: 'New Deal',
        proposalBuyerEmail: 'buyer@example.com',
        proposalSupplierEmail: 'supplier@mail.com',
        status: DealStatus.Proposal,
      });
      expect(
        notificationsService.sendNewProposalNotification,
      ).toHaveBeenCalledWith(
        dealsService.selectDealEmailBasedOnUser(user, createdDeal),
        createdDeal,
      );
      expect(result).toEqual(createdDeal);
    });

    it('should create a new deal and send signup email to buyer if he does not exist in the database', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Supplier,
        email: 'supplier@example.com',
      } as User;

      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
        proposalBuyerEmail: 'buyer@example.com',
      };

      const createdDeal: Deal = {
        name: 'New Deal',
        proposalBuyerEmail: user.email,
        proposalSupplierEmail: user.email,
        description: 'This is a new deal',
        investmentAmount: 100,
      } as Deal;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(notificationsService, 'sendInviteToSignupNotification')
        .mockResolvedValue(undefined);
      jest
        .spyOn(dealsRepository, 'create')
        .mockResolvedValue(createdDeal as Deal);
      jest
        .spyOn(notificationsService, 'sendNewProposalNotification')
        .mockResolvedValue(undefined);

      const result = await dealsService.createDeal(user, dealPayload);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        dealPayload.proposalBuyerEmail,
      );
      expect(dealsRepository.create).toHaveBeenCalledWith({
        supplierConfirmed: true,
        supplierId: 'user1',
        description: 'This is a new deal',
        investmentAmount: 100,
        name: 'New Deal',
        proposalBuyerEmail: 'buyer@example.com',
        proposalSupplierEmail: 'supplier@example.com',
        status: DealStatus.Proposal,
      });
      expect(
        notificationsService.sendNewProposalNotification,
      ).toHaveBeenCalledWith(
        dealsService.selectDealEmailBasedOnUser(user, createdDeal),
        createdDeal,
      );
      expect(result).toEqual(createdDeal);
    });

    it('should create a new deal and associate supplier details', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
      } as User;

      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
        proposalSupplierEmail: 'supplier@mail.com',
      };

      const createdDeal: Deal = {
        name: 'New Deal',
        proposalBuyerEmail: user.email,
        proposalSupplierEmail: user.email,
        description: 'This is a new deal',
        investmentAmount: 100,
      } as Deal;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 'user2',
        accountType: AccountType.Supplier,
        email: 'supplier@example.com',
      } as User);
      jest
        .spyOn(notificationsService, 'sendInviteToSignupNotification')
        .mockResolvedValue(undefined);
      jest
        .spyOn(dealsRepository, 'create')
        .mockResolvedValue(createdDeal as Deal);
      jest
        .spyOn(notificationsService, 'sendNewProposalNotification')
        .mockResolvedValue(undefined);

      const result = await dealsService.createDeal(user, dealPayload);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        dealPayload.proposalSupplierEmail,
      );
      expect(dealsRepository.create).toHaveBeenCalledWith({
        buyerConfirmed: true,
        buyerId: 'user1',
        supplierId: 'user2',
        description: 'This is a new deal',
        investmentAmount: 100,
        name: 'New Deal',
        proposalBuyerEmail: 'buyer@example.com',
        proposalSupplierEmail: 'supplier@mail.com',
        status: DealStatus.Proposal,
      });
      expect(
        notificationsService.sendNewProposalNotification,
      ).toHaveBeenCalledWith(
        dealsService.selectDealEmailBasedOnUser(user, createdDeal),
        createdDeal,
      );
      expect(result).toEqual(createdDeal);
    });

    it('should create a new deal and associate buyer details', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Supplier,
        email: 'supplier@example.com',
      } as User;

      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
        proposalBuyerEmail: 'buyer@example.com',
      };

      const createdDeal: Deal = {
        name: 'New Deal',
        proposalBuyerEmail: user.email,
        proposalSupplierEmail: user.email,
        description: 'This is a new deal',
        investmentAmount: 100,
      } as Deal;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 'user2',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
      } as User);
      jest
        .spyOn(notificationsService, 'sendInviteToSignupNotification')
        .mockResolvedValue(undefined);
      jest
        .spyOn(dealsRepository, 'create')
        .mockResolvedValue(createdDeal as Deal);
      jest
        .spyOn(notificationsService, 'sendNewProposalNotification')
        .mockResolvedValue(undefined);

      const result = await dealsService.createDeal(user, dealPayload);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        dealPayload.proposalBuyerEmail,
      );
      expect(dealsRepository.create).toHaveBeenCalledWith({
        supplierConfirmed: true,
        buyerId: 'user2',
        supplierId: 'user1',
        description: 'This is a new deal',
        investmentAmount: 100,
        name: 'New Deal',
        proposalBuyerEmail: 'buyer@example.com',
        proposalSupplierEmail: 'supplier@example.com',
        status: DealStatus.Proposal,
      });
      expect(
        notificationsService.sendNewProposalNotification,
      ).toHaveBeenCalledWith(
        dealsService.selectDealEmailBasedOnUser(user, createdDeal),
        createdDeal,
      );
      expect(result).toEqual(createdDeal);
    });

    it('should throw an error if user is neither a buyer nor a supplier', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Investor,
        email: 'admin@example.com',
      } as User;
      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
        proposalSupplierEmail: 'supplier@mail.com',
      };
      await expect(dealsService.createDeal(user, dealPayload)).rejects.toThrow(
        'User must be a buyer or a supplier',
      );
    });

    it('should throw an error if proposalSupplierEmail is not sent', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
      } as User;
      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
      };
      await expect(dealsService.createDeal(user, dealPayload)).rejects.toThrow(
        'proposalSupplierEmail is required',
      );
    });

    it('should throw an error if proposalBuyerEmail is not sent', async () => {
      const user: User = {
        id: 'user1',
        accountType: AccountType.Supplier,
        email: 'supplier@example.com',
      } as User;
      const dealPayload: Partial<Deal> = {
        name: 'New Deal',
        description: 'This is a new deal',
        investmentAmount: 100,
      };
      await expect(dealsService.createDeal(user, dealPayload)).rejects.toThrow(
        'proposalBuyerEmail is required',
      );
    });
  });

  describe('listDeals', () => {
    it('should return a list of deals', async () => {
      const userId = 'user1';
      const query: ListDealsQuery = {
        status: DealStatus.Proposal,
      };

      const expectedDeals: Deal[] = [
        {
          id: 'deal1',
          name: 'Deal 1',
          status: DealStatus.Proposal,
        } as Deal,
        {
          id: 'deal2',
          name: 'Deal 2',
          status: DealStatus.Proposal,
        } as Deal,
      ];

      jest
        .spyOn(dealsRepository, 'findByUser')
        .mockResolvedValue(expectedDeals as Deal[]);

      const result = await dealsService.findDealsByUser(userId, query);

      expect(dealsRepository.findByUser).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedDeals);
    });
  });

  describe('updateCurrentMilestone', () => {
    it('should throw an error if deal is not found', async () => {
      const dealId = 'deal1';
      const currentMilestone = 1;
      const signature = 'validSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      jest.spyOn(dealsRepository, 'findById').mockResolvedValue(null);

      await expect(
        dealsService.updateCurrentMilestone(
          dealId,
          currentMilestone,
          signature,
          user,
        ),
      ).rejects.toThrow('Deal not found');
      expect(dealsRepository.findById).toHaveBeenCalledWith(dealId);
    });

    it('should throw an error if signature is invalid', async () => {
      const dealId = 'deal1';
      const currentMilestone = 1;
      const signature = 'invalidSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      const deal: any = {
        id: dealId,
        buyerId: user.id,
        nftID: 'nft1',
        milestones: ['Milestone 1', 'Milestone 2'],
        currentMilestone: 0,
      };

      jest.spyOn(dealsService, 'findById').mockResolvedValue(deal as Deal);
      jest.spyOn(blockchainService, 'verifyMessage').mockResolvedValue(false);

      await expect(
        dealsService.updateCurrentMilestone(
          dealId,
          currentMilestone,
          signature,
          user,
        ),
      ).rejects.toThrow('Invalid signature');
      expect(dealsService.findById).toHaveBeenCalledWith(dealId);
      expect(blockchainService.verifyMessage).toHaveBeenCalledWith(
        user.walletAddress as `0x${string}`,
        `Approve milestone ${currentMilestone} of deal ${deal.nftID}`,
        signature as `0x${string}`,
      );
    });

    it('should throw an error if user is not authorized to update the deal', async () => {
      const dealId = 'deal1';
      const currentMilestone = 1;
      const signature = 'validSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Supplier,
        email: 'supplier@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      const deal: any = {
        id: dealId,
        buyerId: 'otherUser',
        nftID: 'nft1',
        milestones: ['Milestone 1', 'Milestone 2'],
        currentMilestone: 0,
      };

      jest.spyOn(dealsService, 'findById').mockResolvedValue(deal as Deal);

      await expect(
        dealsService.updateCurrentMilestone(
          dealId,
          currentMilestone,
          signature,
          user,
        ),
      ).rejects.toThrow(
        'User not authorized to update the current milestone for this deal',
      );
      expect(dealsService.findById).toHaveBeenCalledWith(dealId);
    });

    it('should update the current milestone for a deal', async () => {
      const dealId = 'deal1';
      const currentMilestone = 1;
      const signature = 'validSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      const deal: any = {
        id: dealId,
        buyerId: user.id,
        nftID: 'nft1',
        milestones: ['Milestone 1', 'Milestone 2'],
        currentMilestone: 0,
      };

      jest.spyOn(dealsService, 'findById').mockResolvedValue(deal as Deal);
      jest.spyOn(blockchainService, 'verifyMessage').mockResolvedValue(true);
      jest
        .spyOn(notificationsService, 'sendMilestoneApprovedNotification')
        .mockResolvedValue(undefined);
      jest.spyOn(dealsRepository, 'updateById').mockResolvedValue(deal as Deal);

      const result = await dealsService.updateCurrentMilestone(
        dealId,
        currentMilestone,
        signature,
        user,
      );

      expect(dealsService.findById).toHaveBeenCalledWith(dealId);
      expect(blockchainService.verifyMessage).toHaveBeenCalledWith(
        user.walletAddress as `0x${string}`,
        `Approve milestone ${currentMilestone} of deal ${deal.nftID}`,
        signature as `0x${string}`,
      );
      expect(
        notificationsService.sendMilestoneApprovedNotification,
      ).toHaveBeenCalledWith(
        dealsService.selectDealEmailBasedOnUser(user, deal),
        deal,
        deal.milestones[currentMilestone],
      );
      expect(dealsRepository.updateById).toHaveBeenCalledWith(dealId, {
        currentMilestone: deal.currentMilestone + 1,
      });
      expect(result).toEqual(deal);
    });

    it('should throw an error if deal does not have an nftId associated', async () => {
      const dealId = 'deal1';
      const currentMilestone = 1;
      const signature = 'validSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      const deal: any = {
        id: dealId,
        buyerId: user.id,
        milestones: ['Milestone 1', 'Milestone 2'],
        currentMilestone: 0,
      };

      jest.spyOn(dealsService, 'findById').mockResolvedValue(deal as Deal);

      await expect(
        dealsService.updateCurrentMilestone(
          dealId,
          currentMilestone,
          signature,
          user,
        ),
      ).rejects.toThrow('Deal NFT must be minted first');
      expect(dealsService.findById).toHaveBeenCalledWith(dealId);
    });

    it('should throw an error if the milestone to update is not the next one', async () => {
      const dealId = 'deal1';
      const currentMilestone = 2;
      const signature = 'validSignature';
      const user: User = {
        id: 'user1',
        accountType: AccountType.Buyer,
        email: 'buyer@example.com',
        walletAddress: '0x1234567890abcdef',
      } as User;

      const deal: any = {
        id: dealId,
        buyerId: user.id,
        nftID: 'nft1',
        milestones: ['Milestone 1', 'Milestone 2'],
        currentMilestone: 0,
      };

      jest.spyOn(dealsService, 'findById').mockResolvedValue(deal as Deal);

      await expect(
        dealsService.updateCurrentMilestone(
          dealId,
          currentMilestone,
          signature,
          user,
        ),
      ).rejects.toThrow(
        'Cannot update milestone. The next milestone to update is Milestone 1',
      );
      expect(dealsService.findById).toHaveBeenCalledWith(dealId);
    });
  });
});
