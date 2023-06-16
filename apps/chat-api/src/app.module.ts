import { InitModule } from '@app/chat-api/init/init.module';
import { BaseModule } from '@app/common/modules/base.module';
import { RateLimitModule } from '@app/common/modules/rate-limit.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Apply rate limit to all the endpoints inside this module
const rateLimitConfig = { provide: APP_GUARD, useClass: ThrottlerGuard };

@Module({
  imports: [BaseModule, InitModule, RateLimitModule],
  providers: [rateLimitConfig],
})
export class AppModule {}
