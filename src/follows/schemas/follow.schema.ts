import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';
import { User } from '../../users/schemas/user.schema';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Restaurant.name, required: true })
  restaurantId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });
