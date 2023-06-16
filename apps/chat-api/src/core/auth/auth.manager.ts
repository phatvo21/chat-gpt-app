import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import { UserService } from '@app/chat-api/user/userService';
import { Injectable } from '@nestjs/common';

import { PasswordUtil } from '../utils/password.util';
import { FailedLoginException } from './exceptions/failed-login.exception';
import { TokensManager } from './tokens.manager';

@Injectable()
export class AuthManager {
  constructor(private readonly userService: UserService, private tokensManager: TokensManager) {}

  public async validateUser(username: string, password: string): Promise<Partial<UserEntity>> {
    const user = await this.userService.findByEmail(username);
    if (!user) this.throwFailedLoginException();

    if (!PasswordUtil.check(password, user.password)) this.throwFailedLoginException();
    return user;
  }

  public async login(user: UserEntity, loginBody: any): Promise<{ refreshToken: string; token: string }> {
    if (!user) this.throwFailedLoginException();

    const refreshToken = await this.tokensManager.generateRefreshToken(user._id.toString(), loginBody?.rememberMe);
    const token = this.tokensManager.generateJwt(user);
    return { token, refreshToken };
  }

  private throwFailedLoginException(): void {
    throw new FailedLoginException();
  }
}
