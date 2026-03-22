"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const database_config_1 = require("./config/database.config");
const app_config_1 = require("./config/app.config");
const fuel_module_1 = require("./modules/fuel/fuel.module");
const vehicle_module_1 = require("./modules/vehicle/vehicle.module");
const preferences_module_1 = require("./modules/preferences/preferences.module");
const pois_module_1 = require("./modules/pois/pois.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const alerts_module_1 = require("./modules/alerts/alerts.module");
const user_entity_1 = require("./core/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.appConfig, database_config_1.databaseConfig],
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    host: !process.env.DATABASE_URL ? (process.env.DB_HOST || 'localhost') : undefined,
                    port: !process.env.DATABASE_URL ? parseInt(process.env.DB_PORT || '5432') : undefined,
                    username: !process.env.DATABASE_URL ? (process.env.DB_USER || 'miler_dev') : undefined,
                    password: !process.env.DATABASE_URL ? (process.env.DB_PASSWORD || 'your_password_here') : undefined,
                    database: !process.env.DATABASE_URL ? (process.env.DB_NAME || 'smart_fuel_db') : undefined,
                    autoLoadEntities: true,
                    synchronize: process.env.NODE_ENV !== 'production',
                    logging: process.env.NODE_ENV === 'development',
                    ssl: process.env.DB_SSL === 'true' || !!process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            schedule_1.ScheduleModule.forRoot(),
            fuel_module_1.FuelModule,
            vehicle_module_1.VehicleModule,
            preferences_module_1.PreferencesModule,
            pois_module_1.PoisModule,
            analytics_module_1.AnalyticsModule,
            alerts_module_1.AlertsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map