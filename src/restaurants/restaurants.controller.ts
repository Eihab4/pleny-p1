import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RESTAURANT_MESSAGES } from '../common/constants/restaurant-messages';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateRestaurantRequest } from './dto/requests/create-restaurant.request';
import { RestaurantResponse } from './dto/responses/restaurant.response';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a restaurant' })
  @ResponseMessage(RESTAURANT_MESSAGES.CREATED)
  async create(@Body() dto: CreateRestaurantRequest) {
    const restaurant = await this.restaurantsService.create(dto);
    return RestaurantResponse.fromEntity(restaurant);
  }
}
