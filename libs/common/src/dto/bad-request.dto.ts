import { ApiProperty } from '@nestjs/swagger';

export default class BadRequestDto {
  @ApiProperty({ description: 'HTTP Status Code', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: 'HTTP Error description',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Invalid body errors',
    type: [String],
    example: ['Property 1 should be a integer', 'Property 2 should not be empty.'],
  })
  message: string[];
}
