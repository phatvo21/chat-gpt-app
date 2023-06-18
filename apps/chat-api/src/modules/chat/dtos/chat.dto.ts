import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hello! How are you today?' })
  message: string;
}
