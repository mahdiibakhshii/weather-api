/**
 * Weather Controller
 * Handles HTTP requests for weather data retrieval and storage
 */

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weatherQuery.dto';
import { WeatherResponseDto } from './dto/weatherResponse.dto';
import mongoose, { Types } from 'mongoose';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':locationId')
  getWeatherData(
    @Param('locationId') locationId: mongoose.Types.ObjectId,
    @Query() query: WeatherQueryDto,
  ): Promise<WeatherResponseDto> {
    return this.weatherService.getWeatherData(locationId, query);
  }

  @Post()
  fetchWeather(
    @Body('locationId') locationId: mongoose.Types.ObjectId,
    @Body('fromDate') fromDate: string,
    @Body('toDate') toDate: string,
  ): Promise<WeatherResponseDto> {
    return this.weatherService.fetchAndStoreHistoricalWeatherData(
      locationId,
      fromDate,
      toDate,
    );
  }
}
