import { UserController } from '@app/chat-api/modules/user/user.controller';
import { UserService } from '@app/chat-api/modules/user/userService';
import { Test, TestingModule } from '@nestjs/testing';

import { chatFactoryStub } from '../../factory/stubs/chat-history.stub';
import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;
  const chatHistory = chatFactoryStub();
  const chatHistoryResponseData = {
    data: chatHistory.conversations,
    total: 10,
    currentPage: 1,
    size: 1,
    lastPage: null,
    nextPage: null,
    prevPage: null,
  };

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        getChatHistory: jest.fn(() => {
          return chatHistoryResponseData;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserServiceProvider],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  it('should fetch the chat history for a given user', async () => {
    const userData = { user: userFactoryStub()._id.toString() };
    const req = { user: userData };
    const query = { page: 10, size: 1 };

    const result = await userController.getChatHistory(req, query);

    expect(userService.getChatHistory).toHaveBeenCalledTimes(1);
    expect(userService.getChatHistory).toHaveBeenCalledWith({
      userId: userData.user,
      ...query,
    });
    expect(JSON.stringify(result.data)).toBe(JSON.stringify(chatHistoryResponseData.data));
    expect(result.total).toBe(chatHistoryResponseData.total);
    expect(result.currentPage).toBe(chatHistoryResponseData.currentPage);
    expect(result.nextPage).toBe(chatHistoryResponseData.nextPage);
    expect(result.lastPage).toBe(chatHistoryResponseData.lastPage);
    expect(result.prevPage).toBe(chatHistoryResponseData.prevPage);
  });
});
