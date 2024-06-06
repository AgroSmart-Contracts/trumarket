import { ApiProperty } from '@nestjs/swagger';
import { CountryCodes } from '@onfido/api';
import { Expose } from 'class-transformer';
import { IsISO31661Alpha3, IsOptional, IsString } from 'class-validator';

export class CreateVerificationDTO {
  @ApiProperty()
  @IsString()
  @Expose()
  firstName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  lastName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  line1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  state?: string; // (2 digit code if US)

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  postcode?: string;

  @ApiProperty()
  @IsISO31661Alpha3()
  @Expose()
  country: CountryCodes; // (3 digit country code)

  @ApiProperty()
  @IsString()
  @Expose()
  town: string;
}
