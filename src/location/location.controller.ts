/**
 * Location Controller - Handles HTTP requests for location management
 * Implements CRUD operations with proper DTO validation and error handling
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { locationResponceDto } from './dto/locationResponce.dto';
import { AlllocationsResponceDto } from './dto/AlllocationResponce.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { deletedLocationResponceDto } from './dto/deletedLocationResponce.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  /**
   * Create new location with geospatial data
   * @param createLocationObj - Validated location data
   * @returns Created location details
   */
  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: 201,
    description: 'The location has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({
    status: 200,
    description: 'List of all locations',
    type: AlllocationsResponceDto,
  })
  findAll(): Promise<AlllocationsResponceDto> {
    return this.locationsService.findAll();
  }

  /**
   * Get single location by ID
   * @param id - MongoDB ObjectID string
   * @returns Location details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'The found location',
    type: locationResponceDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Location not found' })
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
  @ApiOperation({ summary: 'Update location details' })
  @ApiParam({ name: 'id', description: 'Location ID', type: String })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({
    status: 200,
    description: 'Location updated successfully',
    type: locationResponceDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 409, description: 'Location name conflict' })
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
  @ApiOperation({ summary: 'Delete a location' })
  @ApiParam({ name: 'id', description: 'Location ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Location deleted successfully',
    type: deletedLocationResponceDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async remove(@Param('id') id: string): Promise<deletedLocationResponceDto> {
    return await this.locationsService.remove(id);
  }
}
