import { AccountType } from '@/users/users.model';

import { TestApp } from './utils';

describe('Misc Routes (e2e)', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  afterEach(async () => {
    await app.teardown();
  });

  it('list user deals', async () => {
    const buyer = await app.createUser({
      accountType: AccountType.Buyer,
    });

    const deal = await app.createUserDeal(buyer);
    const dealConfirmed = await app.createUserConfirmedDeal(buyer);

    console.log(deal);

    const dealsReq = await app
      .request()
      .get('/deals')
      .set('Authorization', `Bearer ${await app.login(buyer)}`)
      .expect(200);

    expect(dealsReq.body).toHaveLength(2);
    expect(dealsReq.body.map((d) => d.id)).toContain(deal.id);
    expect(dealsReq.body.map((d) => d.id)).toContain(dealConfirmed.id);

    const proposalDealsRequest = await app
      .request()
      .get('/deals?status=proposal')
      .set('Authorization', `Bearer ${await app.login(buyer)}`)
      .expect(200);

    expect(proposalDealsRequest.body).toHaveLength(1);
    expect(proposalDealsRequest.body.map((d) => d.id)).toContain(deal.id);

    const confirmedDealsRequest = await app
      .request()
      .get('/deals?status=confirmed')
      .set('Authorization', `Bearer ${await app.login(buyer)}`)
      .expect(200);

    expect(confirmedDealsRequest.body).toHaveLength(1);
    expect(confirmedDealsRequest.body.map((d) => d.id)).toContain(
      dealConfirmed.id,
    );
  });
});
