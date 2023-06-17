import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

/**
 * Function allows to generate the user's data that match to User entity
 * @param {any} [overrides] - Indicates the user data that can be overridden
 * @return {UserEntity} - The returned user's data
 */
export const userFactoryStub = (overrides?: any): UserEntity => {
  return {
    _id: new ObjectId(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    password: faker.internet.password(),
    token: { token: faker.lorem.words(), expiresAt: faker.date.recent() },
    ...overrides,
  };
};
