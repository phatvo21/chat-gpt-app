import { StoreChat } from '@app/chat-api/chat/dtos/store-chat.interface';
import { ChatRepositoryInterface } from '@app/chat-api/chat/repository/interface/chat-repository.interface';
import { ChatDocument, ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { BaseRepository } from '@app/common/repositories/base.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatRepository extends BaseRepository<ChatEntity> implements ChatRepositoryInterface {
  protected readonly logger = new Logger(ChatRepository.name);

  constructor(
    @InjectModel(ChatEntity.name)
    private readonly chatModel: Model<ChatDocument>,
  ) {
    super(chatModel);
  }

  public async addOrUpdateHistoryChat(data: StoreChat): Promise<void> {
    const { conversations, userId } = data;
    const chatHistory = await this.chatModel.findOne({ userId });

    await (chatHistory
      ? this.chatModel
          .findOneAndUpdate({ userId }, { $push: { conversations: { $each: conversations } } }, { new: true })
          .exec()
      : this.chatModel.create({
          userId,
          conversations,
        }));
  }
}
