/**
 * DTO for weather query parameters
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class WeatherQueryDto {
  @ApiProperty({
    description: 'Start date for weather query',
    example: '2025-02-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for weather query',
    example: '2025-02-03',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
