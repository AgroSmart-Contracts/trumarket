import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class DealLogsDtoResponse {
  constructor(res: DealLogsDtoResponse) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @IsString()
  @Expose()
  message: string;

  @ApiProperty()
  @IsString()
  @Expose()
  event: string;

  @ApiProperty()
  @IsString()
  @Expose()
  txHash: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  blockTimestamp: Date;
}
