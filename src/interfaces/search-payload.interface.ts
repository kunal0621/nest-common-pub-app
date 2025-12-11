import { Model, ModelCtor } from 'sequelize-typescript';
import { Operators } from '../constant-type/search-shared.constant';

export interface SearchPayload<T extends Model> {
    criteria: SearchCriteria[];
    pagination: Pagination;
    relatedEntities: Record<string, ModelCtor<T>>;
    parentSelectedFields?: string[];
    nestedSelectedFields?: Record<string, string[]>;
    requiredJoins?: boolean;
    isSubQuery?: boolean;
    schemaMapping?: Map<ModelCtor<T>, string>;
    orderBy?: SortConfig[];
    defaultOrder?: SortConfig[];
    groupBy?: string[];
}

export class SearchCriteria {
    field: number;
    operator: Operators;
    value: string[];
    required?: boolean;
}

export class Pagination {
    limit?: number;
    offset?: number;
}

export interface SortConfig {
    field: string;
    order: 'ASC' | 'DESC';
}