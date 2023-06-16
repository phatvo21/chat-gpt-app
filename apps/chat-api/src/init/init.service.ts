import { Injectable } from '@nestjs/common';

@Injectable()
export class InitService {
  public getHello(): string {
    return 'Hello World!';
  }
}
