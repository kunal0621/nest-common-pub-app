import { Operators } from '../constant-type/search-shared.constant';

export interface MongooseSearchPayload {
  criteria?: SearchCriteria[];
  pagination?: Pagination;
  populate?: string[]; // mongoose populate paths
  selectedFields?: string[]; // projection
  sort?: SortConfig[];
  groupBy?: string[];
}

export interface SearchCriteria {
  field: string;
  operator: Operators;
  value: string[];
}

export interface Pagination {
  limit?: number;
  offset?: number;
}

export interface SortConfig {
  field: string;
  order: 'ASC' | 'DESC';
}
