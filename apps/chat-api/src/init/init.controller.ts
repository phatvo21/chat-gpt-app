import { GetEndpoint } from '@app/common/decorators/get-endpoint.decorator';
import { Controller, Get } from '@nestjs/common';

import { InitDto } from './dtos/init.dto';
import { InitService } from './init.service';

@Controller('hello-world')
export class InitController {
  constructor(private readonly appService: InitService) {}

  @Get()
  @GetEndpoint('Endpoint allow to fetch hello-world', InitDto, InitDto)
  getHello(): string {
    return this.appService.getHello();
  }
}
