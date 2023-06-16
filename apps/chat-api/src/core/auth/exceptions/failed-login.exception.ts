import { HttpException } from '@nestjs/common';

export class FailedLoginException extends HttpException {
  constructor() {
    super('Invalid credentials', 401);
  }
}
