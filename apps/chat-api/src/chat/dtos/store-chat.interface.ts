import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';

export interface StoreChat {
  userId: string;
  conversations: Conversation[];
}

export interface Conversation {
  message: string;
  type: ConversationEnum;
}
