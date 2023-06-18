import { AuthOutputDto } from '@app/chat-api/modules/auth/dtos/auth-output.dto';
import { LoginDto } from '@app/chat-api/modules/auth/dtos/login.dto';
import { RegisterDto } from '@app/chat-api/modules/auth/dtos/register.dto';
import { AuthManager } from '@app/chat-api/modules/core/auth/auth.manager';
import { LocalAuthGuard } from '@app/chat-api/modules/core/auth/strategies/local.strategy';
import { UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import { CreateEndpoint } from '@app/common/decorators/create-endpoint.decorator';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('public/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private authManager: AuthManager) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @CreateEndpoint('Endpoint allowing user to login', LoginDto, AuthOutputDto, UserEntity)
  public async login(@Request() req, @Body() body: LoginDto): Promise<AuthOutputDto> {
    return this.authManager.login(req.user, body);
  }

  @Post('registration')
  @CreateEndpoint('Endpoint allowing user to register', RegisterDto, AuthOutputDto, UserEntity)
  public async register(@Body() body: RegisterDto): Promise<AuthOutputDto> {
    return this.authService.userRegister(body);
  }
}
