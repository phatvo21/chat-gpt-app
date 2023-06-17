import { ChatController } from '@app/chat-api/chat/chat.controller';
import { ChatService } from '@app/chat-api/chat/chat.service';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Chat Controller', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const ChatServiceProvider = {
      provide: ChatService,
      useFactory: () => ({
        getMessageResponse: jest.fn(() => {
          return 'Hello world!';
        }),
        storeChatHistory: jest.fn(() => {
          return null;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService, ChatServiceProvider],
    }).compile();

    chatController = app.get<ChatController>(ChatController);
    chatService = app.get<ChatService>(ChatService);
  });

  it('should send the message and received the response', async () => {
    const req = { user: { user: userFactoryStub()._id.toString() } };
    const body = {
      message: faker.lorem.word(),
    };

    const { response } = await chatController.chat(req, body);

    expect(chatService.getMessageResponse).toHaveBeenCalledTimes(1);
    expect(chatService.getMessageResponse).toHaveBeenCalledWith(body);
    expect(chatService.storeChatHistory).toHaveBeenCalledTimes(1);
    expect(chatService.storeChatHistory).toHaveBeenCalledWith({
      userId: req.user.user,
      conversation: {
        message: body.message,
        response,
      },
    });
    expect(response).toBe('Hello world!');
  });
});
