import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema({ collection: 'comments' })
export class Comment {
    @Prop({alias: 'authorName'})
    name: string;

    @Prop({alias: 'authorEmail'})
    email: string;

    @Prop({alias: 'movieId'})
    movie_id: string;

    @Prop({alias: 'commentText'})
    text: string;

    @Prop({alias: 'commentDate'})
    date: Date;
}

export type CommentDocument = Comment & Document;
export const COMMENT_MODEL_NAME = 'Comment';

export const CommentSchema = SchemaFactory.createForClass(Comment);