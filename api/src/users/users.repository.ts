import { Injectable } from '@nestjs/common';

import { MongooseRepository } from '../repository.mongoose';
import UserModel, { User } from './users.model';

@Injectable()
export class UsersRepository extends MongooseRepository<User> {
  constructor() {
    super(UserModel);
  }

  findByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.findOne({ walletAddress });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }
}
