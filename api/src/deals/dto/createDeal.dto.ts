import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { MilestoneDTO } from './milestone.dto';

export class CreateDealDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  carbonFootprint?: string;

  // shipping properties

  @ApiProperty()
  @IsNumber()
  @Expose()
  contractId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  contractAddress?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  origin: string;

  @ApiProperty()
  @IsString()
  @Expose()
  destination: string;

  @ApiProperty()
  @IsString()
  @Expose()
  portOfOrigin: string;

  @ApiProperty()
  @IsString()
  @Expose()
  portOfDestination: string;

  @ApiProperty()
  @IsString()
  @Expose()
  transport: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  presentation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  size?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  variety?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  quality?: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  offerUnitPrice: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  quantity: number;

  @ApiProperty()
  @IsDate()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  expectedShippingEndDate: Date;

  // state properties

  @ApiProperty({
    type: [MilestoneDTO],
    description: 'Array of 7 milestone objects',
    example: [{ description: '...', location: '...', date: 'YYYY-MM-DD' }],
    maxLength: 7,
    minLength: 7,
  })
  @ArrayMinSize(7, {
    message: 'Milestones array must have at least 7 elements',
  })
  @ArrayMaxSize(7, { message: 'Milestones array must have at most 7 elements' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDTO)
  @Expose()
  milestones: MilestoneDTO[];

  // financial properties

  @ApiProperty()
  @IsNumber()
  @Expose()
  investmentAmount: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  revenue: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  netBalance: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  roi: number;

  // ownership properties

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  @Expose()
  proposalSupplierEmail?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  @Expose()
  proposalBuyerEmail?: string;
}
