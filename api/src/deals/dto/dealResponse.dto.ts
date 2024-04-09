import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MilestoneDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  location: string;

  @Expose()
  date: Date;
}

export class DealDtoResponse {
  constructor(res: DealDtoResponse) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  contractId: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  nftId: number;

  @ApiProperty()
  @Expose()
  origin: string;

  @ApiProperty()
  @Expose()
  destination: string;

  @ApiProperty()
  @Expose()
  presentation: string;

  @ApiProperty()
  @Expose()
  variety: string;

  @ApiProperty()
  @Expose()
  size: string;

  @ApiProperty({
    type: [String],
  })
  @Expose()
  docs: string[];

  @ApiProperty()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty()
  @Expose()
  expectedShippingEndDate: Date;

  @ApiProperty()
  @IsNumber()
  @Expose()
  currentMilestone: number;

  @ApiProperty({
    type: [MilestoneDTO],
  })
  @Expose()
  milestones: MilestoneDTO[];

  @ApiProperty()
  @Expose()
  investmentAmount: number;

  @ApiProperty()
  @Expose()
  revenue: number;

  @ApiProperty()
  @Expose()
  netBalance: number;

  @ApiProperty()
  @Expose()
  roi: number;

  @ApiProperty()
  @Expose()
  carbonFootprint: string;

  @ApiProperty()
  @Expose()
  duration: string;

  @ApiProperty()
  @Expose()
  daysLeft: number;
}
