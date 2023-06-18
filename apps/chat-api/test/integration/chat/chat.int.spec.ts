import { AppModule } from '@app/chat-api/app.module';
import { ChatDocument, ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';
import { UserDocument, UserEntity } from '@app/chat-api/user/schema/user.schema';
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

describe('Chat Integration', () => {
  let server: ServerType;
  let request: RequestType;
  let userModel = Model<UserDocument>;
  let chatModel = Model<ChatDocument>;
  let models: any;
  let accessToken: string;
  let generatedUser: UserEntity;

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
  });

  afterAll(async () => {
    await server.app.close();
  });

  afterEach(async () => {
    await restoreDb(models);
  });

  describe('Chat', () => {
    it('should throw 401 unauthorized if access token do not match', async () => {
      const fakeToken = 'fake';

      const {
        body: { statusCode },
      } = await request.agent
        .post(`/chat`)
        .set({ Authorization: `Bearer ${fakeToken}` })
        .send({
          message: 'check',
        });
      expect(statusCode).toBe(401);
    });

    it('should send message, receive response and store in chat history successfully', async () => {
      const message = 'Hello! I need some help';

      const { body } = await request.agent
        .post(`/chat`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          message,
        });

      const { conversations } = await chatModel.findOne({ userId: generatedUser._id.toString() });
      const isUserMessageAdded = conversations.some(
        (con) => con.message === message && con.type === ConversationEnum.USER,
      );
      const isBotMessageAdded = conversations.some(
        (con) => con.message === body.response && con.type === ConversationEnum.BOT,
      );

      expect(isUserMessageAdded).toBe(true);
      expect(isBotMessageAdded).toBe(true);
      expect(body.response).not.toBeNull();
    });
  });
});
