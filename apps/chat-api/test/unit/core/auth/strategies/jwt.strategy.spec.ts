import { TokenExpiredException } from '@app/chat-api/modules/core/auth/exceptions/token-expired.exception';
import { JwtStrategy } from '@app/chat-api/modules/core/auth/strategies/jwt.strategy';

describe('Core/Auth/Strategies', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  describe('with empty payload', () => {
    it('should throw a TypeError', async () => {
      await strategy.validate({}).catch((error) => {
        expect(error).toBeInstanceOf(TypeError);
      });
    });
  });

  describe('with expired token', () => {
    it('should throw a TokenExpiredException', async () => {
      await strategy.validate({ exp: 1_473_912_000 }).catch((error) => {
        expect(error).toBeInstanceOf(TokenExpiredException);
      });
    });
  });

  describe('with other type of users', () => {
    it('should match UserToken interface', async () => {
      const token = await strategy.validate({
        exp: Date.now,
        user: 'test',
      });
      expect(token).toHaveProperty('user');
    });
  });
});
