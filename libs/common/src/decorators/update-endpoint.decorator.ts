import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import BadRequestDto from '../dto/bad-request.dto';
import InternalServerErrorDto from '../dto/internal-server-error.dto';
import NotFoundDTO from '../dto/not-found.dto';

export const UpdateEndpoint = (
  summary: string,
  inputDto?: Type<any>,
  outputDto?: Type<any>,
  entityType?: Type<any>,
) => {
  const decoratorsToApply = [
    ApiOperation({ summary }),
    ApiOkResponse({
      description: 'Updated successfully',
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
    ApiNotFoundResponse({
      description: 'Entity not found',
      type: NotFoundDTO,
    }),
    ApiParam({ name: 'id', type: String, example: '60d0161cba52d105504fae34' }),
  ];

  if (inputDto) {
    decoratorsToApply.push(ApiBody({ type: inputDto }));
  }

  if (outputDto && entityType) {
    decoratorsToApply.push(UseInterceptors(outputDto, entityType));
  }

  return applyDecorators(...decoratorsToApply);
};
