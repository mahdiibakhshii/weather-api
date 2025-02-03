/**
 * DTO for updating an existing location with optional fields
 */
import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}
