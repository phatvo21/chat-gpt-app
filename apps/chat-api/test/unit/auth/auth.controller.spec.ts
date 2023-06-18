import { AuthController } from '@app/chat-api/modules/auth/auth.controller';
import { AuthService } from '@app/chat-api/modules/auth/auth.service';
import { AuthManager } from '@app/chat-api/modules/core/auth/auth.manager';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let authManager: AuthManager;
  const response = {
    token: faker.lorem.word(),
    refreshToken: faker.lorem.word(),
  };

  beforeEach(async () => {
    const AuthServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        userRegister: jest.fn(() => {
          return response;
        }),
      }),
    };

    const AuthManagerProvider = {
      provide: AuthManager,
      useFactory: () => ({
        login: jest.fn(() => {
          return response;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, AuthServiceProvider, AuthManager, AuthManagerProvider],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    authManager = app.get<AuthManager>(AuthManager);
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const req = { user: userFactoryStub() };
      const body = {
        username: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { token, refreshToken } = await authController.login(req, body);
      expect(authManager.login).toHaveBeenCalledTimes(1);
      expect(authManager.login).toHaveBeenCalledWith(req.user, body);
      expect(token).toBe(response.token);
      expect(refreshToken).toBe(response.refreshToken);
    });
  });

  describe('Register', () => {
    it('should register successfully', async () => {
      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { token, refreshToken } = await authController.register(body);
      expect(authService.userRegister).toHaveBeenCalledTimes(1);
      expect(authService.userRegister).toHaveBeenCalledWith(body);
      expect(token).toBe(response.token);
      expect(refreshToken).toBe(response.refreshToken);
    });
  });
});
