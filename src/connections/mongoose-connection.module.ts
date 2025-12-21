import { Global, Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionModuleOptions } from '../interfaces/database-option.interface';
@Global()
@Module({})
export class MongooseConnectionModule {
    /**
     * Register the module and allow passing custom config keys.
     * Example: MongooseConnectionModule.register({ dbNameKey: 'MY_DB_NAME', uriKey: 'MY_MONGO_URI', connectionName: 'myConnection' })
     */
    static register(options: MongooseConnectionModuleOptions): DynamicModule {
        const {
            uri,
            dbName,
            connectionName,
        } = options;

        let mongooseForRoot: DynamicModule;
        const trimmed = uri.trim();
        const isValidMongoUri = /^mongodb(\+srv)?:\/\//i.test(trimmed);
        if (!isValidMongoUri) {
            throw new Error(
                `Invalid MongoDB URI passed to MongooseConnectionModule.register(): ${uri}`,
            );
        }
        mongooseForRoot = MongooseModule.forRoot(trimmed, { dbName, connectionName });

        return {
            module: MongooseConnectionModule,
            imports: [mongooseForRoot],
            global: true,
        };
    }
}