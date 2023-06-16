import { AuthModule } from '@app/chat-api/auth/auth.module';
import { ChatModule } from '@app/chat-api/chat/chat.module';
import { CoreModule } from '@app/chat-api/core/core.module';
import { InitModule } from '@app/chat-api/init/init.module';
import { UserModule } from '@app/chat-api/user/user.module';
import { BaseModule } from '@app/common/modules/base.module';
import { RateLimitModule } from '@app/common/modules/rate-limit.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Apply rate limit to all the endpoints inside this module
const rateLimitConfig = { provide: APP_GUARD, useClass: ThrottlerGuard };

@Module({
  imports: [BaseModule, RateLimitModule, InitModule, UserModule, ChatModule, CoreModule, AuthModule],
  providers: [rateLimitConfig],
})
export class AppModule {}
