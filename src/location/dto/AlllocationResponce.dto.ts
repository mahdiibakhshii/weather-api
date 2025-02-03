/**
 * DTO for returning a list of locations with count
 */
import { Types } from 'mongoose';

export class AlllocationsResponceDto {
  counts: number;
  locations: {
    id: Types.ObjectId;
    name: string;
    latitude: number;
    longitude: number;
  }[];
}