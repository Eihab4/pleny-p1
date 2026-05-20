import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ _id: false })
class Location {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type!: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates!: [number, number];
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true, trim: true })
  nameAr!: string;

  @Prop({ required: true, trim: true })
  nameEn!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ type: [String], required: true })
  cuisines!: string[];

  @Prop({ type: LocationSchema, required: true })
  location!: Location;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ location: '2dsphere' });
