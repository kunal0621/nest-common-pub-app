import { describe, it, expect } from '@jest/globals';
import { MongooseConnectionModule } from '../connections/mongoose-connection.module';

describe('MongooseConnectionModule', () => {
  describe('register', () => {
    it('should throw error on invalid MongoDB URI', () => {
      expect(() => {
        MongooseConnectionModule.register({
          uri: 'http://invalid-uri.com',
        });
      }).toThrow(
        /Invalid MongoDB URI passed to MongooseConnectionModule/,
      );
    });

    it('should accept valid MongoDB URI', () => {
      const module = MongooseConnectionModule.register({
        uri: 'mongodb://localhost:27017',
        dbName: 'testdb',
      });
      expect(module).toBeDefined();
      expect(module.module).toBe(MongooseConnectionModule);
      expect(module.global).toBe(true);
    });

    it('should accept valid MongoDB SRV URI', () => {
      const module = MongooseConnectionModule.register({
        uri: 'mongodb+srv://user:pass@host.mongodb.net',
        dbName: 'testdb',
      });
      expect(module).toBeDefined();
    });
  });
});
