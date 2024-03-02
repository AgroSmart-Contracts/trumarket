import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty,  IsEthereumAddress } from 'class-validator';

export class WhitelistWalletDto {
    @ApiProperty({
        example: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        description: 'Ethereum wallet address starting with 0x followed by 40 hex characters',
    })
    @IsString()
    @IsNotEmpty()
    @IsEthereumAddress()
    address: string;
}
