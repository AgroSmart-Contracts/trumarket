import { Injectable } from '@nestjs/common';

import { logger } from '../logger';
import UserModel, { User } from './users.model';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    return UserModel.findOne({ email }).exec();
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    logger.debug({ createUserDto }, 'Creating new user');
    const user = new UserModel(createUserDto);
    return user.save();
  }
}
