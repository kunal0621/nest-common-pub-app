import { IsString, IsMongoId, IsDate } from "class-validator";
import { DocKeyMap } from "../decorators";
import { Date } from "mongoose";

export class CommentCreateDto {
    @IsString()
    @DocKeyMap('authorName')
    name: string

    @IsString()
    @DocKeyMap('authorEmail')
    email: string

    @IsMongoId()
    @DocKeyMap('movieId')
    movieId: string

    @IsString()
    @DocKeyMap('commentText')
    text: string

    @IsDate()
    @DocKeyMap('commentDate')
    date: Date
}