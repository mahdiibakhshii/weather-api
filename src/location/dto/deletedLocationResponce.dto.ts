/**
 * DTO for confirming a location deletion
 */
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class deletedLocationResponceDto {
  @ApiProperty({
    type: String,
    description: 'Deleted location ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Deleted location name',
    example: 'Paris',
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'Deletion status',
    example: true,
  })
  isDeleted: boolean; // Changed from 'isDelete' for consistency
}
