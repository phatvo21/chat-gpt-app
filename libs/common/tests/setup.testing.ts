process.env.NODE_ENV = 'testing';
// eslint-disable-next-line no-secrets/no-secrets
process.env.DATABASE_URL = 'mongodb://mongo:mongo@localhost:27017/chat-api?authSource=admin';

process.env.THROTTLE_TTL = '60';
process.env.THROTTLE_LIMIT = '10';

process.env.JWT_KEY = 'thisislongjwtkeyconfiguration';
process.env.REFRESH_TOKEN_TTL_LONG_LIVED = '2_592_000';
process.env.REFRESH_TOKEN_TTL = '86_400';
process.env.JWT_TTL = '50000';

process.env.OPEN_API_KEY = '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';

jest.setTimeout(60_000);
