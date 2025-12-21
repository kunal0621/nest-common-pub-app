import { DynamicModule, Global, Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { SequelizeConnectionModuleOptions } from '../interfaces/database-option.interface';

@Global()
@Module({})
export class SequelizeConnectionModule {
  static register(options: SequelizeConnectionModuleOptions): DynamicModule {

    // If direct connection details provided, use synchronous forRoot
    const sequelizeOptions: SequelizeModuleOptions = {
      dialect: options.dialect,
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      name: options.connectionName,
      pool: options.pool,
    };

    return {
      module: SequelizeConnectionModule,
      global: true,
      imports: [SequelizeModule.forRoot(sequelizeOptions)],
      exports: [SequelizeModule],
    };
  }
}

export default SequelizeConnectionModule;
