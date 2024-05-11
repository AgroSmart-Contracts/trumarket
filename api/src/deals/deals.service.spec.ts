import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsService } from '@/notifications/notifications.service';
import { AccountType, User } from '@/users/users.model';
import { UsersService } from '@/users/users.service';

import { Deal, DealStatus } from './deals.entities';
import { DealsRepository } from './deals.repository';
import { DealsService, ListDealsQuery } from './deals.service';

describe('DealsService', () => {
  let dealsService: DealsService;
  let dealsRepository: DealsRepository;
  let usersService: UsersService;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        DealsRepository,
        UsersService,
        NotificationsService,
      ],
    }).compile();

    dealsService = module.get<DealsService>(DealsService);
    dealsRepository = module.get<DealsRepository>(DealsRepository);
    usersService = module.get<UsersService>(UsersService);
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
});
