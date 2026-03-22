import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mapboxApiKey: process.env.MAPBOX_API_KEY || '',
  anomalyThreshold: parseFloat(process.env.ANOMALY_THRESHOLD || '0.15'),
  defaultSafetyBuffer: parseFloat(process.env.DEFAULT_SAFETY_BUFFER || '0.15'),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:4200,http://localhost:8100').split(','),
}));
