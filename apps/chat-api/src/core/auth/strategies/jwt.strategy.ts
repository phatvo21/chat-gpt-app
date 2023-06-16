import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_KEY } from '../constants';
import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { UserToken } from '../tokens.manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      ignoreExpiration: true,
      secretOrKey: JWT_KEY,
    });
  }

  public async validate(payload: any): Promise<UserToken> {
    if (this.isTokenExpired(payload.exp)) throw new TokenExpiredException();

    return {
      user: payload.user.toString(),
    };
  }

  private isTokenExpired(exp): boolean {
    return Date.now() >= exp * 1000;
  }
}
