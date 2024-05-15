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

export class MilestoneDTO {
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty()
  @IsString()
  @Expose()
  fundsDistribution: number;
}

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

  @ApiProperty()
  @IsNumber()
  @Expose()
  contractId: number;

  @ApiProperty()
  @IsString()
  @Expose()
  origin: string;

  @ApiProperty()
  @IsString()
  @Expose()
  destination: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  presentation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  variety?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  size?: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  expectedShippingEndDate: Date;

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  carbonFootprint?: string;

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
}
