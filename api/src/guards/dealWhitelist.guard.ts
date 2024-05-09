import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import DealModel from '../deals/deals.model';
import { ForbiddenError, UnauthorizedError } from '../errors';
import UserModel, { RoleType } from '../auth/users.model';

@Injectable()
export class DealWhitelistGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedError();
    }

    const { address } = request.user;

    const user = await UserModel.findOne({ address });

    if (user && user.toJSON().role === RoleType.ADMIN) {
      return true;
    }

    const dealId = request.params.dealId; // Extract the deal ID from the URL params

    // Retrieve the deal and check if the user's address is in the whitelist
    const deal = await DealModel.findById(dealId);
    console.log({ dealId, deal });
    if (
      deal &&
      deal.whitelist.map((doc) => doc.toJSON().address).includes(address)
    ) {
      return true;
    }

    throw new ForbiddenError();
  }
}
