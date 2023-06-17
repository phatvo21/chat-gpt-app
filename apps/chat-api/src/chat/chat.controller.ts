import { ChatService } from '@app/chat-api/chat/chat.service';
import { ChatDto } from '@app/chat-api/chat/dtos/chat.dto';
import { ChatResponseDto } from '@app/chat-api/chat/dtos/chat-response.dto';
import { ChatEntity } from '@app/chat-api/chat/schema/chat.schema';
import { JwtAuthGuard } from '@app/chat-api/core/auth/strategies/jwt.strategy';
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

    // Send the user's message to LLMs
    const response = await this.chatService.getMessageResponse(body);

    // Add the current conversation to chat history
    await this.chatService.storeChatHistory({
      userId: user,
      conversation: { message: body.message, response },
    });

    return { response };
  }
}
