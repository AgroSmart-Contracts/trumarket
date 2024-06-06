import { ApiProperty } from '@nestjs/swagger';

export enum KYCVerificationStatus {
  NotStarted = 'notStarted',
  InProgress = 'inProgress',
  Complete = 'complete',
}

export enum KYCVerificationResult {
  Pass = 'pass',
  Fail = 'fail',
  ManualReview = 'manualReview',
}

export class KYCVerification {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  attempts: number;

  @ApiProperty()
  applicantId: string;

  @ApiProperty()
  workflowRunId: string;

  @ApiProperty({ enum: KYCVerificationStatus })
  status: KYCVerificationStatus;

  @ApiProperty({ enum: KYCVerificationResult })
  result: KYCVerificationResult;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: string;
}
