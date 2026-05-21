import { ApiProperty } from '@nestjs/swagger';
import { RestaurantDocument } from '../../schemas/restaurant.schema';

export class RestaurantResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameAr: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [String] })
  cuisines: string[];

  @ApiProperty({ example: { type: 'Point', coordinates: [31.235, 30.0444] } })
  location: { type: string; coordinates: [number, number] };

  static fromEntity(doc: RestaurantDocument): RestaurantResponse {
    const res = new RestaurantResponse();
    res.id = doc._id.toString();
    res.nameAr = doc.nameAr;
    res.nameEn = doc.nameEn;
    res.slug = doc.slug;
    res.cuisines = doc.cuisines;
    res.location = {
      type: doc.location.type,
      coordinates: doc.location.coordinates,
    };
    return res;
  }
}
