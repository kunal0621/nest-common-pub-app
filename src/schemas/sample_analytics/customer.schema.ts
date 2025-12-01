import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const CUSTOMER_MODEL_NAME = 'Customer';

@Schema({ _id: false })
class TierDetail {
  @Prop()
  tier?: string;

  @Prop({ type: [String], default: [] })
  benefits?: string[];

  @Prop()
  active?: boolean;

  @Prop()
  id?: string;
}

const TierDetailSchema = SchemaFactory.createForClass(TierDetail);

@Schema({ collection: 'customers' })
export class Customer {
  @Prop({ required: true, unique: true, alias: 'customerUsername' })
  username: string;

  @Prop({ required: true, alias: 'customerName' })
  name: string;

  @Prop({ alias: 'customerAddress' })
  address?: string;

  @Prop({ alias: 'customerBirthdate' })
  birthdate?: Date;

  @Prop({ required: true, unique: true, alias: 'customerEmail' })
  email: string;

  @Prop({ type: [Number], default: [], alias: 'customerAccounts' })
  accounts: number[];

  @Prop({ type: Map, of: TierDetailSchema, default: {}, alias: 'customerTiers' })
  tier_and_details?: Map<string, TierDetail>;
}

export type CustomerDocument = Customer & Document;

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Create indexes for faster lookups
CustomerSchema.index({ username: 1 }, { unique: true });
CustomerSchema.index({ email: 1 }, { unique: true });

