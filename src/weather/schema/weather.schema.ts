/**
 * MongoDB schema for Weather data
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Weather extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Location', required: true })
  locationId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: Date,
    required: true,
    index: true,
    // Optional: Normalize date to day start (00:00:00)
    get: (v: Date) => new Date(v).setHours(0, 0, 0, 0),
    set: (v: Date) => new Date(v).setHours(0, 0, 0, 0),
  })
  temperature: number;

  @Prop({ required: false })
  hourlyTemprature: number[];
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);

// Add compound unique index
WeatherSchema.index(
  { locationId: 1, date: 1 },
  { unique: true, name: 'unique_location_day' },
);
