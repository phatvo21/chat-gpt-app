import { ChatService } from '@app/chat-api/chat/chat.service';
import { ChatRepository } from '@app/chat-api/chat/repository/chat.repository';
import { LangChain } from '@app/common/services/language-models/lang-chain';
import { Test, TestingModule } from '@nestjs/testing';

import { chatFactoryStub } from '../../factory/stubs/chat-history.stub';
import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Chat Service', () => {
  let chatService: ChatService;
  let chatRepo: ChatRepository;

  const userData = userFactoryStub();
  const chatData = chatFactoryStub({ userId: userData._id });

  beforeEach(async () => {
    const ChatRepositoryProvider = {
      provide: ChatRepository,
      useFactory: () => ({
        addOrUpdateHistoryChat: jest.fn(() => {
          return null;
        }),
        findOneAndUpdate: jest.fn(() => {
          return chatData;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [ChatRepository, ChatRepositoryProvider],
    }).compile();

    chatRepo = app.get<ChatRepository>(ChatRepository);
    chatService = new ChatService(chatRepo);
  });

  it('should receive the response message from LLMs', async () => {
    jest.spyOn(LangChain, 'chat').mockImplementation(() => 'Hello world!' as any);

    const response = await chatService.getMessageResponse({ message: 'Test' });
    expect(response).toBe('Hello world!');
  });

  it('should push the current conversation to list chat history', async () => {
    const data = { userId: userData._id.toString(), conversation: chatData.conversations[0] };

    await chatService.storeChatHistory(data);
    expect(chatRepo.addOrUpdateHistoryChat).toHaveBeenCalledTimes(1);
    expect(chatRepo.addOrUpdateHistoryChat).toHaveBeenCalledWith(data);
  });
});
