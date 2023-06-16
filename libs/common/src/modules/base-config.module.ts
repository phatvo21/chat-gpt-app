import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `apps/${process.env.SERVICE_NAME}/.env`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
      load: [appConfig],
      cache: true,
    }),
  ],
})
export class BaseConfigModule {}
