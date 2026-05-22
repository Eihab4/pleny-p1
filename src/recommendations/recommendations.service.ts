import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { RECOMMENDATION_MESSAGES } from '../common/constants/recommendation-messages';
import { User } from '../users/schemas/user.schema';
import {
  RecommendationFacet,
  RecommendationsResponse,
} from './dtos/response/recommendations.response';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getForUser(userId: string): Promise<RecommendationsResponse> {
    const target =
      isValidObjectId(userId) && (await this.userModel.findById(userId));
    if (!target) {
      throw new NotFoundException(RECOMMENDATION_MESSAGES.USER_NOT_FOUND);
    }

    const [facet] = await this.userModel.aggregate<RecommendationFacet>([
      {
        $match: {
          _id: { $ne: target._id },
          favoriteCuisines: { $in: target.favoriteCuisines },
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'userId',
          as: 'userFollows',
        },
      },
      // two lists from one pass; restaurants deduped by $group
      {
        $facet: {
          similarUsers: [
            { $project: { _id: 1, fullName: 1, favoriteCuisines: 1 } },
          ],
          recommendedRestaurants: [
            { $unwind: '$userFollows' },
            { $group: { _id: '$userFollows.restaurantId' } },
            {
              $lookup: {
                from: 'restaurants',
                localField: '_id',
                foreignField: '_id',
                as: 'restaurant',
              },
            },
            { $unwind: '$restaurant' },
            { $replaceRoot: { newRoot: '$restaurant' } },
          ],
        },
      },
    ]);

    return RecommendationsResponse.fromFacet(facet);
  }
}
