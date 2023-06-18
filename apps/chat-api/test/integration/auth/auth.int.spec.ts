import { AppModule } from '@app/chat-api/app.module';
import { PasswordUtil } from '@app/chat-api/modules/core/utils/password.util';
import { UserDocument, UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import {
  generateMockServer,
  generateRequest,
  getConnection,
  getModel,
  RequestType,
  restoreDb,
  ServerType,
} from '@app/common/utils/database-test.util';
import { Model } from 'mongoose';

import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Auth Integration', () => {
  let server: ServerType;
  let request: RequestType;
  let userModel = Model<UserDocument>;
  const data = userFactoryStub();
  const hashPassword = PasswordUtil.hash(data.password);
  const userData = {
    password: hashPassword,
    ...data,
  };
  let user: UserEntity;
  let models: any;

  beforeAll(async () => {
    server = await generateMockServer([AppModule]);
    models = server.module.get(getConnection()).models;
    request = generateRequest(server);
    userModel = server.module.get(getModel(UserEntity.name));
    user = await userModel.create(userData);
  });

  beforeEach(async () => {
    await restoreDb(models);
  });

  afterAll(async () => {
    await server.app.close();
  });

  afterEach(async () => {
    await restoreDb(models);
  });

  describe('Login', () => {
    it('should throw 401 invalid credentials error if the credentials do not match', async () => {
      const {
        body: { statusCode, message },
      } = await request.agent.post(`/public/auth/login`).send({
        username: userData.email,
        password: 'wrong',
      });
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid credentials');
    });

    it('should login successfully', async () => {
      const { body } = await request.agent.post(`/public/auth/login`).send({
        username: userData.email,
        password: user.password,
      });
      expect(body.token).not.toBeNull();
      expect(body.refreshToken).not.toBeNull();
    });
  });

  describe('Register', () => {
    it('should throw 400 once email is invalid', async () => {
      const res = await request.agent.post(`/public/auth/registration`).send({
        email: 1111,
        password: 222,
      });
      expect(res.body.statusCode).toBe(400);
    });

    it('should register successfully', async () => {
      const {
        body: { token, refreshToken },
      } = await request.agent.post(`/public/auth/registration`).send({
        email: 'testemail@gmail.com',
        password: 'wrong12345',
      });

      expect(token).not.toBeNull();
      expect(refreshToken).not.toBeNull();
    });
  });
});
