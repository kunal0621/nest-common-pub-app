import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const THEATER_MODEL_NAME = 'Theater';

@Schema({ _id: false })
class Address {
  @Prop({alias: 'addressDetailStreet1' })
  street1?: string;

  @Prop({alias: 'addressDetailStreet2' })
  street2?: string;

  @Prop({alias: 'addressDetailCity' })
  city?: string;

  @Prop({alias: 'addressDetailState' })
  state?: string;

  @Prop({alias: 'addressDetailZipcode' })
  zipcode?: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ _id: false })
class Geo {
  @Prop({ default: 'Point', alias: 'geoType' })
  type?: string;

  @Prop({ type: [Number], alias: 'geoCoordinates' })
  coordinates?: number[];
}

const GeoSchema = SchemaFactory.createForClass(Geo);

@Schema({ _id: false })
class Location {
  @Prop({ type: AddressSchema })
  address?: Address;

  @Prop({ type: GeoSchema })
  geo?: Geo;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ collection: 'theaters' })
export class Theater {
  @Prop()
  theaterId: number;

  @Prop({ type: LocationSchema })
  location: Location;
}

export type TheaterDocument = Theater & Document;

export const TheaterSchema = SchemaFactory.createForClass(Theater);  
