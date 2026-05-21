import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({ example: 'Eihab Muhammed' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: ['syrian', 'grill'] })
  @IsArray()
  @IsString({ each: true })
  favoriteCuisines: string[];
}
