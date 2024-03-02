import { ArrayMaxSize, ArrayMinSize, IsDate, IsNumber, IsString } from 'class-validator';
import {Expose} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

export class MilestoneDTO {
    @IsString()
    @Expose()
    description: string;

    @IsString()
    @Expose()
    location: string;

    @IsDate()
    @Expose()
    date: Date;
  }

export class CreateDealDto {
    @ApiProperty()
    @IsString()
    @Expose()
    description: string;

    @ApiProperty()
    @IsDate()
    @Expose()
    deliveryStartDate: Date;

    @ApiProperty()
    @IsDate()
    @Expose()
    deliveryEndDate: Date;

    @ApiProperty({
        type:[MilestoneDTO]
    })
    @ArrayMinSize(7, { message: 'Milestones array must have at least 7 elements' })
    @ArrayMaxSize(7, { message: 'Milestones array must have at most 7 elements' })
    @Expose()
    milestones: MilestoneDTO[];

    @ApiProperty()
    @IsNumber()
    @Expose()
    investmentAmount: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    revenue: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    netBalance: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    roi: number

    @ApiProperty()
    @IsString()
    @Expose()
    carbonFootprint: string;
}
