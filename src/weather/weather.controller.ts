/**
 * Weather Controller
 * Handles HTTP requests for weather data retrieval and storage
 */

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weatherQuery.dto';
import { WeatherResponseDto } from './dto/weatherResponse.dto';
import mongoose, { Types } from 'mongoose';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':locationId')
  @ApiOperation({ summary: 'Get weather data for a location' })
  @ApiParam({
    name: 'locationId',
    type: String,
    description: 'ID of the location',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid location ID or query parameters',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  getWeatherData(
    @Param('locationId') locationId: mongoose.Types.ObjectId,
    @Query() query: WeatherQueryDto,
  ): Promise<WeatherResponseDto> {
    return this.weatherService.getWeatherData(locationId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Fetch and store historical weather data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        locationId: {
          type: 'string',
          example: '507f1f77bcf86cd799439011',
          description: 'ID of the location',
        },
        fromDate: {
          type: 'string',
          format: 'date',
          description: 'Start date for historical data',
        },
        toDate: {
          type: 'string',
          format: 'date',
          description: 'End date for historical data',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Weather data fetched and stored successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Location not found' })
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
