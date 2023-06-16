import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const httpExceptionStatus = exception.getStatus();
      const httpExceptionResponse = exception.getResponse() as any;

      this.logger.error(
        { httpError: httpExceptionResponse.error, errorMessage: httpExceptionResponse.message },
        exception.stack,
      );

      return response.status(httpExceptionStatus).send({
        success: false,
        data: [],
        status: httpExceptionStatus,
        message: httpExceptionResponse.message,
        error: httpExceptionResponse.error,
      });
    }

    this.logger.error(exception.message, exception.stack);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      data: [],
      error: 'Internal Server Error',
      message: 'Sorry we are experiencing technical problems.',
    });
  }
}
