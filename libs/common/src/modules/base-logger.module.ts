import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.cookie'],
        enabled: process.env.NODE_ENV !== 'testing',
        // enabled: true,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        formatters: {
          level: (label: string): any => {
            return { level: label };
          },
        },
      },
      exclude: [{ method: RequestMethod.ALL, path: '/health' }],
    }),
  ],
})
export class BaseLoggerModule {}
