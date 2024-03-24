import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(address: string): Promise<string> {
    const accessToken = await this.jwtService.signAsync({ address });
    return accessToken;
  }
}
