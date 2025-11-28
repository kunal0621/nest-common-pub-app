import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Imdb {
  @Prop({ alias: 'imdbRating' })
  rating?: number;

  @Prop({ alias: 'imdbVotes' })
  votes?: number;

  @Prop({ alias: 'imdbID' })
  id?: number;
}

export const ImdbSchema = SchemaFactory.createForClass(Imdb);

@Schema({ _id: false })
export class Awards {
  @Prop()
  wins?: number;

  @Prop()
  nominations?: number;

  @Prop()
  text?: string;
}

export const AwardsSchema = SchemaFactory.createForClass(Awards);

@Schema({ _id: false })
export class TomatoesViewer {
  @Prop({ alias: 'viewerRating' })
  rating?: number;

  @Prop({ alias: 'viewerNumReviews' })
  numReviews?: number;

  @Prop({ alias: 'viewerMeter' })
  meter?: number;
}

export const TomatoesViewerSchema =
  SchemaFactory.createForClass(TomatoesViewer);

@Schema({ _id: false })
export class TomatoesCritic {
  @Prop({ alias: 'criticRating' })
  rating?: number;

  @Prop({ alias: 'criticNumReviews' })
  numReviews?: number;

  @Prop({ alias: 'criticMeter' })
  meter?: number;
}

export const TomatoesCriticSchema =
  SchemaFactory.createForClass(TomatoesCritic);

@Schema({ _id: false })
export class Tomatoes {
  @Prop({ type: TomatoesViewerSchema })
  viewer?: TomatoesViewer;

  @Prop()
  dvd?: Date;

  @Prop({ type: TomatoesCriticSchema })
  critic?: TomatoesCritic;

  @Prop()
  lastUpdated?: Date;

  @Prop()
  consensus?: string;

  @Prop()
  rotten?: number;

  @Prop()
  production?: string;

  @Prop()
  fresh?: number;
}

export const TomatoesSchema = SchemaFactory.createForClass(Tomatoes);

@Schema({ collection: 'movies' })
export class Movie {
  @Prop({ required: true })
  plot: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop()
  runtime?: number;

  @Prop()
  rated?: string;

  @Prop({ type: [String], default: [] })
  cast: string[];

  @Prop({ alias: 'commentsCount' })
  num_mflix_comments?: number;

  @Prop()
  poster?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  fullplot?: string;

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop()
  released?: Date;

  @Prop({ type: [String], default: [] })
  directors: string[];

  @Prop({ type: [String], default: [] })
  writers: string[];

  @Prop({ type: AwardsSchema })
  awards?: Awards;

  @Prop()
  lastupdated?: string;

  @Prop()
  year?: number;

  @Prop({ type: ImdbSchema })
  imdb?: Imdb;

  @Prop({ type: [String], default: [] })
  countries: string[];

  @Prop()
  type?: string;

  @Prop({ type: TomatoesSchema })
  tomatoes?: Tomatoes;
}

export type MovieDocument = Movie & Document;
export const MOVIE_MODEL_NAME = 'Movie';

export const MovieSchema = SchemaFactory.createForClass(Movie);
