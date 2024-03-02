import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UploadDocumentResponseDTO {
  @ApiProperty()
  @Expose()
  file: string

  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  description: string
}
