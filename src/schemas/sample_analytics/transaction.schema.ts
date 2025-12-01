import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const TRANSACTION_MODEL_NAME = 'Transaction';

@Schema({ _id: false })
class TransactionItem {
  @Prop()
  date?: Date;

  @Prop()
  amount?: number;

  @Prop({ alias: 'transactionCode' })
  transaction_code?: string;

  @Prop()
  symbol?: string;

  @Prop()
  price?: string;

  @Prop()
  total?: string;
}

const TransactionItemSchema = SchemaFactory.createForClass(TransactionItem);

@Schema({ collection: 'transactions' })
export class Transaction {
  @Prop({ required: true, index: true, alias: 'accountId' })
  account_id: number;

  @Prop({ alias: 'transactionCount' })
  transaction_count?: number;

  @Prop({ alias: 'bucketStartDate' })
  bucket_start_date?: Date;

  @Prop({ alias: 'bucketEndDate' })
  bucket_end_date?: Date;

  @Prop({ type: [TransactionItemSchema], default: [], alias: 'transactions' })
  transactions: TransactionItem[];
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Create an index on account_id for faster lookups
TransactionSchema.index({ account_id: 1 });
