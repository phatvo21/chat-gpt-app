import { AuthOutputDto } from '@app/chat-api/auth/dtos/auth-output.dto';
import { RegisterDto } from '@app/chat-api/auth/dtos/register.dto';
import { TokensManager } from '@app/chat-api/core/auth/tokens.manager';
import { UserService } from '@app/chat-api/user/userService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly tokenManager: TokensManager) {}

  public async userRegister(data: RegisterDto): Promise<AuthOutputDto> {
    const user = await this.userService.findByEmail(data.email);
    // TODO: Returns fake token if there is an existing user
    if (user) return { token: '', refreshToken: '' };

    const userCreated = await this.userService.create(data);
    const accessToken = this.tokenManager.generateJwt(userCreated);
    const refreshToken = await this.tokenManager.generateRefreshToken(userCreated._id.toString());

    // TODO: Handle to send the verification email

    return {
      token: accessToken,
      refreshToken,
    };
  }
}
