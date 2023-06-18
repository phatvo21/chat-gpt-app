import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatResponseDto {
  @IsString()
  @ApiProperty({ example: 'Hello! How is it going?' })
  response: string;
}
