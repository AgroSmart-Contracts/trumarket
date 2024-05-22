import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;
}
