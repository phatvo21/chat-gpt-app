import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import InternalServerErrorDto from '../dto/internal-server-error.dto';
import NotFoundDTO from '../dto/not-found.dto';

export const DeleteEndpoint = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: 'Deleted successfully',
    }),
    ApiInternalServerErrorResponse({
      description: 'Server Internal Error',
      type: InternalServerErrorDto,
    }),
    ApiNotFoundResponse({
      description: 'Entity not found',
      type: NotFoundDTO,
    }),
    ApiParam({ name: 'id', type: String, example: 'b01144e1-b74e-465a-a406-c62fc60f4550' }),
  );
