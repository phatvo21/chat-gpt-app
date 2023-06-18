import { ChatHistory } from '@app/chat-api/modules/chat/dtos/chat-history.interface';
import { StoreChat } from '@app/chat-api/modules/chat/dtos/store-chat.interface';
import { ChatEntity } from '@app/chat-api/modules/chat/schema/chat.schema';
import { ChatHistoryOutputDto } from '@app/chat-api/modules/user/dtos/chat-history.output.dto';
import { BaseRepositoryInterface } from '@app/common/repositories/base-repository.interface';

export interface ChatRepositoryInterface extends BaseRepositoryInterface<ChatEntity> {
  addOrUpdateHistoryChat(data: StoreChat): Promise<void>;

  findChatByUserId(query: ChatHistory): Promise<ChatHistoryOutputDto>;
}
