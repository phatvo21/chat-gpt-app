import { Prop } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export class BaseEntity {
  @Prop({ type: String, default: () => nanoid() })
  _id: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}
