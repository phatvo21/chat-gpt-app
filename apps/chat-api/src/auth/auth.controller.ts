import { AuthManager } from '@app/chat-api/core/auth/auth.manager';
import { LocalAuthGuard } from '@app/chat-api/core/auth/strategies/local.strategy';
import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import { CreateEndpoint } from '@app/common/decorators/create-endpoint.decorator';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { InitDto } from './dtos/init.dto';

@Controller('public/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private authManager: AuthManager) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @CreateEndpoint('Endpoint allowing user to login', InitDto, InitDto, UserEntity)
  public async login(@Request() req, @Body() body: any): Promise<{ refreshToken: string; token: string }> {
    return this.authManager.login(req.user, body);
  }

  @Post('registration')
  @CreateEndpoint('Endpoint allowing user to register', InitDto, InitDto, UserEntity)
  public async register(@Body() body: any): Promise<{ refreshToken: string; token: string }> {
    return this.authService.userRegister(body);
  }
}
