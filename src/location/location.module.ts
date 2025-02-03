/**
 * Location Module - Organizes location-related components and dependencies
 * Registers MongoDB schema and connects with WeatherModule for data consistency
 */
import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from './schema/location.schema';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [
    // Register Location schema with Mongoose
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    // Connect with WeatherModule for cascading deletions
    WeatherModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}