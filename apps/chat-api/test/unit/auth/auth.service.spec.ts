import { AuthService } from '@app/chat-api/modules/auth/auth.service';
import { TokensManager } from '@app/chat-api/modules/core/auth/tokens.manager';
import { UserService } from '@app/chat-api/modules/user/userService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Auth Service', () => {
  let authService: AuthService;
  let userService: UserService;
  let tokenManager: TokensManager;
  const response = {
    token: faker.lorem.word(),
    refreshToken: faker.lorem.word(),
  };
  const user = userFactoryStub();

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        create: jest.fn(() => {
          return user;
        }),
        findByEmail: jest.fn(() => {
          return null;
        }),
      }),
    };

    const TokenManagerProvider = {
      provide: TokensManager,
      useFactory: () => ({
        generateJwt: jest.fn(() => {
          return response.token;
        }),
        generateRefreshToken: jest.fn(() => {
          return response.refreshToken;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserServiceProvider, TokensManager, TokenManagerProvider],
    }).compile();

    userService = app.get<UserService>(UserService);
    tokenManager = app.get<TokensManager>(TokensManager);

    authService = new AuthService(userService, tokenManager);
  });

  describe('User Register', () => {
    it('should register successfully', async () => {
      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { token, refreshToken } = await authService.userRegister(body);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
      expect(tokenManager.generateJwt).toHaveBeenCalledTimes(1);
      expect(tokenManager.generateJwt).toHaveBeenCalledWith(user);
      expect(tokenManager.generateRefreshToken).toHaveBeenCalledTimes(1);
      expect(tokenManager.generateRefreshToken).toHaveBeenCalledWith(user._id.toString());
      expect(token).toBe(response.token);
      expect(refreshToken).toBe(response.refreshToken);
    });
  });
});
