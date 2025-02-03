/**
 * NestJS Application Bootstrap File
 * Configures global settings and starts the server
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Postman document generator
  const config = new DocumentBuilder()
    .setTitle('Location API')
    .setDescription('API for managing locations and weather data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Global validation pipeline for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip undefined properties from DTOs
    }),
  );

  // Start listening on configured port (default: 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
