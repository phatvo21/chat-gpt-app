import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

import BadRequestDto from '../dto/bad-request.dto';
import InternalServerErrorDto from '../dto/internal-server-error.dto';

export const AuthCreateEndpoint = (
  summary: string,
  inputDto: Type<any>,
  outputDto: Type<any>,
  entityType: Type<any>,
  isArray = false,
) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('Authorization'),
    ApiCreatedResponse({
      description: 'Created successfully',
      type: outputDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid body',
      type: BadRequestDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Server Internal Error',
      type: InternalServerErrorDto,
    }),
    ApiBody({ type: inputDto, isArray }),
    UseInterceptors(outputDto, entityType),
  );
