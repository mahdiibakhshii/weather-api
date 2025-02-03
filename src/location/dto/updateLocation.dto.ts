/**
 * DTO for updating an existing location with optional fields
 */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    required: false,
    description: 'Location name',
    example: 'Vienna',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Latitude coordinate (-90 to 90)',
    example: 48.208176,
    type: Number,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    required: false,
    description: 'Longitude coordinate (-180 to 180)',
    example: 16.373819,
    type: Number,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}
