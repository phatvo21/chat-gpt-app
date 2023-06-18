import { ChatHistory } from '@app/chat-api/modules/chat/dtos/chat-history.interface';
import { StoreChat } from '@app/chat-api/modules/chat/dtos/store-chat.interface';
import { ChatRepositoryInterface } from '@app/chat-api/modules/chat/repository/interface/chat-repository.interface';
import { ChatDocument, ChatEntity } from '@app/chat-api/modules/chat/schema/chat.schema';
import { ChatHistoryOutputDto } from '@app/chat-api/modules/user/dtos/chat-history.output.dto';
import { BaseRepository } from '@app/common/repositories/base.repository';
import { paginateAggregation, paginateTakeSkipCalculation } from '@app/common/utils/paginate.util';
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

    // If there is no chat history then create a new one. Otherwise update the chat conversations
    await (chatHistory
      ? this.chatModel
          .findOneAndUpdate({ userId }, { $push: { conversations: { $each: conversations } } }, { new: true })
          .exec()
      : this.chatModel.create({
          userId,
          conversations,
        }));
  }

  public async findChatByUserId(query: ChatHistory): Promise<ChatHistoryOutputDto> {
    const { userId } = query;
    // Extract the computed pagination params from our helper function
    const { take, skip, page } = paginateTakeSkipCalculation({ size: query?.size, page: query?.page });

    // Query the chat history using mongo aggregate
    const results = await this.chatModel.aggregate([
      {
        $match: { userId },
      },
      {
        $project: {
          conversations: {
            $slice: ['$conversations', skip, take],
          },
          total: {
            $size: '$conversations',
          },
        },
      },
    ]);

    // Extract the chat history object from the aggregated array as we have only one record belong the given user
    const chatHistory = results[0];
    // Extract the conversations and total conversations from the chat history
    const { conversations, total } = chatHistory;

    // Here we aggregate the pagination data
    const { size, currentPage, nextPage, lastPage, prevPage } = paginateAggregation({
      total,
      take,
      page,
    });
    return { data: conversations, total, currentPage, size, lastPage, nextPage, prevPage };
  }
}
