/**
 * DTO for weather query parameters
 */
import { IsOptional, IsDateString } from 'class-validator';

export class WeatherQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
