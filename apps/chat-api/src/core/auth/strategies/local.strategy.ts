import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthManager } from '../auth.manager';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthManager) {
    super();
  }

  public async validate(username: string, password: string): Promise<Partial<UserEntity>> {
    return this.auth.validateUser(username, password);
  }
}
