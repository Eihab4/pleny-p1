import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model } from 'mongoose';
import { RESTAURANT_MESSAGES } from '../common/constants/restaurant-messages';
import { PaginatedResponse } from '../common/dto/responses/paginated.response';
import { CreateRestaurantRequest } from './dto/requests/create-restaurant.request';
import { ListRestaurantsRequest } from './dto/requests/list-restaurants.request';
import { RestaurantResponse } from './dto/responses/restaurant.response';
import { Restaurant } from './schemas/restaurant.schema';
import slugify from 'slugify';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(dto: CreateRestaurantRequest): Promise<RestaurantResponse> {
    const slug = slugify(dto.nameEn, { lower: true, strict: true });

    try {
      const created = await this.restaurantModel.create({ ...dto, slug });
      return RestaurantResponse.fromEntity(created);
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException(RESTAURANT_MESSAGES.SLUG_TAKEN(slug));
      }
      throw err;
    }
  }

  async findAll(
    query: ListRestaurantsRequest,
  ): Promise<PaginatedResponse<RestaurantResponse>> {
    const { cuisine, page, limit } = query;
    const filter = cuisine ? { cuisines: cuisine } : {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.restaurantModel.find(filter).skip(skip).limit(limit).exec(),
      this.restaurantModel.countDocuments(filter),
    ]);

    return new PaginatedResponse(
      items.map((doc) => RestaurantResponse.fromEntity(doc)),
      total,
      page,
      limit,
    );
  }
}
