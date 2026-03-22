import { DataSource, DataSourceOptions } from 'typeorm';
export declare const dbConfig: DataSourceOptions;
export declare const databaseConfig: (() => import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions) & import("@nestjs/config").ConfigFactoryKeyHost<import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions>;
declare const _default: DataSource;
export default _default;
