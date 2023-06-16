import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import BadRequestDto from '../dto/bad-request.dto';
import InternalServerErrorDto from '../dto/internal-server-error.dto';

export const ListEndpoint = (summary: string, outputDto: Type<any>, entityType: Type<any>) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: 'List returned successfully',
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
    UseInterceptors(outputDto, entityType),
  );
