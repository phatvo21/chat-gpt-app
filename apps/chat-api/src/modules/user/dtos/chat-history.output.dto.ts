import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class Conversation {
  @IsEnum(ConversationEnum)
  type: ConversationEnum;

  @IsString()
  message: string;
}

export class ChatHistoryOutputDto {
  @ApiProperty({
    example: [
      {
        type: ConversationEnum.USER,
        message: 'Hello there!',
      },
      {
        type: ConversationEnum.BOT,
        message: 'Hi there!',
      },
    ],
  })
  @Type(() => Conversation)
  data: Conversation[];

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    example: null,
  })
  lastPage: number | null;

  @ApiProperty({
    example: null,
  })
  nextPage: number | null;

  @ApiProperty({
    example: null,
  })
  prevPage: number | null;
}
