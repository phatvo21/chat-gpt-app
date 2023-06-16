import { Prop } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export class BaseEntity {
  @Prop({ type: String, default: () => nanoid() })
  _id: string;

  createdAt: Date;

  updatedAt: Date;
}
