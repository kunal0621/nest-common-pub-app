/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongooseSearchPayload } from '../interfaces/mongoose-search-payload.interface';
import { SearchResponse } from '../interfaces/search-response.interface';

/**
 * Base repository interface for Mongoose models.
 * Adapted from BaseRepository but uses MongooseSearchPayload instead of Sequelize-specific SearchPayload.
 */
export interface MongooseBaseRepository<T = any> {
  /**
   * Search documents with pagination, filtering, and sorting
   * @param payload MongooseSearchPayload with criteria, pagination, populate, etc
   * @return Promise resolving to SearchResponse with items, total, page, count, totalPages
   */
  search(payload: MongooseSearchPayload): Promise<SearchResponse<T>>;

  /**
   * Find document by MongoDB _id
   * @param id MongoDB _id as string
   * @return Promise resolving to the document or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Create a new document
   * @param doc Partial document object
   * @return Promise resolving to the created document
   */
  create(doc: Partial<T>): Promise<T>;

  /**
   * Execute native MongoDB aggregation or query
   * @param query The aggregation pipeline or query
   * @param params Optional query parameters
   * @return Promise resolving to the query result
   */
  executeNativeQuery<R>(query: string, params?: any): Promise<R>;
}
