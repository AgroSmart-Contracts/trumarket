import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  contractId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  origin: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  destination: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  presentation: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  variety: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  size: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @Expose()
  expectedShippingEndDate: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  investmentAmount: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  revenue: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  netBalance: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  roi: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  carbonFootprint: string;
}
