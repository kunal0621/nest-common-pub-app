import { QueryOptions } from 'sequelize';
import { SearchPayload } from '../interfaces/search-payload.interface';
import { SearchResponse } from '../interfaces/search-response.interface';
import { Model } from 'sequelize-typescript';

/**
 * BaseRepository interface defining common data access methods
 */
export interface BaseRepository<T extends Model> {
  /**
   * search the documents/details with pagination
   * @param payload SearchPayload containing page and count for pagination
   * @return Promise resolving to an object containing items, total count, current page, count per page, and total pages
   */

  search(payload: SearchPayload<T>): Promise<SearchResponse<T>>;

  /**
   * find document/detail by its unique identifier
   * @param id unique identifier of the document/detail
   * @return Promise resolving to the document/detail or null if not found
   */

  findById(id: string): Promise<T | null>;

  /**
   * create a new document/detail
   * @param doc Partial document/detail to be created
   * @return Promise resolving to the created document/detail
   */

  create(doc: Partial<T>): Promise<T>;

  /**
   * Execute a native SQL query
   * @param query The SQL query string
   * @param params Optional query options
   * @return Promise resolving to the query result
   */

  executeNativeQuery<R>(query: string, params?: QueryOptions): Promise<R>;
}
