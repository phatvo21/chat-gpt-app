import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

import { REFRESH_TOKEN_TTL, REFRESH_TOKEN_TTL_LONG_LIVED } from './constants';
import moment = require('moment');
import { UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import { UserService } from '@app/chat-api/modules/user/userService';

export interface UserToken {
  user: string;
}

@Injectable()
export class TokensManager {
  constructor(private readonly userService: UserService, private jwt: JwtService) {}

  public generateJwt(user: UserEntity): string {
    const payload: UserToken = {
      user: user._id.toString(),
    };

    return this.jwt.sign(payload);
  }

  public async generateRefreshToken(userId: string, longLived = false): Promise<string> {
    const refreshToken = uuid();
    const refreshTokenExpiresAt = moment()
      .add(longLived ? REFRESH_TOKEN_TTL_LONG_LIVED : REFRESH_TOKEN_TTL, 'seconds')
      .toDate();

    const user = await this.userService.setToken({ userId, token: refreshToken, expiresAt: refreshTokenExpiresAt });
    return user?.token?.token;
  }

  public async validate(token: string): Promise<{ user: UserEntity; token: string; validatedToken: string }> {
    if (!token) throw new UnauthorizedException();

    const user = await this.userService.findOneByToken(token);

    if (!user || !user.token) throw new UnauthorizedException();
    if (user?.token?.expiresAt < moment().toDate()) throw new UnauthorizedException();

    const jwt = this.generateJwt(user);
    return { user, token: jwt, validatedToken: user?.token?.token };
  }

  public async getUserFromToken(authorization: string): Promise<Partial<UserEntity>> {
    const payload = this.jwt.decode(authorization.split(' ')[1]) as UserToken;
    return this.userService.get(payload.user);
  }
}
