import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Expose()
  deliveryStartDate: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Expose()
  deliveryEndDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  investmentAmount: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  revenue: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  netBalance: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  roi: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  carbonFootprint: string;
}
