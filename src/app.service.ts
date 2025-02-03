/**
 * Core Application Service
 * Contains base business logic and health check implementation
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Basic health check response
   * @returns {string} Service status message
   */
  getHello(): string {
    return 'Hello World!';
  }
}
