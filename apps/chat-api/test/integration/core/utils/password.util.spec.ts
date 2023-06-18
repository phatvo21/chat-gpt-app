import { PasswordUtil } from '@app/chat-api/modules/core/utils/password.util';
import bcrypt from 'bcrypt';

describe('Core/Utils/PasswordUtils', () => {
  it('should return true if the password is matched', () => {
    const hash = bcrypt.hashSync('testpassword', 12);
    const check = PasswordUtil.check('testpassword', hash);

    expect(check).toBe(true);
  });

  it('should return false if the password is not matched', () => {
    const hash = bcrypt.hashSync('testpassword', 12);
    const check = PasswordUtil.check('ok', hash);

    expect(check).toBe(false);
  });

  it('should hash the password successfully', () => {
    const hash = PasswordUtil.hash('testpassword');

    expect(hash).not.toBe('testpassword');
  });
});
