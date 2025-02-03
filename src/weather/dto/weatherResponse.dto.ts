/**
 * DTO for weather response data
 */
import { Types } from 'mongoose';

// Define the response DTO
export class WeatherResponseDto {
  locationId: Types.ObjectId;
  historyData: {
    date: Date;
    temprature: number;
  }[];
}
