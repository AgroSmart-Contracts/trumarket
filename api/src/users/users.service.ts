import { Injectable } from '@nestjs/common';

import { logger } from '../logger';
import { User, WalletType } from './users.model';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async findByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.users.findByWalletAddress(walletAddress);
  }

  async findByEmail(walletAddress: string): Promise<User | undefined> {
    return this.users.findByEmail(walletAddress);
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    logger.debug({ createUserDto }, 'Creating new user');

    if (createUserDto.walletType === 'ethereum') {
      createUserDto.walletType = WalletType.EVM;
    }

    return this.users.create(createUserDto);
  }
}
