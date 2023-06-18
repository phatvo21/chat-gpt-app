import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import BadRequestDto from '../dto/bad-request.dto';
import InternalServerErrorDto from '../dto/internal-server-error.dto';
import NotFoundDTO from '../dto/not-found.dto';

export const AuthGetEndpoint = (summary: string, outputDto: Type<any>, entityType: Type<any>) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiOkResponse({
      description: 'Entity returned successfully',
      type: outputDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid params',
      type: BadRequestDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Server Internal Error',
      type: InternalServerErrorDto,
    }),
    ApiNotFoundResponse({
      description: 'Entity not found',
      type: NotFoundDTO,
    }),
    UseInterceptors(outputDto, entityType),
  );
