import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `apps/${process.env.SERVICE_NAME}/.env`,
      isGlobal: true,
      load: [appConfig],
      cache: true,
    }),
  ],
})
export class BaseConfigModule {}
