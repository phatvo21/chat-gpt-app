import { JWT_KEY, JWT_TTL } from '@app/chat-api/modules/core/auth/constants';
import { UserModule } from '@app/chat-api/modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthManager } from './auth/auth.manager';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { TokensManager } from './auth/tokens.manager';

const AUTHENTICATION_STRATEGIES = [LocalStrategy, JwtStrategy];
const PROVIDER_AND_EXPORT_MODULES = [...AUTHENTICATION_STRATEGIES, AuthManager, TokensManager];

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { expiresIn: Number(JWT_TTL) },
    }),
  ],
  controllers: [],
  providers: [...PROVIDER_AND_EXPORT_MODULES],
  exports: [...PROVIDER_AND_EXPORT_MODULES],
})
export class CoreModule {}
