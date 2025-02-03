/**
 * DTO for returning a list of locations with count
 */
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class AlllocationsResponceDto {
  @ApiProperty({
    description: 'Total number of locations',
    example: 5,
  })
  counts: number;

  @ApiProperty({
    type: 'array',
    description: 'List of locations',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Location ID',
          example: '507f1f77bcf86cd799439011',
        },
        name: { type: 'string', example: 'Vienna' },
        latitude: { type: 'number', example: 40.7128 },
        longitude: { type: 'number', example: -74.006 },
      },
    },
  })
  locations: {
    id: Types.ObjectId;
    name: string;
    latitude: number;
    longitude: number;
  }[];
}
