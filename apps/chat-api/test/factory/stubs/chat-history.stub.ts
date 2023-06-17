import { ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

/**
 * Function allows to generate the chat history's data that match to Chat entity
 * @param {any} [overrides] - Indicates the chat history data that can be overridden
 * @return {ChatEntity} - The returned chat history's data
 */
export const chatFactoryStub = (overrides?: any): ChatEntity => {
  return {
    _id: new ObjectId(),
    conversations: [{ message: faker.lorem.word(), response: faker.lorem.word() }],
    ...overrides,
  };
};
