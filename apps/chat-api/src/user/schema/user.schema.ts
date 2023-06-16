import { BaseEntity } from '@app/common/schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

export class Token {
  @Prop({ required: true })
  public token: string;

  @Prop({ required: true })
  public expiresAt: Date;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserEntity extends BaseEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Type(() => Token)
  @Prop({ type: Token, _id: false, hide: true })
  token?: Token;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
