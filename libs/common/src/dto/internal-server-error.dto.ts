import { ApiProperty } from '@nestjs/swagger';

export default class InternalServerErrorDto {
  @ApiProperty({ description: 'HTTP Status Code', example: 500 })
  statusCode: number;

  @ApiProperty({
    description: 'HTTP Error description',
    example: 'Internal Server Error',
  })
  error: string;

  @ApiProperty({
    description: 'Detailed error message',
    example: 'Database connection error',
  })
  message: string;
}
