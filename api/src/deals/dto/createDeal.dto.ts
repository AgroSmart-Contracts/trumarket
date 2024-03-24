import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MilestoneDTO {
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty()
  @IsString()
  @Expose()
  location: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  date: Date;
}

export class CreateDealDto {
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  deliveryStartDate: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  deliveryEndDate: Date;

  @ApiProperty({
    type: [MilestoneDTO],
    description: 'Array of 7 milestone objects',
    example: [{ description: '...', location: '...', date: 'YYYY-MM-DD' }],
    maxLength: 7,
    minLength: 7,
  })
  @ArrayMinSize(7, {
    message: 'Milestones array must have at least 7 elements',
  })
  @ArrayMaxSize(7, { message: 'Milestones array must have at most 7 elements' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDTO)
  @Expose()
  milestones: MilestoneDTO[];

  @ApiProperty()
  @IsNumber()
  @Expose()
  investmentAmount: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  revenue: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  netBalance: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  roi: number;

  @ApiProperty()
  @IsString()
  @Expose()
  carbonFootprint: string;
}
