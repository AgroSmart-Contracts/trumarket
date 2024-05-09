import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { DealWhitelistGuard } from '../guards/dealWhitelist.guard';
import { AuthGuard } from '../guards/auth.guard';

export function WhitelistAccessRestricted() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard),
    UseGuards(DealWhitelistGuard),
    ApiForbiddenResponse({
      description: 'Access restricted to admin users or whitelisted users',
    }),
  );
}
