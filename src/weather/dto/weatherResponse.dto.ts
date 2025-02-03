/**
 * DTO for weather response data
 */
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

// Define the response DTO
export class WeatherResponseDto {
  @ApiProperty({
    type: String,
    description: 'Location ID',
    example: '507f1f77bcf86cd799439011',
  })
  locationId: Types.ObjectId;

  @ApiProperty({
    type: 'array',
    description: 'Historical weather data',
    items: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
          example: '2025-02-03T00:00:00.000Z',
        },
        temprature: { type: 'number', example: 22.5 },
      },
    },
  })
  historyData: {
    date: Date;
    temprature: number;
  }[];
}
