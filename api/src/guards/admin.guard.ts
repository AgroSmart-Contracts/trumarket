import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import UserModel, { RoleType } from '../users/users.model';
import { ForbiddenError, UnauthorizedError } from '../errors';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedError();
    }

    const { address } = request.user as any;

    const user = await UserModel.findOne({ address });

    if (user && user.toJSON().role === RoleType.ADMIN) {
      return true;
    }

    throw new ForbiddenError();
  }
}
