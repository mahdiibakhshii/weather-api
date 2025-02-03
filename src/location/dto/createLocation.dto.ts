/**
 * DTO for creating a new location with input validation
 */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The name of the location',
    example: 'New York City',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The latitude of the location',
    minimum: -90,
    maximum: 90,
    example: 40.7128,
  })
  @IsNumber()
  @Type(() => Number) // Ensures type conversion for proper validation
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the location',
    minimum: -180,
    maximum: 180,
    example: -74.006,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  longitude: number;
}
