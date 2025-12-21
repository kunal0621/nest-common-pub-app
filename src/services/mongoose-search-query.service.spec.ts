/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, jest } from '@jest/globals';
import { MongooseSearchQueryService } from './mongoose-search-query.service';
import { Operators } from '../constant-type/search-shared.constant';
import { Model } from 'mongoose';
import { MongooseSearchPayload } from '../interfaces/search-payload.interface';

describe('MongooseSearchQueryService', () => {
  const service = new MongooseSearchQueryService();

  it('builds filter and queries model correctly', async () => {
    const fakeItems = [{ name: 'john' }];
    const fakeModel = {
      countDocuments: jest.fn((_filter: any) => ({ exec: () => Promise.resolve(1) })),
      find: jest.fn((_filter: any) => ({
        select: function () { return this; },
        limit: function () { return this; },
        skip: function () { return this; },
        sort: function () { return this; },
        populate: function () { return this; },
        exec: () => Promise.resolve(fakeItems),
      })),
    };

    const payload = {
      criteria: [{ field: 'name', operator: Operators.EQ, value: ['john'] }],
      pagination: { limit: 10, offset: 0 },
      selectedFields: ['name'],
      relatedCollections: [],
      sort: [{ field: 'name', order: 'ASC' }], 
    };

    const res = await service.searchQuery(payload as MongooseSearchPayload, fakeModel as unknown as Model<Record<string, unknown>>);
    expect(res.total).toBe(1);
    expect(res.items).toEqual(fakeItems);
    expect(fakeModel.countDocuments).toHaveBeenCalledWith({ name: {'$eq': 'john'} });
    expect(fakeModel.find).toHaveBeenCalledWith({ name: {'$eq': 'john'} });
  });
});
