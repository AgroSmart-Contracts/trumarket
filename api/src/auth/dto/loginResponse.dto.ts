import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  constructor(res: LoginResponseDto) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;
}
