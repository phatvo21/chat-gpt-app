export interface StoreChat {
  userId: string;
  conversation: Conversation;
}

export interface Conversation {
  message: string;
  response: string;
}
