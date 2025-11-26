import { Global, Module, DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

export interface MongooseConnectionModuleOptions {
    /**
     * Direct MongoDB connection URI. If provided, this value is used directly
     * and the module will not read from `ConfigService`.
     */
    uri?: string;
    /**
     * Direct database name. If provided, this value is used directly and the
     * module will not read from `ConfigService`.
     */
    dbName?: string;
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
    connectionName?: string;
}

@Global()
@Module({})
export class MongooseConnectionModule {
    /**
     * Register the module and allow passing custom config keys.
     * Example: MongooseConnectionModule.register({ dbNameKey: 'MY_DB_NAME', uriKey: 'MY_MONGO_URI', connectionName: 'myConnection' })
     */
    static register(options: MongooseConnectionModuleOptions = {}): DynamicModule {
        const {
            uri,
            dbName,
            dbNameKey = "MONGODB_DB_NAME",
            uriKey = "MONGODB_URI",
            connectionName,
        } = options;

        // If a direct `uri` is provided, validate it and use the synchronous `forRoot` API.
        // Otherwise fall back to the async factory that reads from ConfigService.
        let mongooseForRoot: any;
        if (uri) {
            const trimmed = uri.trim();
            const isValidMongoUri = /^mongodb(\+srv)?:\/\//i.test(trimmed);
            if (!isValidMongoUri) {
                throw new Error(
                    `Invalid MongoDB URI passed to MongooseConnectionModule.register(): ${uri}`,
                );
            }

            mongooseForRoot = MongooseModule.forRoot(trimmed, { dbName, connectionName });
        } else {
            mongooseForRoot = MongooseModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                connectionName,
                useFactory: async (config: ConfigService) => ({
                    uri: config.get<string>(uriKey),
                    dbName: config.get<string>(dbNameKey),
                }),
            });
        }

        return {
            module: MongooseConnectionModule,
            imports: [mongooseForRoot],
            global: true,
        };
    }
}