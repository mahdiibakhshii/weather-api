/**
 * DTO for creating a new location with input validation
 */
import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number) // Ensures type conversion for proper validation
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  longitude: number;
}
