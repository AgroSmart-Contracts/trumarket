import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Deal, DealStatus, Milestone } from '../deals.entities';

export class ListDealDtoResponse {
  constructor(res: Partial<Deal>) {
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
  carbonFootprint: string;

  // shipping properties

  @ApiProperty()
  @Expose()
  contractId: string;

  @ApiProperty()
  @Expose()
  origin: string;

  @ApiProperty()
  @Expose()
  destination: string;

  @ApiProperty()
  @Expose()
  portOfOrigin: string;

  @ApiProperty()
  @Expose()
  portOfDestination: string;

  @ApiProperty()
  @Expose()
  totalValue: number;

  @ApiProperty()
  @Expose()
  transport: Date;

  @ApiProperty()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty()
  @Expose()
  expectedShippingEndDate: Date;

  @ApiProperty()
  @Expose()
  daysLeft: number;

  @ApiProperty()
  @Expose()
  duration: number;

  // state properties
  @ApiProperty()
  @Expose()
  currentMilestone: string;

  @ApiProperty({ type: Milestone, isArray: true })
  @Expose()
  milestones: Milestone[];

  @ApiProperty({ enum: DealStatus })
  @Expose()
  status: DealStatus;

  @ApiProperty()
  @Expose()
  buyerConfirmed: boolean;

  @ApiProperty()
  @Expose()
  supplierConfirmed: boolean;

  // financial properties

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

  // ownership properties

  @ApiProperty()
  @Expose()
  proposalBuyerEmail: string;

  @ApiProperty()
  @Expose()
  proposalSupplierEmail: string;
}
