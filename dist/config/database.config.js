"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = exports.dbConfig = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const config_1 = require("@nestjs/config");
dotenv.config();
exports.dbConfig = {
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
exports.databaseConfig = (0, config_1.registerAs)('database', () => exports.dbConfig);
exports.default = new typeorm_1.DataSource(exports.dbConfig);
//# sourceMappingURL=database.config.js.map