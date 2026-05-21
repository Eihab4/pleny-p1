import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class NearbyRestaurantsRequest {
  @ApiProperty({ example: 31.235 })
  @Type(() => Number)
  @IsLongitude()
  lng: number;

  @ApiProperty({ example: 30.0444 })
  @Type(() => Number)
  @IsLatitude()
  lat: number;
}
