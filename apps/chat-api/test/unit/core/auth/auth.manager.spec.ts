import { AuthManager } from '@app/chat-api/modules/core/auth/auth.manager';
import { TokensManager } from '@app/chat-api/modules/core/auth/tokens.manager';
import { PasswordUtil } from '@app/chat-api/modules/core/utils/password.util';
import { UserService } from '@app/chat-api/modules/user/userService';
import { createMock } from '@golevelup/ts-jest';

describe('Core/Auth/AuthManager', () => {
  let manager: AuthManager;
  let mockUserService: UserService;
  let mockTokensManager: TokensManager;

  beforeEach(() => {
    mockUserService = createMock<UserService>();
    mockTokensManager = createMock<TokensManager>();

    mockTokensManager.generateRefreshToken = async () => {
      return 'refreshToken';
    };

    mockTokensManager.generateJwt = () => {
      return 'accessToken';
    };

    manager = new AuthManager(mockUserService, mockTokensManager);
  });

  describe('Login', () => {
    it('should throw 401 error if there is no user', async () => {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect(manager.login(null, {})).rejects.toThrow('Invalid credentials');
    });

    it('should login successfully and retrieve the tokens', async () => {
      const user = {
        _id: 'test',
      } as any;

      const body = {
        rememberMe: false,
        username: 'test',
        password: 'test',
      };

      const { token, refreshToken } = await manager.login(user, {
        rememberMe: false,
        username: 'test',
        password: 'test',
      });

      expect(mockTokensManager.generateJwt).toHaveBeenCalledWith(user);
      expect(mockTokensManager.generateJwt).toHaveBeenCalledTimes(1);
      expect(mockTokensManager.generateRefreshToken).toHaveBeenCalledWith(user._id, body.rememberMe);
      expect(mockTokensManager.generateRefreshToken).toHaveBeenCalledTimes(1);
      expect(token).toBe('accessToken');
      expect(refreshToken).toBe('refreshToken');
    });
  });

  describe('Validate User', () => {
    it('should throw 401 error if the user email do not match', async () => {
      mockUserService.findByEmail = async () => {
        return null;
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect(manager.validateUser('', '')).rejects.toThrow('Invalid credentials');
    });

    it('should throw 401 error if the user password do not match', async () => {
      mockUserService.findByEmail = async () => {
        return {
          email: 'example@gmail.com',
        };
      };

      jest.spyOn(PasswordUtil, 'check').mockImplementation(() => false);

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect(manager.validateUser('example@gmail.com', '')).rejects.toThrow('Invalid credentials');
    });

    it('should validate user successfully', async () => {
      mockUserService.findByEmail = async () => {
        return {
          email: 'example@gmail.com',
        };
      };

      jest.spyOn(PasswordUtil, 'check').mockImplementation(() => true);

      const user = await manager.validateUser('example@gmail.com', 'pass');
      expect(user.email).toBe('example@gmail.com');
    });
  });
});
