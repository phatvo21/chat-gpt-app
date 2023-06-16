import { TokensManager } from '@app/chat-api/core/auth/tokens.manager';
import { UserService } from '@app/chat-api/user/userService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly tokenManager: TokensManager) {}

  public async userRegister(data: { email: string; password: string }): Promise<any> {
    const user = await this.userService.findByEmail(data.email);
    // TODO: Returns fake token if there is an existing user
    if (user) return {};

    const userCreated = await this.userService.create(data);
    const accessToken = this.tokenManager.generateJwt(userCreated);
    const refreshToken = await this.tokenManager.generateRefreshToken(userCreated._id.toString());

    // TODO: Handle to send the verification email

    return {
      accessToken,
      refreshToken,
    };
  }
}
