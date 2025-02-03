/**
 * MongoDB schema for the Location entity
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Add timestamps for better data tracking
export class Location extends Document {
  @Prop({ required: true, unique: true, index: true }) // Added index for query optimization
  name: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Add compound index for geospatial queries
LocationSchema.index({ latitude: 1, longitude: 1 });
