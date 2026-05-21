import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { RestaurantResponse } from './restaurant.response';

export interface RestaurantWithDistance {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  slug: string;
  cuisines: string[];
  location: { type: string; coordinates: [number, number] };
  distanceInMeters: number;
}

export class NearbyRestaurantResponse extends RestaurantResponse {
  @ApiProperty()
  distanceInMeters: number;

  static fromAggregate(doc: RestaurantWithDistance): NearbyRestaurantResponse {
    const res = new NearbyRestaurantResponse();
    res.id = doc._id.toString();
    res.nameAr = doc.nameAr;
    res.nameEn = doc.nameEn;
    res.slug = doc.slug;
    res.cuisines = doc.cuisines;
    res.location = {
      type: doc.location.type,
      coordinates: doc.location.coordinates,
    };
    res.distanceInMeters = Math.round(doc.distanceInMeters);
    return res;
  }
}
