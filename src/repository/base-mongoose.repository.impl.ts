/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';
import { SearchResponse } from '../interfaces/search-response.interface';
import { MongooseBaseRepository } from './mongoose-base-repository';
import { MongooseSearchPayload } from '../interfaces/search-payload.interface';

/**
 * Base repository implementation for Mongoose models.
 * Extend this class and implement the abstract methods in your concrete repository.
 *
 * Example:
 *
 *   @Injectable()
 *   export class UserRepository extends BaseMongooseRepositoryImpl<User> {
 *     constructor(
 *       @InjectModel(User.name) model: Model<UserDocument>,
 *       private readonly searchQueryService: MongooseSearchQueryService,
 *     ) {
 *       super(model, 'UserRepository');
 *     }
 *
 *     async search(payload: MongooseSearchPayload): Promise<SearchResponse<User>> {
 *       const result = await this.searchQueryService.searchQuery(payload, this.model);
 *       return {
 *         items: result.items,
 *         total: result.total,
 *         page: payload?.pagination?.offset ? Math.floor(payload.pagination.offset / (payload.pagination.limit || 10)) + 1 : 1,
 *         count: payload?.pagination?.limit || 10,
 *         totalPages: Math.ceil(result.total / (payload?.pagination?.limit || 10) || 1),
 *       };
 *     }
 *
 *     async findById(id: string): Promise<User | null> {
 *       return this.model.findById(id).exec();
 *     }
 *
 *     async create(doc: Partial<User>): Promise<User> {
 *       return new this.model(doc).save();
 *     }
 *
 *     async executeNativeQuery<R>(query: string): Promise<R> {
 *       // Execute raw MongoDB aggregation or custom query
 *     }
 *   }
 */
export abstract class BaseMongooseRepositoryImpl<T = any> implements MongooseBaseRepository<T> {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly model: any,
    protected readonly repositoryName: string,
  ) {
    this.logger = new Logger(this.repositoryName);
  }

  /**
   * Search with pagination, filtering, sorting, and populate.
   * Must be implemented in concrete repository and use MongooseSearchQueryService.
   */
  abstract search(payload: MongooseSearchPayload): Promise<SearchResponse<T>>;

  /**
   * Find a document by its MongoDB _id.
   * Must be implemented in concrete repository.
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Create a new document.
   * Must be implemented in concrete repository.
   */
  abstract create(doc: Partial<T>): Promise<T>;

  /**
   * Execute a native MongoDB aggregation or query.
   * Must be implemented in concrete repository.
   */
  abstract executeNativeQuery<R>(query: string, params?: any): Promise<R>;
}

export default BaseMongooseRepositoryImpl;
