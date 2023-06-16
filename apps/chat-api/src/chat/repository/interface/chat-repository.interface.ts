import { ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { BaseRepositoryInterface } from '@app/common/repositories/base-repository.interface';

export type ChatRepositoryInterface = BaseRepositoryInterface<ChatEntity>;
