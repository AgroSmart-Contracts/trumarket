import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ethers } from 'ethers';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() metaMaskDto: LoginDto): Promise<LoginResponseDto> {
    const { signature, message, address } = metaMaskDto;

    // Validate MetaMask signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (address !== recoveredAddress) {
      throw new Error('Invalid signature');
    }

    const token = await this.authService.generateJwtToken(
      address.toLowerCase(),
    );
    return new LoginResponseDto({ token });
  }
}
