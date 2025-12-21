import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import { BaseRepository } from './base-repository';
import { Logger } from '@nestjs/common';
import { SearchResponse } from '../interfaces/search-response.interface';
import { SearchPayload } from '../interfaces/search-payload.interface';
import { QueryOptions } from 'sequelize';

/**
 * Base repository implementation for Sequelize models.
 * Extend this class and implement the abstract methods in your concrete repository.
 *
 * Example:
 *
 *   @Injectable()
 *   export class UserRepository extends BaseSequelizeRepositoryImpl<User> {
 *     constructor(
 *       @InjectModel(User) model: ModelCtor<User>,
 *       private readonly sequelize: Sequelize,
 *       private readonly searchQueryService: SearchQueryService,
 *     ) {
 *       super(model, sequelize, 'UserRepository');
 *     }
 *
 *     async search(payload: SearchPayload<User>): Promise<SearchResponse<User>> {
 *       const result = await this.searchQueryService.searchQuery(payload, this.model);
 *       return {
 *         items: result.items,
 *         total: result.total,
 *         page: payload.pagination.offset ? Math.floor(payload.pagination.offset / (payload.pagination.limit || 10)) + 1 : 1,
 *         count: payload.pagination.limit || 10,
 *         totalPages: Math.ceil(result.total / (payload.pagination.limit || 10)),
 *       };
 *     }
 *   }
 */
export abstract class BaseSequelizeRepositoryImpl<T extends Model> implements BaseRepository<T> {
    protected readonly logger: Logger;

    /**
     * constructor for BaseSequelizeRepositoryImpl
     * @param model The Sequelize model
     * @param sequelize The Sequelize instance
     * @param repositoryName The name of the repository
     */
    protected constructor(
        protected readonly model: ModelCtor<T>,
        protected sequelize: Sequelize,
        protected repositoryName: string,
    ) {
        this.logger = new Logger(this.repositoryName);
    }

    /**
     * Search with pagination, filtering, sorting, and nested relations.
     * Must be implemented in concrete repository and use SearchQueryService.
     */
    abstract search(payload: SearchPayload<T>): Promise<SearchResponse<T>>;

    async findById(id: string): Promise<T | null> {
        return this.model.findByPk(id);
    }

    async create(doc: Partial<T>): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.model.create(doc as any);
    }

    async executeNativeQuery<R>(query: string, params?: QueryOptions): Promise<R> {
        const [results] = await this.sequelize.query(query, params);
        return results as R;
    }
} 