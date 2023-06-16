import { getAdapter } from '@app/common/utils/fastify.util';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { exec } from 'child_process';
import fastifyCookie from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import { Model } from 'mongoose';
import supertest from 'supertest';
// eslint-disable-next-line unicorn/import-style
import util from 'util';

export const execAsync = util.promisify(exec);

export const restoreDb = async (models: any): Promise<void> => {
  const deleteDocumentsPromise = Object.values(models).map((model: Model<any>) => model.deleteMany());
  await Promise.all(deleteDocumentsPromise);
};

export interface ServerType {
  app: NestFastifyApplication;
  module: TestingModule;
}
export interface RequestType {
  agent: supertest.SuperTest<supertest.Test>;
}

export const generateRequest = (server: { app: NestFastifyApplication }): RequestType => {
  const agent = supertest.agent(server.app.getHttpServer());
  return {
    agent,
  };
};

export const generateMockServer = async (modules = []): Promise<ServerType> => {
  const moduleChatApi: TestingModule = await Test.createTestingModule({
    imports: modules,
  }).compile();

  const adapter = getAdapter();
  const app = moduleChatApi.createNestApplication<NestFastifyApplication>(adapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
    }),
  );
  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return {
    app,
    module: moduleChatApi,
  };
};

export const getModel = (entityName: string) => getModelToken(entityName);

export const getConnection = () => getConnectionToken();

export const wait = async (time = 500) => new Promise((resolve) => setTimeout(() => resolve(''), time));
