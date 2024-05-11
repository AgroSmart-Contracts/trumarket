import { Injectable } from '@nestjs/common';

import { MongooseRepository } from '../repository.mongoose';
import UserModel, { User } from './users.model';

@Injectable()
export class UsersRepository extends MongooseRepository<User> {
  constructor() {
    super(UserModel);
  }
}
