import bcrypt from 'bcrypt';

export class PasswordUtil {
  public static check(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public static hash(password: string): string {
    return bcrypt.hashSync(password, 12);
  }
}
