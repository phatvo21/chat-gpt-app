import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

import BadRequestDto from '../dto/bad-request.dto';
import InternalServerErrorDto from '../dto/internal-server-error.dto';

export const CreateEndpoint = (
  summary: string,
  inputDto: Type<any>,
  outputDto: Type<any>,
  entityType: Type<any>,
  isArray = false,
) =>
  applyDecorators(
    ApiOperation({ summary }),
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
