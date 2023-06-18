import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';
import { ChatService } from '@app/chat-api/modules/chat/chat.service';
import { ChatDto } from '@app/chat-api/modules/chat/dtos/chat.dto';
import { ChatResponseDto } from '@app/chat-api/modules/chat/dtos/chat-response.dto';
import { ChatEntity } from '@app/chat-api/modules/chat/schema/chat.schema';
import { JwtAuthGuard } from '@app/chat-api/modules/core/auth/strategies/jwt.strategy';
import { AuthCreateEndpoint } from '@app/common/decorators/auth-create-endpoint.decorator';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @AuthCreateEndpoint(
    'Endpoint allows user to send their message and receive the response from LLMs',
    ChatDto,
    ChatResponseDto,
    ChatEntity,
  )
  public async chat(@Request() req, @Body() body: ChatDto): Promise<ChatResponseDto> {
    const {
      user: { user },
    } = req;

    // Send the user's message to LLMs and receive the response
    const response = await this.chatService.getMessageResponse(body);

    // Add the current conversations to the chat history
    await this.chatService.storeChatHistory({
      userId: user,
      conversations: [
        { message: body.message, type: ConversationEnum.USER },
        { message: response, type: ConversationEnum.BOT },
      ],
    });

    return { response };
  }
}
