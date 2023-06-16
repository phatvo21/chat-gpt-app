import { UserRepository } from '@app/chat-api/user/repository/user.repository';
import { UserService } from '@app/chat-api/user/userService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { userFactoryStub } from '../../factory/stubs/user.stub';

describe('Auth Service', () => {
  let userService: UserService;
  let userRepo: UserRepository;
  const response = {
    token: faker.lorem.word(),
    refreshToken: faker.lorem.word(),
  };
  const user = userFactoryStub();

  beforeEach(async () => {
    const UserRepositoryProvider = {
      provide: UserRepository,
      useFactory: () => ({
        create: jest.fn(() => {
          return user;
        }),
        findOneByToken: jest.fn(() => {
          return user;
        }),
        setToken: jest.fn(() => {
          return user;
        }),
        get: jest.fn(() => {
          return user;
        }),
        findByEmail: jest.fn(() => {
          return user;
        }),
        update: jest.fn(() => {
          return user;
        }),
        findById: jest.fn(() => {
          return user;
        }),
        findOne: jest.fn(() => {
          return user;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, UserRepositoryProvider],
    }).compile();

    userRepo = app.get<UserRepository>(UserRepository);
    userService = new UserService(userRepo);
  });

  it('should set the token for a given user', async () => {
    const userUpdated = await userService.setToken({
      userId: user._id.toString(),
      token: response.refreshToken,
      expiresAt: faker.date.recent(),
    });

    expect(userRepo.update).toHaveBeenCalledTimes(1);
    expect(userUpdated.token.token).toBe(user.token.token);
  });

  it('should fetch a user by token', async () => {
    const result = await userService.findOneByToken(user.token.token);

    expect(result.token.token).toBe(user.token.token);
    expect(userRepo.findOneByToken).toHaveBeenCalledTimes(1);
    expect(result._id.toString()).toBe(user._id.toString());
  });

  it('should get a user by given ID', async () => {
    const result = await userService.get(user._id.toString());

    expect(result.token.token).toBe(user.token.token);
    expect(userRepo.findById).toHaveBeenCalledTimes(1);
    expect(result._id.toString()).toBe(user._id.toString());
  });

  it('should get a user by given email', async () => {
    const result = await userService.findByEmail(user.email);

    expect(userRepo.findOne).toHaveBeenCalledTimes(1);
    expect(result.token.token).toBe(user.token.token);
    expect(result._id.toString()).toBe(user._id.toString());
  });

  it('should create user by given user data', async () => {
    const result = await userService.create(user);

    expect(userRepo.create).toHaveBeenCalledTimes(1);
    expect(result.token.token).toBe(user.token.token);
    expect(result._id.toString()).toBe(user._id.toString());
  });
});
