/**
 * DTO for confirming a location deletion
 */
import { Types } from 'mongoose';

export class deletedLocationResponceDto {
  id: Types.ObjectId;
  name: string;
  isDeleted: boolean; // Changed from 'isDelete' for consistency
}