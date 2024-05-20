import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { AppModule } from '@/app.module';
import { config } from '@/config';
import { Deal } from '@/deals/deals.entities';
import DealModel from '@/deals/deals.model';
import { CreateDealDto } from '@/deals/dto/createDeal.dto';
import UserModel, { AccountType, User } from '@/users/users.model';

export const randomEmail = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email = '';
  for (let i = 0; i < 10; i++) {
    email += characters[Math.floor(Math.random() * characters.length)];
  }
  email += '@example.com';
  return email;
};

export const randomEvmAddress = () =>
  '0x' + Math.random().toString(16).slice(2, 42);

export const generateDealDto = (dealDto: Partial<Deal> = {}): CreateDealDto => {
  return {
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
    quantity: 1,
    offerUnitPrice: 1,
    milestones: [
      {
        description: 'Description of Milestone 1',
        fundsDistribution: 20,
      },
      {
        description: 'Description of Milestone 2',
        fundsDistribution: 50,
      },
      {
        description: 'Description of Milestone 3',
        fundsDistribution: 0,
      },
      {
        description: 'Description of Milestone 4',
        fundsDistribution: 0,
      },
      {
        description: 'Description of Milestone 5',
        fundsDistribution: 0,
      },
      {
        description: 'Description of Milestone 6',
        fundsDistribution: 0,
      },
      {
        description: 'Description of Milestone 7',
        fundsDistribution: 30,
      },
    ],
    ...dealDto,
  } as CreateDealDto;
};

export async function getLoginToken(app: INestApplication, user: User) {
  const loginReq = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ web3authToken: JSON.stringify(user) })
    .expect(201);

  return loginReq.body.token;
}

export const setupApp = async () => {
  const mongoServer = await MongoMemoryServer.create();
  config.databaseUrl = mongoServer.getUri();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
        excludeExtraneousValues: true,
      },
    }),
  );

  await app.init();

  return {
    app,
    mongoServer,
  };
};

export const teardownApp = async (app, mongoServer) => {
  await app.close();
  await mongoServer.stop();
};

export class TestApp {
  app: INestApplication;
  mongoServer: MongoMemoryServer;

  async setup() {
    const pack = await setupApp();
    this.app = pack.app;
    this.mongoServer = pack.mongoServer;
  }

  async teardown() {
    await teardownApp(this.app, this.mongoServer);
  }

  request(): TestAgent {
    return request(this.app.getHttpServer());
  }

  async createUser(user: Partial<User>): Promise<User> {
    return UserModel.create({
      ...{
        email: randomEmail(),
        accountType: AccountType.Buyer,
        walletAddress: randomEvmAddress(),
      },
      ...user,
    });
  }

  async login(user: User) {
    const loginReq = await this.request()
      .post('/auth/login')
      .send({ web3authToken: JSON.stringify(user) })
      .expect(201);

    return loginReq.body.token;
  }

  async createUserDeal(user: User) {
    const token = await this.login(user);
    // create deal
    const dealReq = await this.request()
      .post('/deals')
      .set('Authorization', `Bearer ${token}`)
      .send(
        generateDealDto({
          proposalSupplierEmail: randomEmail(),
        }),
      );

    return dealReq.body as Deal;
  }

  async createUserConfirmedDeal(user: User) {
    const token = await this.login(user);
    const dealDto: Partial<Deal> = {};
    let otherUser: User;

    if (user.accountType === AccountType.Buyer) {
      otherUser = await this.createUser({
        accountType: AccountType.Supplier,
      });
      dealDto.proposalSupplierEmail = otherUser.email;
    } else {
      otherUser = await this.createUser({
        accountType: AccountType.Supplier,
      });
      dealDto.proposalBuyerEmail = otherUser.email;
    }

    // create deal
    const dealReq = await this.request()
      .post('/deals')
      .set('Authorization', `Bearer ${token}`)
      .send(
        generateDealDto({
          ...dealDto,
        }),
      );

    // confirm deal
    const confirmDealReq = await this.request()
      .put(`/deals/${dealReq.body.id}`)
      .set('Authorization', `Bearer ${await this.login(otherUser)}`)
      .send({ confirm: true });

    return confirmDealReq.body as Deal;
  }

  async setupDeal(dealDto: Partial<Deal> = {}, buyer?: User, supplier?: User) {
    // create buyer and supplier users
    if (!buyer) {
      buyer = await this.createUser({
        email: randomEmail(),
        accountType: AccountType.Buyer,
      } as User);
    }

    if (!supplier) {
      supplier = await this.createUser({
        email: randomEmail(),
        accountType: AccountType.Supplier,
        walletAddress: randomEmail(),
      } as User);
    }

    // authenticate buyer and supplier
    const buyerToken = await this.login(buyer);
    const supplierToken = await this.login(supplier);

    // create deal
    const createDealDto = generateDealDto({
      ...dealDto,
      proposalSupplierEmail: supplier.email,
    });

    const createDealReq = await this.request()
      .post('/deals')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send(createDealDto)
      .expect(201);

    if (dealDto.nftID) {
      await DealModel.updateOne(
        { _id: createDealReq.body.id },
        { nftID: dealDto.nftID },
      );
    }

    // accept deal with supplier account
    const dealReq = await this.request()
      .put(`/deals/${createDealReq.body.id}`)
      .set('Authorization', `Bearer ${supplierToken}`)
      .send({ confirm: true })
      .expect(200);

    return {
      deal: dealReq.body as Deal,
      buyerToken,
      supplierToken,
    };
  }
}
