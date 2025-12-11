import { SupportedDialect } from '../constant-type/sequelize-dialect.type';

export interface SequelizeConnectionModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialect: SupportedDialect;
  connectionName: string;
}