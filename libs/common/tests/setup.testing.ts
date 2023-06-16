process.env.NODE_ENV = 'testing';
// eslint-disable-next-line no-secrets/no-secrets
process.env.DATABASE_URL = 'mongodb://mongo:mongo@localhost:27017/chat-api?authSource=admin';

jest.setTimeout(60_000);
