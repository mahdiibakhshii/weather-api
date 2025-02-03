/**
 * Root Application Module
 * Configures global dependencies and connects application components
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from './location/location.module';
import { WeatherModule } from './weather/weather.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // Global HTTP client module for external API communication
    HttpModule,

    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available across all modules
    }),

    // Database module with async configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Get URI from .env
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    LocationModule, // Location management functionality
    WeatherModule, // Weather data processing
  ],
})
export class AppModule {}
