import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupResponseDto {
  constructor(res: SignupResponseDto) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;
}
