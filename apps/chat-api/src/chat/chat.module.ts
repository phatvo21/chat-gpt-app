import { ChatRepository } from '@app/chat-api/chat/repository/chat.repository';
import { ChatEntity, ChatSchema } from '@app/chat-api/chat/schema/chat.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatEntity.name, schema: ChatSchema }])],
  controllers: [],
  providers: [
    {
      provide: 'ChatRepositoryInterface',
      useClass: ChatRepository,
    },
  ],
  exports: [MongooseModule.forFeature([{ name: ChatEntity.name, schema: ChatSchema }])],
})
export class ChatModule {}
