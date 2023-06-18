import { ChatController } from '@app/chat-api/modules/chat/chat.controller';
import { ChatService } from '@app/chat-api/modules/chat/chat.service';
import { ChatRepository } from '@app/chat-api/modules/chat/repository/chat.repository';
import { ChatEntity, ChatSchema } from '@app/chat-api/modules/chat/schema/chat.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const PROVIDER_AND_EXPORT_MODULES = [
  {
    provide: 'ChatRepositoryInterface',
    useClass: ChatRepository,
  },
  ChatService,
];

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatEntity.name, schema: ChatSchema }])],
  controllers: [ChatController],
  providers: [...PROVIDER_AND_EXPORT_MODULES],
  exports: [...PROVIDER_AND_EXPORT_MODULES],
})
export class ChatModule {}
