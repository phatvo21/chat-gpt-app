import { TokensManager } from '@app/chat-api/modules/core/auth/tokens.manager';
import { UserService } from '@app/chat-api/modules/user/userService';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';

describe('Core/Auth/TokensManager', () => {
  let manager: TokensManager;
  let mockJwtService: JwtService;
  let mockUserService: UserService;

  beforeEach(() => {
    mockJwtService = createMock<JwtService>();
    mockUserService = createMock<UserService>();

    manager = new TokensManager(mockUserService, mockJwtService);
  });

  it('should generate Jwt successfully', () => {
    mockJwtService.sign = () => {
      return 'thisisthetoken';
    };

    const token = manager.generateJwt({ _id: 'test' } as any);
    expect(token).toBe('thisisthetoken');
  });

  it('should generate refresh token successfully', async () => {
    mockUserService.setToken = () => {
      return {
        _id: 'test',
        token: { token: 'refresh-token', expiresAt: '2023-06-16T10:52:46.486Z' as unknown as Date },
      } as any;
    };

    const refreshToken = await manager.generateRefreshToken({ _id: 'test' } as any);
    expect(refreshToken).toBe('refresh-token');
  });
});
