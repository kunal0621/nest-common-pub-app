import { Model, ModelCtor } from 'sequelize-typescript';
import { Operators } from '../constant-type/search-shared.constant';
import type { PipelineStage } from 'mongoose';

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

export interface MongooseSearchPayload {
  criteria: SearchCriteria[];
  pagination: Pagination;
  relatedCollections: mongooseCollectionlookup[]; // mongoose populate paths
  selectedFields?: string[]; // projection
  requiredLookups?: boolean;
  orderBy?: SortConfig[];
  sort?: SortConfig[];
  groupBy?: string[];
}

export class SearchCriteria {
    field: string;
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

export class mongooseCollectionlookup {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
    let?: Record<string, unknown>;
    single?: boolean;
    pipeline?: PipelineStage.Match[] | PipelineStage.Lookup[] | PipelineStage.Project[];
}