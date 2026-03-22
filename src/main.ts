import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  app.setGlobalPrefix('api');

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Security middleware
  app.use(helmet());
  app.use(compression());

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('app.corsOrigins');

  // CORS
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe (DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('Smart Fuel API')
    .setDescription('API para la app de navegación proactiva Smart Fuel')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('fuel', 'Gestión de tanqueos y consumo')
    .addTag('vehicles', 'Gestión de vehículos')
    .addTag('preferences', 'Preferencias de parada')
    .addTag('pois', 'Puntos de interés - Estaciones')
    .addTag('analytics', 'Analítica y detección de anomalías')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Smart Fuel API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🔌 WebSocket gateway active`);
}

bootstrap();
