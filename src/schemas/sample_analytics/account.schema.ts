import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const ACCOUNT_MODEL_NAME = 'Account';

@Schema({ collection: 'accounts' })
export class Account {
  @Prop({ required: true, unique: true })
  account_id: number;

  @Prop({ required: true })
  limit: number;

  @Prop({ type: [String], default: [] })
  products: string[];
}

export type AccountDocument = Account & Document;

export const AccountSchema = SchemaFactory.createForClass(Account);

// Create an index on account_id for faster lookups
AccountSchema.index({ account_id: 1 }, { unique: true });
