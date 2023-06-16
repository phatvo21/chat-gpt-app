import { BaseEntity } from '@app/common/schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<ChatEntity>;

export class Conversation {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  response: string;
}

@Schema({
  collection: 'chatHistories',
  timestamps: true,
})
export class ChatEntity extends BaseEntity {
  @Prop({ required: true, unique: true })
  userId: ObjectId;

  @Type(() => Conversation)
  @Prop({ type: Conversation, _id: false, hide: true })
  conversations?: Conversation[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatEntity);
