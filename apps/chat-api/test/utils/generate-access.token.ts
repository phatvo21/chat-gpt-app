import { JWT_KEY } from '@app/chat-api/core/auth/constants';
import { UserToken } from '@app/chat-api/core/auth/tokens.manager';
import { PasswordUtil } from '@app/chat-api/core/utils/password.util';
import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import jwt from 'jsonwebtoken';

export class GenerateAccessToken {
  public static async generateToken(userModel: any): Promise<{ user: UserEntity; token: string }> {
    const password = 'test@123456';
    const userData = {
      email: 'test@example.com',
      password: PasswordUtil.hash(password),
    };

    const userCreated = await userModel.create(userData);

    const payload: UserToken = {
      user: userCreated._id.toString(),
    };
    const token = jwt.sign(payload, JWT_KEY);

    return {
      user: userCreated,
      token,
    };
  }
}
