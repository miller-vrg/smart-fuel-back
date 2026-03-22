import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'miler_dev',
  password: process.env.DB_PASSWORD || 'your_password_here',
  database: process.env.DB_NAME || 'smart_fuel_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

export const databaseConfig = registerAs('database', () => dbConfig);

// Para CLI de TypeORM (npm run migration:*)
export default new DataSource(dbConfig);
