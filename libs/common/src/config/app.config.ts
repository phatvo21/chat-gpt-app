import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  port: +process.env.APP_PORT,
  databaseUrl: process.env.DATABASE_URL,
  throttleTll: +process.env.THROTTLE_TTL,
  throttleLimit: +process.env.THROTTLE_LIMIT,
}));
