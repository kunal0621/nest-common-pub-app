import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsUrl,
  IsDate,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocKeyMap } from '../decorators';

// ********************************START*******************************************
// Here are the nested DTOs used in MovieDto and MovieCreateDto
class ImdbDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  @DocKeyMap('imdbRating')
  rating: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('imdbVotes')
  votes: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('imdbID')
  id: number;
}

class AwardsDto {
  @IsInt()
  @Min(0)
  @DocKeyMap('wins')
  wins: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('nominations')
  nominations: number;

  @IsString()
  @DocKeyMap('text')
  text: string;
}

class TomatoesViewerDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  @DocKeyMap('viewerRating')
  rating: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('viewerNumReviews')
  numReviews: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @DocKeyMap('viewerMeter')
  meter: number;
}

class TomatoesCriticDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  @DocKeyMap('criticRating')
  rating: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('criticNumReviews')
  numReviews: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @DocKeyMap('criticMeter')
  meter: number;
}

class TomatoesDto {
  @ValidateNested()
  @Type(() => TomatoesViewerDto)
  viewer: TomatoesViewerDto;

  @IsDate()
  @Type(() => Date)
  @DocKeyMap('dvd')
  dvd: Date;

  @ValidateNested()
  @Type(() => TomatoesCriticDto)
  critic: TomatoesCriticDto;

  @IsDate()
  @Type(() => Date)
  @DocKeyMap('lastUpdated')
  lastUpdated: Date;

  @IsString()
  @DocKeyMap('consensus')
  consensus: string;

  @IsInt()
  @Min(0)
  @DocKeyMap('rotten')
  rotten: number;

  @IsString()
  @DocKeyMap('production')
  production: string;

  @IsInt()
  @Min(0)
  @DocKeyMap('fresh')
  fresh: number;
}

export class MovieDto {
  @IsMongoId()
  @IsOptional()
  @DocKeyMap('_id')
  _id?: string;

  @IsString()
  @DocKeyMap('plot')
  plot: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('genres')
  genres: string[];

  @IsInt()
  @Min(0)
  @DocKeyMap('runtime')
  runtime: number;

  @IsString()
  @DocKeyMap('rated')
  rated: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('cast')
  cast: string[];

  @IsInt()
  @Min(0)
  @DocKeyMap('commentsCount')
  num_mflix_comments: number;

  @IsUrl()
  @DocKeyMap('poster')
  poster: string;

  @IsString()
  @DocKeyMap('title')
  title: string;

  @IsString()
  @DocKeyMap('fullplot')
  fullplot: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('languages')
  languages: string[];

  @IsDate()
  @Type(() => Date)
  @DocKeyMap('released')
  released: Date;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('directors')
  directors: string[];

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('writers')
  writers: string[];

  @ValidateNested()
  @Type(() => AwardsDto)
  awards: AwardsDto;

  @IsString()
  @DocKeyMap('lastupdated')
  lastupdated: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @DocKeyMap('year')
  year: number;

  @ValidateNested()
  @Type(() => ImdbDto)
  imdb: ImdbDto;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('countries')
  countries: string[];

  @IsString()
  @DocKeyMap('type')
  @IsOptional()
  type?: string;

  @ValidateNested()
  @Type(() => TomatoesDto)
  tomatoes: TomatoesDto;
}

// ********************************END*********************************************

/**
 * DTOs for Movie entity
 * Includes nested DTOs for structured fields
 * Uses class-validator for validation and class-transformer for type transformation
 * DocKeyMap decorator maps DTO properties to document keys
 * Supports creation and retrieval of Movie data
 * Handles optional and required fields appropriately
 * Ensures data integrity with validation rules
 * Facilitates easy data transfer between layers
 * Supports complex nested structures
 * Enhances maintainability and readability of code
 * Enables seamless integration with other application components
 * MovieCreateDto is used for creating new movie entries
 * MovieDto is used for retrieving movie data
 * Both DTOs ensure consistent data formats
 * other nested DTOs represent sub-documents within the Movie entity
 */
export class MovieCreateDto {
  @IsString()
  @DocKeyMap('plot')
  plot: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('genres')
  genres: string[];

  @IsInt()
  @Min(0)
  @DocKeyMap('runtime')
  runtime: number;

  @IsString()
  @DocKeyMap('rated')
  rated: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('cast')
  cast: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  @DocKeyMap('commentsCount')
  num_mflix_comments?: number;

  @IsUrl()
  @DocKeyMap('poster')
  poster: string;

  @IsString()
  @DocKeyMap('title')
  title: string;

  @IsString()
  @DocKeyMap('fullplot')
  fullplot: string;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('languages')
  languages: string[];

  @IsDate()
  @Type(() => Date)
  @DocKeyMap('released')
  released: Date;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('directors')
  directors: string[];

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('writers')
  writers: string[];

  @ValidateNested()
  @Type(() => AwardsDto)
  awards: AwardsDto;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @DocKeyMap('year')
  year: number;

  @ValidateNested()
  @Type(() => ImdbDto)
  imdb: ImdbDto;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('countries')
  countries: string[];

  @IsString()
  @IsOptional()
  @DocKeyMap('type')
  type?: string;

  @ValidateNested()
  @Type(() => TomatoesDto)
  tomatoes: TomatoesDto;
}
