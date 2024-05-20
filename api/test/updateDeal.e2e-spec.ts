import { User } from '@/users/users.model';

import { TestApp } from './utils';

describe('Update Deal (e2e)', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('updateCoverImage', () => {
    it('should update the cover image of a deal', async () => {
      const user = await app.createUser({} as User);

      const userToken = await app.login(user);

      const deal = await app.createUserDeal(user);

      const updateCoverImageReq = await app
        .request()
        .put(`/deals/${deal.id}/cover-image`)
        .set('Authorization', `Bearer ${userToken}`)
        .attach('file', 'test/fixtures/test.png')
        .expect(200);

      expect(updateCoverImageReq.body.coverImageUrl).toBeDefined();
    });
  });
});
