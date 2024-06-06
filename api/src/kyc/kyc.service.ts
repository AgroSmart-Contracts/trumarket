import { Injectable } from '@nestjs/common';
import { CountryCodes, DefaultApi, WebhookEventVerifier } from '@onfido/api';

import { NotFoundError } from '@/errors';
import { User } from '@/users/users.model';
import { UsersRepository } from '@/users/users.repository';

import {
  KYCVerification,
  KYCVerificationResult,
  KYCVerificationStatus,
} from './kyc.entities';
import { KYCVerificationRepository } from './kyc.repository';

interface Address {
  flatNumber?: string;
  buildingNumber?: string;
  buildingName?: string;
  street?: string;
  subStreet?: string;
  town?: string;
  state?: string;
  postcode: string;
  country: CountryCodes;
  line1?: string;
  line2?: string;
  line3?: string;
}

interface CreateVerificationParams {
  firstName: string;
  lastName: string;
  dob?: string;
  address: Address;
}

@Injectable()
export class KYCService {
  constructor(
    private readonly verificationRepository: KYCVerificationRepository,
    private readonly onfido: DefaultApi,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createApplicant(
    user: User,
    { firstName, lastName, address }: CreateVerificationParams,
  ) {
    const userId = user.id;

    const existing =
      await this.verificationRepository.getApplicantByUserId(userId);

    if (existing && existing.applicantId) {
      throw new Error('KYC applicant already exists');
    }

    const applicant = await this.onfido.createApplicant({
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      address: {
        building_number: address.buildingNumber,
        street: address.street,
        town: address.town,
        postcode: address.postcode,
        country: address.country,
      },
    });

    const applicantId = applicant.data.id;

    const workflowRunId = await this.createOnfidoWorkflowrun(applicantId);

    const kycVerification = new KYCVerification();
    kycVerification.applicantId = applicantId;
    kycVerification.workflowRunId = workflowRunId;
    kycVerification.userId = userId;
    kycVerification.status = KYCVerificationStatus.NotStarted;
    kycVerification.createdAt = new Date();
    kycVerification.updatedAt = new Date();
    const saved =
      await this.verificationRepository.createApplicant(kycVerification);

    return saved;
  }

  async getKYCVerificationByUserId(userId: string) {
    // TODO: handle erros
    const kycVerification =
      await this.verificationRepository.getApplicantByUserId(userId);

    if (!kycVerification) {
      throw new NotFoundError('Verification not found');
    }

    return kycVerification;
  }

  async createOnfidoSDKToken(kycVerification: any) {
    try {
      const sdkToken = await this.onfido.generateSdkToken({
        applicant_id: kycVerification.applicantId,
      });

      return sdkToken.data.token;
    } catch (error) {
      throw error;
    }
  }

  async createOnfidoWorkflowrun(applicantId: string) {
    try {
      const workflow = await this.onfido.createWorkflowRun({
        applicant_id: applicantId,
        workflow_id: process.env.ONFIDO_WORKFLOW_ID,
      });

      return workflow.data.id;
    } catch (error) {
      throw error;
    }
  }

  async verifyWebhookEvent(rawBody: any, signature: string) {
    const verifier = new WebhookEventVerifier(process.env.ONFIDO_WEBHOOK_TOKEN);
    const data = verifier.readPayload(rawBody, signature);
    const { payload }: any = data;

    // only listen for workflow_run completed action
    if (payload.action === 'workflow_run.completed') {
      // confirm the status of the workflow run
      const kycVerification =
        await this.verificationRepository.getApplicantById(
          payload.resource.applicant_id,
        );

      if (!kycVerification) {
        throw new Error('KYC verification not found');
      }

      const result =
        payload.object.status === 'approved'
          ? KYCVerificationResult.Pass
          : KYCVerificationResult.Fail;

      await this.verificationRepository.updateById(kycVerification.id, {
        status: KYCVerificationStatus.Complete,
        result,
        updatedAt: new Date(),
      });

      if (result === KYCVerificationResult.Pass) {
        await this.usersRepository.updateById(kycVerification.userId, {
          kycVerified: true,
        });
      }
    }
  }
}
