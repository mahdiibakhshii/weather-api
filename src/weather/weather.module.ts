/**
 * Weather Module
 *
 * This module manages weather-related functionality, including data retrieval,
 * storage, and API integration. It provides a scalable architecture for
 * handling weather information for various locations.
 */

import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schema/weather.schema';
import { Location, LocationSchema } from 'src/location/schema/location.schema';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { OpenMeteoApiService } from './openMeteoApi.service';

@Module({
  imports: [
    HttpModule, // For making HTTP requests to external APIs
    MongooseModule.forFeature([
      { name: Weather.name, schema: WeatherSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
    ConfigModule, // For accessing environment variables
  ],
  providers: [WeatherService, OpenMeteoApiService],
  controllers: [WeatherController],
  exports: [WeatherService], // Make WeatherService available to other modules
})
export class WeatherModule {}
