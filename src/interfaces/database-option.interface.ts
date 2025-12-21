import { SupportedDialect } from '../constant-type/sequelize-dialect.type';

export interface SequelizeConnectionModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialect: SupportedDialect;
  connectionName: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export interface MongooseConnectionModuleOptions {
  /**
   * Direct MongoDB connection URI. If provided, this value is used directly
   * and the module will not read from `ConfigService`.
   */
  uri: string;
  /**
   * Direct database name. If provided, this value is used directly and the
   * module will not read from `ConfigService`.
   */
  dbName: string;
  /**
   * The config key for the MongoDB database name, defaults to `MONGODB_DB_NAME`.
   */
  dbNameKey?: string;
  /**
   * The config key for the MongoDB uri, defaults to `MONGODB_URI`.
   */
  uriKey?: string;
  /**
   * Optional connection name for named mongoose connections.
   */
  connectionName: string;
}
