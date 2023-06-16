import { InitController } from '@app/chat-api/init/init.controller';
import { InitService } from '@app/chat-api/init/init.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Init Controller', () => {
  let appController: InitController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InitController],
      providers: [InitService],
    }).compile();

    appController = app.get<InitController>(InitController);
  });

  describe('Hello World', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
