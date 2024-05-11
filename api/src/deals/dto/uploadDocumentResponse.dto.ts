import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadDocumentResponseDTO {
  constructor(res: UploadDocumentResponseDTO) {
    Object.assign(this, res);
  }

  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  url: string;
}
