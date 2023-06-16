import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

export class BaseEntity {
  @Prop({ type: String, default: new ObjectId() })
  _id: ObjectId;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}
