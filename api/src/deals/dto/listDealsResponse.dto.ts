import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class ListDealDtoResponse {
  constructor(res: ListDealDtoResponse) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @IsString()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  shippingStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  expectedShippingEndDate: Date;

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

  @ApiProperty()
  @IsString()
  @Expose()
  carbonFootprint: string;
}
