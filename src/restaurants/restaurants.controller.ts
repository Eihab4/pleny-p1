import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RESTAURANT_MESSAGES } from '../common/constants/restaurant-messages';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateRestaurantRequest } from './dto/requests/create-restaurant.request';
import { ListRestaurantsRequest } from './dto/requests/list-restaurants.request';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a restaurant' })
  @ResponseMessage(RESTAURANT_MESSAGES.CREATED)
  create(@Body() dto: CreateRestaurantRequest) {
    return this.restaurantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List restaurants, optionally filtered by cuisine' })
  @ResponseMessage(RESTAURANT_MESSAGES.LISTED)
  findAll(@Query() query: ListRestaurantsRequest) {
    return this.restaurantsService.findAll(query);
  }
}
