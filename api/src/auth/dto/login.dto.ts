import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  signature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  @Expose()
  address: string;
}
