import { Module } from '@nestjs/common';
import { Configuration, DefaultApi, Region } from '@onfido/api';

import { UsersModule } from '@/users/users.module';
import { UsersRepository } from '@/users/users.repository';

import { KYCController } from './kyc.controller';
import { KYCVerificationRepository } from './kyc.repository';
import { KYCService } from './kyc.service';

@Module({
  controllers: [KYCController],
  providers: [
    KYCService,
    KYCVerificationRepository,
    {
      provide: DefaultApi,
      useFactory: () => {
        const onfidoApiToken = process.env.ONFIDO_API_TOKEN;

        if (!onfidoApiToken) {
          throw new Error('ONFIDO_API_TOKEN is not defined');
        }

        return new DefaultApi(
          new Configuration({
            apiToken: onfidoApiToken,
            region: Region.EU, // Supports Region.EU, Region.US and Region.CA
            baseOptions: { timeout: 60_000 }, // Additional Axios options (timeout, etc.)
          }),
        );
      },
    },
    UsersRepository,
  ],
  imports: [UsersModule],
  exports: [KYCService],
})
export class KYCModule {}
