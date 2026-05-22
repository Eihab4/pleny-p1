import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { RestaurantResponse } from '../../../restaurants/dto/responses/restaurant.response';
import { UserResponse } from '../../../users/dtos/response/user.response';

interface SimilarUserRaw {
  _id: Types.ObjectId;
  fullName: string;
  favoriteCuisines: string[];
}

interface RecommendedRestaurantRaw {
  _id: Types.ObjectId;
  nameAr: string;
  nameEn: string;
  slug: string;
  cuisines: string[];
  location: { type: string; coordinates: [number, number] };
}

export interface RecommendationFacet {
  similarUsers: SimilarUserRaw[];
  recommendedRestaurants: RecommendedRestaurantRaw[];
}

export class RecommendationsResponse {
  @ApiProperty({ type: [UserResponse] })
  similarUsers: UserResponse[];

  @ApiProperty({ type: [RestaurantResponse] })
  recommendedRestaurants: RestaurantResponse[];

  static fromFacet(facet: RecommendationFacet): RecommendationsResponse {
    const res = new RecommendationsResponse();

    res.similarUsers = facet.similarUsers.map((user) => {
      const mapped = new UserResponse();
      mapped.id = user._id.toString();
      mapped.fullName = user.fullName;
      mapped.favoriteCuisines = user.favoriteCuisines;
      return mapped;
    });

    res.recommendedRestaurants = facet.recommendedRestaurants.map(
      (restaurant) => {
        const mapped = new RestaurantResponse();
        mapped.id = restaurant._id.toString();
        mapped.nameAr = restaurant.nameAr;
        mapped.nameEn = restaurant.nameEn;
        mapped.slug = restaurant.slug;
        mapped.cuisines = restaurant.cuisines;
        mapped.location = {
          type: restaurant.location.type,
          coordinates: restaurant.location.coordinates,
        };
        return mapped;
      },
    );

    return res;
  }
}
