import { privateKeyToAccount } from 'viem/accounts';

import { TestApp } from './utils';

describe('Milestone flows (e2e)', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  afterEach(async () => {
    await app.teardown();
  });

  it('supplier should upload document to milestone', async () => {
    // Initialize a wallet
    const wallet = privateKeyToAccount(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    );

    const buyer = await app.createUser({
      walletAddress: wallet.address,
    });

    // setup deal
    const { deal, buyerToken, supplierToken } = await app.setupDeal(
      { nftID: 3 },
      buyer,
      null,
    );

    // supplier uploads document to current milestone
    const milestone = deal.milestones[deal.currentMilestone];

    const successUploadReq = await app
      .request()
      .post(`/deals/${deal.id}/milestones/${milestone.id}/docs`)
      .set('Authorization', `Bearer ${supplierToken}`)
      .field('description', 'Test document')
      .attach('file', 'test/fixtures/test.pdf');

    expect(successUploadReq.body).toHaveProperty('id');
    expect(successUploadReq.status).toBe(201);

    // buyer not allowed to upload documents
    const forbiddenUploadReq = await app
      .request()
      .post(`/deals/${deal.id}/milestones/${milestone.id}/docs`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .field('description', 'Test document')
      .attach('file', 'test/fixtures/test.pdf')
      .expect(401);

    expect(forbiddenUploadReq.body.message).toEqual(
      'You are not allowed to upload documents for this deal',
    );

    // supplier forbidden to upload documents to milestones other than the current one
    await app
      .request()
      .post(`/deals/${deal.id}/milestones/${deal.milestones[3].id}/docs`)
      .set('Authorization', `Bearer ${supplierToken}`)
      .field('description', 'Test document')
      .attach('file', 'test/fixtures/test.pdf')
      .expect(403);

    // buyer gives approval for the milestone

    // Sign a message
    const message = `Approve milestone 1 of deal ${deal.nftID}`;
    const signature = await wallet.signMessage({
      message,
    });

    const updatedDealReq = await app
      .request()
      .put(`/deals/${deal.id}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ currentMilestone: deal.currentMilestone + 1, signature })
      .expect(200);

    const dealUpdated = updatedDealReq.body;

    expect(dealUpdated.milestones[0].docs).toHaveLength(1);
    expect(dealUpdated.currentMilestone).toBe(1);
  });
});
