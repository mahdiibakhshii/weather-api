/**
 * NestJS Application Bootstrap File
 * Configures global settings and starts the server
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipeline for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // Automatically transform payloads to DTO instances
      whitelist: true,  // Strip undefined properties from DTOs
    }),
  );

  // Start listening on configured port (default: 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();