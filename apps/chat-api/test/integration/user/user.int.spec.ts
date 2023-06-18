import { AppModule } from '@app/chat-api/app.module';
import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';
import { ChatDocument, ChatEntity } from '@app/chat-api/modules/chat/schema/chat.schema';
import { UserDocument, UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import {
  generateMockServer,
  generateRequest,
  getConnection,
  getModel,
  RequestType,
  restoreDb,
  ServerType,
} from '@app/common/utils/database-test.util';
import { Model } from 'mongoose';

import { GenerateAccessToken } from '../../utils/generate-access.token';

describe('User Integration', () => {
  let server: ServerType;
  let request: RequestType;
  let userModel = Model<UserDocument>;
  let chatModel = Model<ChatDocument>;
  let models: any;
  let accessToken: string;
  let generatedUser: UserEntity;
  const chatConversation = [
    {
      messages: 'Hello there!',
      type: ConversationEnum.USER,
    },
    {
      messages: 'Hi there!',
      type: ConversationEnum.BOT,
    },
    {
      messages: 'How are you?',
      type: ConversationEnum.USER,
    },
    {
      messages: "I'm doing well",
      type: ConversationEnum.BOT,
    },
  ];

  beforeAll(async () => {
    server = await generateMockServer([AppModule]);
    models = server.module.get(getConnection()).models;
    request = generateRequest(server);

    // Get user model
    userModel = server.module.get(getModel(UserEntity.name));

    // Get chat model
    chatModel = server.module.get(getModel(ChatEntity.name));
  });

  beforeEach(async () => {
    await restoreDb(models);
    const generatedTokenData = await GenerateAccessToken.generateToken(userModel);
    accessToken = generatedTokenData.token;
    generatedUser = generatedTokenData.user;

    await chatModel.create({
      userId: generatedUser._id,
      conversations: chatConversation,
    });
  });

  afterAll(async () => {
    await server.app.close();
  });

  afterEach(async () => {
    await restoreDb(models);
  });

  describe('Chat History', () => {
    it('should throw 401 unauthorized if access token do not match', async () => {
      const fakeToken = 'fake';

      const {
        body: { statusCode },
      } = await request.agent.get(`/users/chat-history`).set({ Authorization: `Bearer ${fakeToken}` });

      expect(statusCode).toBe(401);
    });

    it('should fetch the chat history without paging', async () => {
      const { body } = await request.agent.get(`/users/chat-history`).set({ Authorization: `Bearer ${accessToken}` });

      expect(JSON.stringify(body.data)).toBe(JSON.stringify(chatConversation));
      expect(body.total).toBe(4);
      expect(body.currentPage).toBe(1);
      expect(body.nextPage).toBeNull();
      expect(body.lastPage).toBe(1);
      expect(body.prevPage).toBeNull();
    });

    it('should fetch the chat history with paging', async () => {
      const { body } = await request.agent
        .get(`/users/chat-history`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .query({
          size: Number(2),
          page: Number(1),
        });

      expect(JSON.stringify(body.data)).toBe(JSON.stringify([chatConversation[0], chatConversation[1]]));
      expect(body.total).toBe(4);
      expect(body.currentPage).toBe(1);
      expect(body.nextPage).toBe(2);
      expect(body.lastPage).toBe(2);
      expect(body.prevPage).toBeNull();
    });
  });
});
