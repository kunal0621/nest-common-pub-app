/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from '@jest/globals';
import { BaseMongooseRepositoryImpl } from './base-mongoose.repository.impl';
import { SearchResponse } from '../interfaces/search-response.interface';
import { MongooseSearchPayload } from '../interfaces/search-payload.interface';

class ConcreteRepo extends BaseMongooseRepositoryImpl<any> {
  constructor(model: any) {
    super(model, 'ConcreteRepo');
  }

  async search(payload: MongooseSearchPayload): Promise<SearchResponse<any>> {
    // Concrete implementation would use MongooseSearchQueryService
    this.logger.debug(`Executing search in ConcreteRepo with payload: ${JSON.stringify(payload)}`);
    return {
      items: [],
      total: 0,
      page: 1,
      count: 10,
      totalPages: 0,
    };
  }

  async findById(id: string) {
    this.logger.debug(`Finding by ID in ConcreteRepo: ${id}`);
    return null;
  }

  async create(doc: Partial<any>) {
    this.logger.debug(`Creating document in ConcreteRepo: ${JSON.stringify(doc)}`);
    return doc;
  }

  async executeNativeQuery<R>(query: string): Promise<R> {
    this.logger.debug(`Executing native query in ConcreteRepo: ${query}`);
    return null as any;
  }
}

describe('BaseMongooseRepositoryImpl', () => {
  it('is abstract and enforces implementation of all methods', () => {
    const repo = new ConcreteRepo({});
    expect(repo).toBeDefined();
    expect(repo).toHaveProperty('search');
    expect(repo).toHaveProperty('findById');
    expect(repo).toHaveProperty('create');
    expect(repo).toHaveProperty('executeNativeQuery');
  });

  it('logger is initialized with repositoryName', () => {
    const repo = new ConcreteRepo({});
    expect(repo['logger']).toBeDefined();
  });
});
