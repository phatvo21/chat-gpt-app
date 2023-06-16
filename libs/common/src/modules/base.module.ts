import { HealthController } from '@app/common/controllers/health.controller';
import { BaseConfigModule } from '@app/common/modules/base-config.module';
import { BaseDatabaseModule } from '@app/common/modules/base-database.module';
import { BaseLoggerModule } from '@app/common/modules/base-logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [BaseConfigModule, BaseLoggerModule, BaseDatabaseModule],
  controllers: [HealthController],
})
export class BaseModule {}
