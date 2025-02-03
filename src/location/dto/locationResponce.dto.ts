/**
 * DTO for returning a single location's details
 */
import { Types } from 'mongoose';

export class locationResponceDto {
  id: Types.ObjectId;
  name: string;
  latitude: number;
  longitude: number;
}