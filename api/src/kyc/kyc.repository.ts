import { Injectable } from '@nestjs/common';

import { MongooseRepository } from '@/repository.mongoose';

import { KYCVerification } from './dto/kycVerificationResponse.dto';
import KYCVerificationModel from './kyc.model';

@Injectable()
export class KYCVerificationRepository extends MongooseRepository<KYCVerification> {
  constructor() {
    super(KYCVerificationModel);
  }

  async createApplicant(data: any): Promise<KYCVerification> {
    return this.create(data);
  }

  async getApplicantById(applicantId: string): Promise<KYCVerification> {
    return this.findOne({ applicantId });
  }

  async getApplicantByUserId(userId: string): Promise<KYCVerification> {
    return this.findOne({ userId });
  }
}
