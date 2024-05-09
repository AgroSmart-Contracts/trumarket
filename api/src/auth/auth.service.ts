import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jose from 'jose';
import UserModel from './users.model';
import { config } from '../config';

export interface Auth0Info {
  payload: {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    nbf: number;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
  };
}

export interface Wallet {
  address: string;
  type: string;
}

export interface Web3AuthInfo {
  payload: {
    iat: number;
    iss: string;
    aud: string;
    wallets: Wallet[];
    exp: number;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(web3authToken: string): Promise<string> {
    const userWallet = await this.verifyWeb3AuthJwtToken(web3authToken);
    if (!userWallet) {
      throw new Error('Invalid web3authToken');
    }

    const user = await UserModel.findOne({
      walletAddress: userWallet.address,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.generateJwtToken(userWallet.address);

    return token;
  }

  async generateJwtToken(address: string): Promise<string> {
    const accessToken = await this.jwtService.signAsync({ address });
    return accessToken;
  }

  verifyAuth0JwtToken(token: string): Promise<Auth0Info> {
    const jwks = jose.createRemoteJWKSet(
      new URL(`https://${config.auth0Domain}/.well-known/jwks.json`),
    );

    return jose.jwtVerify(token, jwks, {
      algorithms: ['RS256'],
    }) as any;
  }

  async verifyWeb3AuthJwtToken(token: string): Promise<Wallet | undefined> {
    const jwks = jose.createRemoteJWKSet(
      new URL('https://authjs.web3auth.io/jwks'),
    );

    const decoded: Web3AuthInfo = await jose.jwtVerify(token, jwks, {
      algorithms: ['ES256'],
    });

    const wallet = decoded.payload.wallets[0];

    if (wallet) {
      return {
        address: wallet.address.toLowerCase(),
        type: wallet.type,
      };
    }

    return;
  }
}
