import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { DealStatus } from '../deals.entities';

export class ListDealsDto {
  @ApiProperty({ required: false })
  @IsEnum(DealStatus)
  @IsOptional()
  @Expose()
  status?: DealStatus;
}
