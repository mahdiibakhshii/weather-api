/**
 * Location Controller - Handles HTTP requests for location management
 * Implements CRUD operations with proper DTO validation and error handling
 */
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { locationResponceDto } from './dto/locationResponce.dto';
import { AlllocationsResponceDto } from './dto/AlllocationResponce.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { deletedLocationResponceDto } from './dto/deletedLocationResponce.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  /**
   * Create new location with geospatial data
   * @param createLocationObj - Validated location data
   * @returns Created location details
   */
  @Post()
  create(
    @Body() createLocationObj: CreateLocationDto,
  ): Promise<locationResponceDto> {
    return this.locationsService.create(createLocationObj);
  }

  /**
   * Get all locations with pagination metadata
   * @returns List of locations with count
   */
  @Get()
  findAll(): Promise<AlllocationsResponceDto> {
    return this.locationsService.findAll();
  }

  /**
   * Get single location by ID
   * @param id - MongoDB ObjectID string
   * @returns Location details
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<locationResponceDto> {
    return await this.locationsService.findOne(id);
  }

  /**
   * Update location properties
   * @param id - Existing location ID
   * @param updateLocationDto - Partial location data
   * @returns Updated location details
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<locationResponceDto> {
    return await this.locationsService.update(id, updateLocationDto);
  }

  /**
   * Delete location and associated weather data
   * @param id - Location ID to remove
   * @returns Deletion confirmation
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<deletedLocationResponceDto> {
    return await this.locationsService.remove(id);
  }
}