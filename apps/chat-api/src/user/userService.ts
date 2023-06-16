import { PasswordUtil } from '@app/chat-api/core/utils/password.util';
import { UserRepositoryInterface } from '@app/chat-api/user/repository/interface/user-repository.interface';
import { Token, UserEntity } from '@app/chat-api/user/schema/user.schema';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  public setToken(data: { userId: string; token: string; expiresAt: Date }): Promise<any> {
    const { userId, token, expiresAt } = data;

    const updatedToken: Token = {
      token,
      expiresAt,
    };
    return this.userRepo.update({ _id: userId }, { token: updatedToken });
  }

  public findOneByToken(token: string): Promise<UserEntity> {
    return this.userRepo.findOneByToken(token);
  }

  public get(id: string): Promise<Partial<UserEntity>> {
    return this.userRepo.findById(id);
  }

  public async findByEmail(email: string): Promise<Partial<UserEntity> | null> {
    const user = await this.userRepo.findOne({ email });
    if (!user) return null;
    return user;
  }

  public async create(data: { password: string; email: string }): Promise<UserEntity> {
    const { password, email } = data;
    const hasPassword = PasswordUtil.hash(password);
    return this.userRepo.create({
      password: hasPassword,
      email,
    });
  }
}
