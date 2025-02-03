/**
 * Weather Service
 * Manages business logic for weather data operations
 */

import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Weather } from './schema/weather.schema';
import { Location } from '../location/schema/location.schema';
import { WeatherQueryDto } from './dto/weatherQuery.dto';
import { WeatherResponseDto } from './dto/weatherResponse.dto';
import { OpenMeteoApiService } from './openMeteoApi.service';

@Injectable()
export class WeatherService {

  constructor(
    private readonly apiService: OpenMeteoApiService,
    @InjectModel(Weather.name) private weatherModel: Model<Weather>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
    private configService: ConfigService,
  ) {}

  async fetchAndStoreHistoricalWeatherData(
    locationId: mongoose.Types.ObjectId,
    start_date: string,
    end_date: string,
  ): Promise<WeatherResponseDto> {
    try {
      const location = await this.findLocation(locationId);
      const weatherData = await this.fetchWeatherData(location, start_date, end_date);
      await this.storeBulkWeather(locationId, weatherData.daily.time, weatherData.daily.temperature_2m_mean);
      return this.formatWeatherResponse(locationId, weatherData);
    } catch (error) {
      this.handleError(error, 'fetchAndStoreHistoricalWeatherData');
    }
  }

  async getWeatherData(
    locationId: mongoose.Types.ObjectId,
    query: WeatherQueryDto,
  ): Promise<WeatherResponseDto> {
    try {
      await this.findLocation(locationId);
      const filter = this.buildWeatherFilter(locationId, query);
      const weatherData = await this.weatherModel.find(filter).sort({ date: -1 }).exec();
      return this.formatWeatherResponse(locationId, { daily: { time: weatherData.map(w => w.date), temperature_2m_mean: weatherData.map(w => w.temperature) } });
    } catch (error) {
      this.handleError(error, 'getWeatherData');
    }
  }

  async storeBulkWeather(
    locationId: mongoose.Types.ObjectId,
    timeArray: Date[],
    temperatureArray: number[],
  ): Promise<{ insertedCount: number }> {
    try {
      const bulkOps = this.prepareBulkOperations(locationId, timeArray, temperatureArray);
      if (bulkOps.length > 0) {
        const result = await this.weatherModel.bulkWrite(bulkOps, { ordered: false });
        return { insertedCount: result.upsertedCount };
      }
      return { insertedCount: 0 };
    } catch (error) {
      this.handleError(error, 'storeBulkWeather');
    }
  }

  async deleteWeatherRecordsByLocationId(locationId: string): Promise<void> {
    try {
      const objectId = new Types.ObjectId(locationId);
      await this.weatherModel.deleteMany({ locationId: locationId }).exec();
    } catch (error) {
      this.handleError(error, 'deleteWeatherRecordsByLocationId');
    }
  }

  private async findLocation(locationId: mongoose.Types.ObjectId): Promise<Location> {
    const location = await this.locationModel.findById(locationId);
    if (!location) throw new NotFoundException(`Location ${locationId} not found`);
    return location;
  }

  private async fetchWeatherData(location: Location, start_date: string, end_date: string) {
    try {
      return await this.apiService.getHistoricalWeather(
        location.latitude,
        location.longitude,
        start_date,
        end_date,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch weather data from external API');
    }
  }

  private buildWeatherFilter(locationId: mongoose.Types.ObjectId, query: WeatherQueryDto): any {
    const filter: any = { locationId: locationId };
    if (query.startDate) filter.date = { $gte: new Date(query.startDate) };
    if (query.endDate) filter.date = { ...filter.date, $lte: new Date(query.endDate) };
    return filter;
  }

  private prepareBulkOperations(locationId: mongoose.Types.ObjectId, timeArray: Date[], temperatureArray: number[]) {
    return timeArray.map((dateItem: Date, index) => ({
      updateOne: {
        filter: { locationId, date: new Date(dateItem) },
        update: {
          $setOnInsert: {
            locationId,
            date: new Date(dateItem),
            temperature: temperatureArray[index],
          },
        },
        upsert: true,
      },
    }));
  }

  private formatWeatherResponse(locationId: mongoose.Types.ObjectId, weatherData: any): WeatherResponseDto {
    const historyData = weatherData.daily.time.map((dateItem, index) => ({
      date: dateItem,
      temperature: weatherData.daily.temperature_2m_mean[index],
    }));
    return { locationId, historyData };
  }

  private handleError(error: any, methodName: string): never {
    if (error instanceof HttpException) throw error;
    if (error.name === 'ValidationError') throw new BadRequestException(error.message);
    if (error.name === 'MongoServerError') {
      switch (error.code) {
        case 11000: throw new ConflictException('Duplicate weather record');
        case 13: throw new InternalServerErrorException('Database authentication failed');
        default: throw new InternalServerErrorException('Database operation failed');
      }
    }
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}