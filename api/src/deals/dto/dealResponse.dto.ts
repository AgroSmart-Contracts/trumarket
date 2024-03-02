import {Expose} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

export class MilestoneDTO {
    @Expose()
    description: string;

    @Expose()
    location: string;

    @Expose()
    date: Date;
  }

export class DealDtoResponse {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty({
        type: [String],
    })
    @Expose()
    docs: string[];

    @ApiProperty()
    @Expose()
    deliveryStartDate: Date;

    @ApiProperty()
    @Expose()
    deliveryEndDate: Date;

    @ApiProperty({
        type:[MilestoneDTO]
    })
    @Expose()
    milestones: MilestoneDTO[];

    @ApiProperty()
    @Expose()
    investmentAmount: number

    @ApiProperty()
    @Expose()
    revenue: number

    @ApiProperty()
    @Expose()
    netBalance: number

    @ApiProperty()
    @Expose()
    roi: number

    @ApiProperty()
    @Expose()
    carbonFootprint: string;
}
