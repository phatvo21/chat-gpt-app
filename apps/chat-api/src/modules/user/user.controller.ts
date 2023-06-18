import { ChatEntity } from '@app/chat-api/modules/chat/schema/chat.schema';
import { JwtAuthGuard } from '@app/chat-api/modules/core/auth/strategies/jwt.strategy';
import { ChatHistoryDto } from '@app/chat-api/modules/user/dtos/chat-history.dto';
import { ChatHistoryOutputDto } from '@app/chat-api/modules/user/dtos/chat-history.output.dto';
import { UserService } from '@app/chat-api/modules/user/userService';
import { AuthGetEndpoint } from '@app/common/decorators/auth-get-endpoint.decorator';
import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('chat-history')
  @AuthGetEndpoint('Endpoint allows user to get their chat history', ChatHistoryOutputDto, ChatEntity)
  public getChatHistory(@Request() req, @Query() query: ChatHistoryDto): Promise<ChatHistoryOutputDto> {
    const {
      user: { user },
    } = req;

    return this.userService.getChatHistory({ userId: user, page: query?.page, size: query?.size });
  }
}
