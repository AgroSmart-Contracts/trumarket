import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { DealsService } from '@/deals/deals.service';
import { logger } from '@/logger';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/users/users.service';

import { InternalServerError } from '../errors';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { SignupResponseDto } from './dto/signupResponse.dto';
import { SignupDto } from './dto/singup.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private dealsService: DealsService,
    private notificationsService: NotificationsService,
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
    description: 'Signup',
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
      const user = await this.userService.create({
        email,
        walletAddress,
        walletType,
        accountType,
      });

      await this.dealsService.assignUserToDeals(user);

      await this.notificationsService.sendAccountCreatedNotification(email);

      return new SignupResponseDto({
        token: await this.authService.login(web3authToken),
      });
    } catch (e) {
      logger.error(e, 'Signup failed');
      throw new InternalServerError('Signup failed');
    }
  }
}
