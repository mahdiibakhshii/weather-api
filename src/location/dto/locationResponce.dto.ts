/**
 * DTO for returning a single location's details
 */
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class locationResponceDto {
  @ApiProperty({
    type: String,
    description: 'Location ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Location name',
    example: 'viennaUpdated',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Latitude coordinate',
    example: 51.5074,
  })
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'Longitude coordinate',
    example: -0.1278,
  })
  longitude: number;
}
