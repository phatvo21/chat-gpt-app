import { ConversationEnum } from '@app/chat-api/consts/conversation.enum';
import { BaseEntity } from '@app/common/schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<ChatEntity>;

export class Conversation {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ConversationEnum })
  type: ConversationEnum;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

@Schema({
  collection: 'chatHistories',
  timestamps: true,
})
export class ChatEntity extends BaseEntity {
  @Prop({ required: true, unique: true })
  userId: ObjectId;

  @Type(() => Conversation)
  @Prop({ type: Conversation, _id: false, default: [] })
  conversations: Conversation[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatEntity);
