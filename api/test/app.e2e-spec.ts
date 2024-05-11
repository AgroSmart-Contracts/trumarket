import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { config } from '@/config';
import { Deal, DealStatus } from '@/deals/deals.entities';
import { CreateDealDto } from '@/deals/dto/createDeal.dto';
import UserModel, { AccountType, User } from '@/users/users.model';

const randomEvmAddress = () => '0x' + Math.random().toString(16).slice(2, 42);

const generateDealDto = (dealDto: Partial<Deal> = {}): CreateDealDto => {
  return Object.assign(
    {
      name: 'test',
      description: 'test',
      contractId: 1,
      roi: 1,
      netBalance: 1,
      revenue: 1,
      investmentAmount: 1,
      shippingStartDate: new Date(),
      expectedShippingEndDate: new Date(),
      destination: 'US',
      origin: 'CN',
      milestones: [
        {
          name: 'Milestone 1',
          description: 'Description of Milestone 1',
          date: new Date(),
          location: 'Location 1',
        },
        {
          name: 'Milestone 2',
          description: 'Description of Milestone 2',
          date: new Date(),
          location: 'Location 2',
        },
        {
          name: 'Milestone 3',
          description: 'Description of Milestone 3',
          date: new Date(),
          location: 'Location 3',
        },
        {
          name: 'Milestone 4',
          description: 'Description of Milestone 4',
          date: new Date(),
          location: 'Location 4',
        },
        {
          name: 'Milestone 5',
          description: 'Description of Milestone 5',
          date: new Date(),
          location: 'Location 5',
        },
        {
          name: 'Milestone 6',
          description: 'Description of Milestone 6',
          date: new Date(),
          location: 'Location 6',
        },
        {
          name: 'Milestone 7',
          description: 'Description of Milestone 7',
          date: new Date(),
          location: 'Location 7',
        },
      ],
    } as CreateDealDto,
    dealDto,
  );
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  async function getLoginToken(user: User) {
    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ web3authToken: JSON.stringify(user) })
      .expect(201);

    return loginReq.body.token;
  }

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    config.databaseUrl = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('misc', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer()).get('/').expect(200).expect('v0.0.0');
    });

    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('{"status":"UP","services":{"database":"UP"}}');
    });
  });

  describe('Authentication', () => {
    it('should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ web3authToken: '{}' })
        .expect(201);

      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Deals Creation Flow', () => {
    it('buyer creates deal proposal and supplier accepts', async () => {
      // create buyer and supplier users
      const buyer = await UserModel.create({
        email: 'buyer@example.com',
        accountType: AccountType.Buyer,
        walletAddress: randomEvmAddress(),
      } as User);
      const supplier = await UserModel.create({
        email: 'supplier@example.com',
        accountType: AccountType.Supplier,
        walletAddress: randomEvmAddress(),
      } as User);

      // login buyer and supplier
      const buyerToken = await getLoginToken(buyer);
      const supplierToken = await getLoginToken(supplier);

      // create deal
      const dealReq = await request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(
          generateDealDto({
            proposalSupplierEmail: supplier.email,
          }),
        );

      expect(dealReq.body).toHaveProperty('id');

      await request(app.getHttpServer())
        .get(`/deals/${dealReq.body.id}`)
        .expect(401);

      const getDealRequest = await request(app.getHttpServer())
        .get(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(getDealRequest.body).toMatchObject({
        id: dealReq.body.id,
        buyerConfirmed: true,
        supplierConfirmed: false,
        proposalBuyerEmail: buyer.email,
        proposalSupplierEmail: supplier.email,
        buyerId: buyer.id,
        supplierId: supplier.id,
        status: DealStatus.Proposal,
      } as Deal);

      // accept deal with supplier account
      const acceptDealReq = await request(app.getHttpServer())
        .put(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ confirm: true })
        .expect(200);

      // check deal status
      expect(acceptDealReq.body).toMatchObject({
        id: dealReq.body.id,
        status: DealStatus.Confirmed,
        buyerConfirmed: true,
        supplierConfirmed: true,
      });

      // check deal updates are locked
      await request(app.getHttpServer())
        .put(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ name: 'test 2' })
        .expect(400);
    });

    it('supplier creates deal proposal, buyer changes deal details, supplier accepts buyer changes', async () => {
      // create buyer and supplier users
      const buyer = await UserModel.create({
        email: 'buyer@example.com',
        accountType: AccountType.Buyer,
        walletAddress: randomEvmAddress(),
      } as User);
      const supplier = await UserModel.create({
        email: 'supplier@example.com',
        accountType: AccountType.Supplier,
        walletAddress: randomEvmAddress(),
      } as User);

      // login buyer and supplier
      const buyerToken = await getLoginToken(buyer);
      const supplierToken = await getLoginToken(supplier);

      // create deal
      const dealReq = await request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${supplierToken}`)
        .send(
          generateDealDto({
            proposalBuyerEmail: buyer.email,
          }),
        );

      expect(dealReq.body).toHaveProperty('id');

      await request(app.getHttpServer())
        .get(`/deals/${dealReq.body.id}`)
        .expect(401);

      const getDealRequest = await request(app.getHttpServer())
        .get(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(getDealRequest.body).toMatchObject({
        id: dealReq.body.id,
        buyerConfirmed: false,
        supplierConfirmed: true,
        proposalBuyerEmail: buyer.email,
        proposalSupplierEmail: supplier.email,
        buyerId: buyer.id,
        supplierId: supplier.id,
        status: DealStatus.Proposal,
      } as Deal);

      // change deal with buyer account
      const changeDealReq = await request(app.getHttpServer())
        .put(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ name: 'test 2' })
        .expect(200);

      // check deal status
      expect(changeDealReq.body).toMatchObject({
        id: dealReq.body.id,
        status: DealStatus.Proposal,
        buyerConfirmed: true,
        supplierConfirmed: false,
      });

      // accept deal with supplier account
      const acceptDealReq = await request(app.getHttpServer())
        .put(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ confirm: true })
        .expect(200);

      // check deal status
      expect(acceptDealReq.body).toMatchObject({
        id: dealReq.body.id,
        status: DealStatus.Confirmed,
        buyerConfirmed: true,
        supplierConfirmed: true,
      });

      // check deal updates are locked
      await request(app.getHttpServer())
        .put(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ name: 'test 2' })
        .expect(400);
    });

    it('supplier creates deal proposal with a buyer email that does not exist in database, buyer signsup, deal is associated to the buyer', async () => {
      // create supplier users
      const buyerEmail = 'buyer@example.com';
      const supplier = await UserModel.create({
        email: 'supplier@example.com',
        accountType: AccountType.Supplier,
        walletAddress: randomEvmAddress(),
      } as User);

      // login supplier
      const supplierToken = await getLoginToken(supplier);

      // create deal
      const dealReq = await request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${supplierToken}`)
        .send(
          generateDealDto({
            proposalBuyerEmail: buyerEmail,
          }),
        );

      expect(dealReq.body).toHaveProperty('id');
      expect(dealReq.body.supplierId).toEqual(supplier.id);

      // signup buyer
      const buyerSignupReq = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          web3authToken: `{"payload":{"wallets":[{"address":"${randomEvmAddress()}","type":"evm"}]}}`,
          auth0Token: `{"payload":{"email":"${buyerEmail}"}}`,
          accountType: AccountType.Buyer,
        })
        .expect(201);

      const buyerToken = buyerSignupReq.body;

      expect(buyerToken).toHaveProperty('token');

      const buyer = await UserModel.findOne({ email: buyerEmail });
      expect(buyer).toBeTruthy();

      // check deal has buyer id
      const getDealReq = await request(app.getHttpServer())
        .get(`/deals/${dealReq.body.id}`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .expect(200);

      // check deal status
      expect(getDealReq.body.buyerId).toEqual(buyer.id);
      expect(getDealReq.body.supplierId).toEqual(supplier.id);
    });
  });
});
