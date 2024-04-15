import { IsDate, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  txHash: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  blockTimestamp: Date;
}
