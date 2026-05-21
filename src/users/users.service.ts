import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserRequest } from './dtos/request/create-user.request';
import { UserResponse } from './dtos/response/user.response';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(dto: CreateUserRequest): Promise<UserResponse> {
    const created = await this.userModel.create(dto);
    return UserResponse.fromEntity(created);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userModel.find().exec();
    return users.map((doc) => UserResponse.fromEntity(doc));
  }
}
