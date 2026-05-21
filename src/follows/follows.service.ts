import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, isValidObjectId } from 'mongoose';
import { FOLLOW_MESSAGES } from '../common/constants/follow-messages';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../users/schemas/user.schema';
import { Follow } from './schemas/follow.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<Follow>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async follow(userId: string, restaurantId: string): Promise<void> {
    await this.ensureUserExists(userId);
    await this.ensureRestaurantExists(restaurantId);

    try {
      await this.followModel.create({ userId, restaurantId });
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException(FOLLOW_MESSAGES.ALREADY_FOLLOWING);
      }
      throw err;
    }
  }

  async unfollow(userId: string, restaurantId: string): Promise<void> {
    const deleted = await this.followModel.findOneAndDelete({
      userId,
      restaurantId,
    });

    if (!deleted) {
      throw new NotFoundException(FOLLOW_MESSAGES.NOT_FOLLOWING);
    }
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const exists =
      isValidObjectId(userId) && (await this.userModel.exists({ _id: userId }));
    if (!exists) {
      throw new NotFoundException(FOLLOW_MESSAGES.USER_NOT_FOUND);
    }
  }

  private async ensureRestaurantExists(restaurantId: string): Promise<void> {
    const exists =
      isValidObjectId(restaurantId) &&
      (await this.restaurantModel.exists({ _id: restaurantId }));
    if (!exists) {
      throw new NotFoundException(FOLLOW_MESSAGES.RESTAURANT_NOT_FOUND);
    }
  }
}
