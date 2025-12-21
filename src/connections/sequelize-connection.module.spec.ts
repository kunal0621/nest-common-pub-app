import { describe, it, expect } from '@jest/globals';
import { SequelizeConnectionModule } from './sequelize-connection.module';

describe('SequelizeConnectionModule', () => {
  describe('register', () => {

    it('should accept direct connection details', () => {
      const module = SequelizeConnectionModule.register({
        host: 'localhost',
        port: 5432,
        username: 'u',
        password: 'p',
        database: 'db',
        dialect: 'postgres',
        connectionName: 'default',
        pool: {
          max: 5,
          min: 0,
          idle: 50000,
          acquire: 3000,
        }
      });
      expect(module).toBeDefined();
      expect(module.module).toBe(SequelizeConnectionModule);
    });
  });
});
