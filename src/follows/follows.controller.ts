import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FOLLOW_MESSAGES } from '../common/constants/follow-messages';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { FollowsService } from './follows.service';

@ApiTags('Follows')
@Controller('users/:userId/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':restaurantId')
  @ApiOperation({ summary: 'Follow a restaurant' })
  @ResponseMessage(FOLLOW_MESSAGES.FOLLOWED)
  follow(
    @Param('userId') userId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.followsService.follow(userId, restaurantId);
  }

  @Delete(':restaurantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unfollow a restaurant' })
  @ResponseMessage(FOLLOW_MESSAGES.UNFOLLOWED)
  unfollow(
    @Param('userId') userId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.followsService.unfollow(userId, restaurantId);
  }
}
