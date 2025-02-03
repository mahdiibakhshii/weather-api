/**
 * Location Service - Core business logic for location management
 * Handles CRUD operations with MongoDB integration and weather data coordination
 * Implements robust error handling and validation pipelines
 */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Location } from './schema/location.schema';
import { WeatherService } from 'src/weather/weather.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { locationResponceDto } from './dto/locationResponce.dto';
import { AlllocationsResponceDto } from './dto/AlllocationResponce.dto';
import { deletedLocationResponceDto } from './dto/deletedLocationResponce.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
// Import DTOs...

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
    private readonly weatherService: WeatherService,
  ) {}

  /**
   * Create new location with duplicate prevention
   * @param createLocationObj Validated location data
   * @returns Created location details
   * @throws ConflictException | BadRequestException | InternalServerErrorException
   */
  async create(
    createLocationObj: CreateLocationDto,
  ): Promise<locationResponceDto> {
    try {
      // Duplicate check using name field
      const existingLocation = await this.locationModel
        .findOne({
          name: createLocationObj.name,
        })
        .exec();

      if (existingLocation) {
        throw new ConflictException(
          `Location '${createLocationObj.name}' exists`,
        );
      }

      // Database operation with schema validation
      const createdLocation = new this.locationModel(createLocationObj);
      const createdObj = await createdLocation.save();

      return this.mapToLocationResponse(createdObj);
    } catch (error) {
      // Error handling pipeline
      if (error instanceof ConflictException) throw error;
      if (error.name === 'ValidationError') {
        throw new BadRequestException(this.formatValidationError(error));
      }
      if (error.code === 11000) {
        throw new ConflictException('Location exists (DB constraint)');
      }
      throw new InternalServerErrorException('Create location failed');
    }
  }

  /**
   * Retrieve all locations with data integrity checks
   * @returns Paginated location list
   * @throws InternalServerErrorException
   */
  async findAll(): Promise<AlllocationsResponceDto> {
    try {
      const locations = await this.locationModel.find().exec();

      return {
        counts: locations.length,
        locations: locations.map((loc) => {
          // Data validation guard clause
          if (!loc?.id || !loc.name || !loc.latitude || !loc.longitude) {
            throw new InternalServerErrorException('Invalid location format');
          }
          return this.mapToLocationResponse(loc);
        }),
      };
    } catch (error) {
      // Unified error handling
      this.handleDatabaseError(error, 'retrieve locations');
    }
  }

  /**
   * Get single location by ID with validation
   * @param id Location identifier
   * @returns Location details
   * @throws NotFoundException | BadRequestException | InternalServerErrorException
   */
  async findOne(id: string): Promise<locationResponceDto> {
    const objectId = this.validateObjectId(id);

    try {
      const location = await this.locationModel.findById(objectId).exec();
      if (!location) throw new NotFoundException(`Location ${id} not found`);

      // Structural validation
      if (!location.name || !location.latitude || !location.longitude) {
        throw new InternalServerErrorException('Invalid location data');
      }

      return this.mapToLocationResponse(location);
    } catch (error) {
      this.handleDatabaseError(error, 'retrieve location');
    }
  }

  /**
   * Update location properties with full validation
   * @param id Location identifier
   * @param updateLocationDto Partial location data
   * @returns Updated location details
   * @throws NotFoundException | BadRequestException | InternalServerErrorException
   */
  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<locationResponceDto> {
    this.validateObjectId(id);

    try {
      const updatedLocation = await this.locationModel
        .findByIdAndUpdate(id, updateLocationDto, {
          new: true,
          runValidators: true, // Enforce schema validation
        })
        .exec();

      if (!updatedLocation)
        throw new NotFoundException(`Location ${id} not found`);
      return this.mapToLocationResponse(updatedLocation);
    } catch (error) {
      this.handleDatabaseError(error, 'update location');
    }
  }

  /**
   * Delete location and associated weather data
   * @param id Location identifier
   * @returns Deletion confirmation
   * @throws NotFoundException | BadRequestException | InternalServerErrorException
   */
  async remove(id: string): Promise<deletedLocationResponceDto> {
    this.validateObjectId(id);

    try {
      const deletedLocation = await this.locationModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedLocation)
        throw new NotFoundException(`Location ${id} not found`);

      // Cascade delete related weather data
      await this.weatherService.deleteWeatherRecordsByLocationId(
        deletedLocation.id,
      );

      return {
        ...this.mapToLocationResponse(deletedLocation),
        isDeleted: true,
      };
    } catch (error) {
      this.handleDatabaseError(error, 'remove location');
    }
  }

  // --------------------------
  //  Helper Methods
  // --------------------------

  /** Validate and convert string ID to MongoDB ObjectId */
  private validateObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      throw new BadRequestException('Invalid location ID format');
    }
  }

  /** Centralized error handling for database operations */
  private handleDatabaseError(error: any, context: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    )
      throw error;

    switch (error.name) {
      case 'ValidationError':
        throw new BadRequestException(this.formatValidationError(error));
      case 'CastError':
        throw new BadRequestException('Invalid data format');
      case 'MongoServerError':
        throw new InternalServerErrorException('Database operation failed');
      default:
        throw new InternalServerErrorException(`Failed to ${context}`);
    }
  }

  /** Map database entity to response DTO */
  private mapToLocationResponse(location: Location): locationResponceDto {
    return {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }

  /** Format Mongoose validation errors */
  private formatValidationError(error: any): string {
    return Object.values(error.errors)
      .map((err: any) => err.message)
      .join(', ');
  }
}
