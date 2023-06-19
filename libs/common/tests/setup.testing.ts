// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config({
  path: 'apps/chat-api/.env',
});

process.env.NODE_ENV = 'testing';
// eslint-disable-next-line no-secrets/no-secrets
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'mongodb://mongo:mongo@localhost:27017/chat-api?authSource=admin';

process.env.THROTTLE_TTL = process.env.THROTTLE_TTL ?? '60';
process.env.THROTTLE_LIMIT = process.env.THROTTLE_LIMIT ?? '10';

process.env.JWT_KEY = process.env.JWT_KEY ?? 'thisislongjwtkeyconfiguration';
process.env.REFRESH_TOKEN_TTL_LONG_LIVED = process.env.REFRESH_TOKEN_TTL_LONG_LIVE ?? '2_592_000';
process.env.REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL ?? '86_400';
process.env.JWT_TTL = process.env.JWT_TTL ?? '50000';

process.env.OPEN_API_KEY = process.env.OPEN_API_KEY ?? process.env.OPEN_API_TESTING_KEY;

jest.setTimeout(60_000);
