import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocKeyMap } from '../decorators';

class AddressDto {
  @IsString()
  @IsOptional()
  @DocKeyMap('addressDetailStreet1')
  street1?: string;

  @IsString()
  @IsOptional()
  @DocKeyMap('addressDetailStreet2')
  street2?: string;

  @IsString()
  @IsOptional()
  @DocKeyMap('addressDetailCity')
  city?: string;

  @IsString()
  @IsOptional()
  @DocKeyMap('addressDetailState')
  state?: string;

  @IsString()
  @IsOptional()
  @DocKeyMap('addressDetailZipcode')
  zipcode?: string;
}

class GeoDto {
  @IsString()
  @IsOptional()
  @DocKeyMap('geoType')
  type?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @DocKeyMap('geoCoordinates')
  coordinates: number[];
}

class LocationDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto;
}

export class TheaterCreateDto {
  @IsInt()
  @DocKeyMap('theaterId')
  theaterId: number;

  @ValidateNested()
  @Type(() => LocationDto)
  @DocKeyMap('location')
  location: LocationDto;
}
