import { ChatDto } from '@app/chat-api/chat/dtos/chat.dto';
import { StoreChat } from '@app/chat-api/chat/dtos/store-chat.interface';
import { ChatRepositoryInterface } from '@app/chat-api/chat/repository/interface/chat-repository.interface';
import { LangChain } from '@app/common/services/language-models/lang-chain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(
    @Inject('ChatRepositoryInterface')
    private readonly chatRepo: ChatRepositoryInterface,
  ) {}

  public getMessageResponse(data: ChatDto): Promise<any> {
    const { message } = data;
    return LangChain.chat(message);
  }

  public async storeChatHistory(data: StoreChat): Promise<void> {
    await this.chatRepo.addOrUpdateHistoryChat(data);
  }
}
