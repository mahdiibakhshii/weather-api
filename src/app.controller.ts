/**
 * Base Application Controller
 * Handles root-level endpoints and health checks
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // Basic health check endpoint
    return this.appService.getHello();
  }
}
