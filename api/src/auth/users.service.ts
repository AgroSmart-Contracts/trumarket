import { Injectable } from '@nestjs/common';
import UserModel, { User } from './users.model';
import { logger } from '../logger';

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
