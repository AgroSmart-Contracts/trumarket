import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupDto } from './dto/singup.dto';
import { SignupResponseDto } from './dto/signupResponse.dto';
import { InternalServerError } from '../errors';
import { logger } from 'src/logger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Login Token',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const { web3authToken } = loginDto;

    const token = await this.authService.login(web3authToken);

    return new LoginResponseDto({ token });
  }

  @Post('signup')
  @ApiResponse({
    status: 200,
    type: SignupResponseDto,
    description: 'Login Token',
  })
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
    const { auth0Token, web3authToken, accountType } = signupDto;

    try {
      let email: string;

      if (auth0Token) {
        // Verify Auth0 JWT token
        const auth0Payload =
          await this.authService.verifyAuth0JwtToken(auth0Token);
        email = auth0Payload.payload.email;

        logger.debug({ auth0Payload }, 'Auth0 JWT token verified');
      }

      // Verify Web3Auth JWT token
      const wallet =
        await this.authService.verifyWeb3AuthJwtToken(web3authToken);
      const walletAddress = wallet.address;
      const walletType = wallet.type;

      // Create new user
      await this.userService.create({
        email,
        walletAddress,
        walletType,
        accountType,
      });

      return new SignupResponseDto({
        token: await this.authService.login(web3authToken),
      });
    } catch (e) {
      logger.error(e, 'Signup failed');
      throw new InternalServerError('Signup failed');
    }
  }
}
