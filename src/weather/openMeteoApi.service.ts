/**
 * Service for interacting with the Open-Meteo API
 */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenMeteoApiService {
  private readonly baseUrl: string | undefined;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('WEATHER_API_URL');
  }

  async getHistoricalWeather(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    //check if the api url has not been set in the enviroment.
    if (!this.baseUrl)
      throw new InternalServerErrorException(
        'Base URL for OpenMeteo API is not defined',
      );

    const response = await firstValueFrom(
      this.httpService.get(this.baseUrl, {
        params: {
          latitude,
          longitude,
          start_date: startDate,
          end_date: endDate,
          hourly: ['temperature_2m'],
          daily: ['temperature_2m_mean'],
          timezone: 'auto',
        },
      }),
    );
    return response.data;
  }
}
