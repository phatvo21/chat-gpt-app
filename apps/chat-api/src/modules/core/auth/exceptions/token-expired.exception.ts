import { HttpException } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token Expired', 401);
  }
}
