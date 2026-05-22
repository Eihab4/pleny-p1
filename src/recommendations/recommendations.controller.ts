import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RECOMMENDATION_MESSAGES } from '../common/constants/recommendation-messages';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Controller('users/:userId/recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Recommend restaurants based on users with shared cuisines',
  })
  @ResponseMessage(RECOMMENDATION_MESSAGES.GENERATED)
  getForUser(@Param('userId') userId: string) {
    return this.recommendationsService.getForUser(userId);
  }
}
