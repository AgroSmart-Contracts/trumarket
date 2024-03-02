import { IsDate, IsNumber, IsString } from 'class-validator';
import {Expose} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';


export class UpdateDealDto {
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

    @ApiProperty()
    @IsNumber()
    @Expose()
    investmentAmount: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    revenue: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    netBalance: number

    @ApiProperty()
    @IsNumber()
    @Expose()
    roi: number

    @ApiProperty()
    @IsString()
    @Expose()
    carbonFootprint: string;
}
