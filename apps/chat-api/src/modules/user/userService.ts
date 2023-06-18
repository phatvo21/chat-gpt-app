import { ChatHistory } from '@app/chat-api/modules/chat/dtos/chat-history.interface';
import { ChatRepositoryInterface } from '@app/chat-api/modules/chat/repository/interface/chat-repository.interface';
import { PasswordUtil } from '@app/chat-api/modules/core/utils/password.util';
import { ChatHistoryOutputDto } from '@app/chat-api/modules/user/dtos/chat-history.output.dto';
import { UserRepositoryInterface } from '@app/chat-api/modules/user/repository/interface/user-repository.interface';
import { Token, UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepo: UserRepositoryInterface,
    @Inject('ChatRepositoryInterface')
    private readonly chatRepo: ChatRepositoryInterface,
  ) {}

  public setToken(data: { userId: string; token: string; expiresAt: Date }): Promise<UserEntity> {
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

  public async getChatHistory(query: ChatHistory): Promise<ChatHistoryOutputDto> {
    return this.chatRepo.findChatByUserId(query);
  }
}
