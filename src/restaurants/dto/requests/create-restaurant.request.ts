import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class LocationDto {
  @ApiProperty({
    description: 'GeoJSON coordinates as [longitude, latitude]',
    example: [31.235, 30.0444],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateRestaurantRequest {
  @ApiProperty({ example: 'مطعم الشام' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({ example: 'Sham Restaurant' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ example: ['syrian', 'grill'], minItems: 1, maxItems: 3 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  cuisines: string[];

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
