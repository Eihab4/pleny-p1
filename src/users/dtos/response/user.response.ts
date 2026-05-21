import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '../../schemas/user.schema';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ type: [String] })
  favoriteCuisines: string[];

  static fromEntity(doc: UserDocument): UserResponse {
    const res = new UserResponse();
    res.id = doc._id.toString();
    res.fullName = doc.fullName;
    res.favoriteCuisines = doc.favoriteCuisines;
    return res;
  }
}
