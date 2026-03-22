"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./core/filters/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.use((0, helmet_1.default)());
    app.use(compression());
    const configService = app.get(config_1.ConfigService);
    const corsOrigins = configService.get('app.corsOrigins');
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Smart Fuel API running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    console.log(`🔌 WebSocket gateway active`);
}
bootstrap();
//# sourceMappingURL=main.js.map