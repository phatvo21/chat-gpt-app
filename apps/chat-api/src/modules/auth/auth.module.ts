import { CoreModule } from '@app/chat-api/modules/core/core.module';
import { UserModule } from '@app/chat-api/modules/user/user.module';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, CoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
