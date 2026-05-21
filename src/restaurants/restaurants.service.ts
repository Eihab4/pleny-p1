import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model } from 'mongoose';
import { RESTAURANT_MESSAGES } from '../common/constants/restaurant-messages';
import { CreateRestaurantRequest } from './dto/requests/create-restaurant.request';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import slugify from 'slugify';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(dto: CreateRestaurantRequest): Promise<RestaurantDocument> {
    const slug = slugify(dto.nameEn, { lower: true, strict: true });

    try {
      return await this.restaurantModel.create({ ...dto, slug });
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException(RESTAURANT_MESSAGES.SLUG_TAKEN(slug));
      }
      throw err;
    }
  }
}
