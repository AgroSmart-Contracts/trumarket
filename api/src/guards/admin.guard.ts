import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenError, UnauthorizedError } from '../errors';
import UserModel, { RoleType, User } from '../auth/users.model';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedError();
    }

    const { address } = request.user as any;

    const user: User = await UserModel.findOne({ address });

    if (user && user.role === RoleType.ADMIN) {
      return true;
    }

    throw new ForbiddenError();
  }
}
