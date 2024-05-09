import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  web3authToken: string;
}
