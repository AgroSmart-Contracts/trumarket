import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AssignNFTDto {
  @ApiProperty()
  @IsString()
  @Expose()
  txHash: string;
}
