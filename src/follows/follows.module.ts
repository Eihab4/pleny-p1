import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { UsersModule } from '../users/users.module';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { Follow, FollowSchema } from './schemas/follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    UsersModule,
    RestaurantsModule,
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [MongooseModule],
})
export class FollowsModule {}
