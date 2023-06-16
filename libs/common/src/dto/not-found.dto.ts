import { ApiProperty } from '@nestjs/swagger';

export default class NotFoundDto {
  @ApiProperty({ description: 'HTTP Status Code', example: 404 })
  statusCode: number;

  @ApiProperty({
    description: 'HTTP Error description',
    example: 'Not Found',
  })
  error: string;

  @ApiProperty({
    description: 'Detailed error message',
    example: 'Entity 1 not found',
  })
  message: string;
}
