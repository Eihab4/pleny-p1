import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_MESSAGES } from '../common/constants/user-messages';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateUserRequest } from './dtos/request/create-user.request';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ResponseMessage(USER_MESSAGES.CREATED)
  create(@Body() dto: CreateUserRequest) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ResponseMessage(USER_MESSAGES.LISTED)
  findAll() {
    return this.usersService.findAll();
  }
}
