import { StoreChat } from '@app/chat-api/chat/dtos/store-chat.interface';
import { ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { BaseRepositoryInterface } from '@app/common/repositories/base-repository.interface';

export interface ChatRepositoryInterface extends BaseRepositoryInterface<ChatEntity> {
  addOrUpdateHistoryChat(data: StoreChat): Promise<void>;
}
