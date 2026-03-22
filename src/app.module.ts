import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { databaseConfig } from '@config/database.config';
import { appConfig } from '@config/app.config';
import { FuelModule } from '@modules/fuel/fuel.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { PreferencesModule } from '@modules/preferences/preferences.module';
import { PoisModule } from '@modules/pois/pois.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { AlertsGateway } from '@modules/alerts/alerts.gateway';
import { AlertsModule } from '@modules/alerts/alerts.module';
import { User } from './core/entities/user.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL, // Priotize connection string (Supabase/Render)
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
    TypeOrmModule.forFeature([User]),

    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    FuelModule,
    VehicleModule,
    PreferencesModule,
    PoisModule,
    AnalyticsModule,
    AlertsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
