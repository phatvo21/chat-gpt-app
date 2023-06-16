import { HealthController } from '@app/common/controllers/health.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should return "OK"', async () => {
    const result = await healthController.healthCheck();
    expect(result.status).toBe('OK');
  });
});
