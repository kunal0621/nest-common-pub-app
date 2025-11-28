import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const USER_MODEL_NAME = 'User';

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, alias: 'fullName' })
  name: string;

  @Prop({ required: true, unique: true, alias: 'emailAddress' })
  email: string;

  @Prop({ required: true, alias: 'passwordHash' })
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
