/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchQueryService } from './search-sequelize-query.service';
import { Operators } from '../constant-type/search-shared.constant';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';


describe('SearchQueryService', () => {
  let service: SearchQueryService;

  beforeEach(() => {
    service = new SearchQueryService();
  });

  it('calls model.count and findAll for top-level criteria', async () => {
    const mockCount = jest.fn(() => Promise.resolve(1));
    const mockFindAll = jest.fn(() => Promise.resolve([{ id: 1 }]));
    const model: any = { count: mockCount, findAll: mockFindAll };

    const options: any = {
      criteria: [{ field: 'name', operator: Operators.EQ, value: ['John'] }],
      pagination: { limit: 10, offset: 0 },
      relatedEntities: {},
      parentSelectedFields: undefined,
      nestedSelectedFields: undefined,
      requiredJoins: true,
      isSubQuery: false,
      schemaMapping: new Map(),
    };

    const res = await service.searchQuery(options, model);

    expect(mockCount).toHaveBeenCalled();
    const countArg = (mockCount.mock.calls as any)[0][0];
    expect(countArg.where).toBeDefined();
    expect(countArg.where).toHaveProperty('name');

    expect(mockFindAll).toHaveBeenCalled();
    const findArg = (mockFindAll.mock.calls as any)[0][0];
    expect(findArg.where).toHaveProperty('name');
    expect(res.total).toBe(1);
    expect(res.items).toEqual([{ id: 1 }]);
  });

  it('builds include for nested criteria and applies nestedSelectedFields', async () => {
    const mockCount = jest.fn(() => Promise.resolve(2));
    const mockFindAll = jest.fn(() => Promise.resolve([{ id: 2 }]));
    const model: any = { count: mockCount, findAll: mockFindAll };

    const relatedEntities: any = {
      profile: { schema: () => ({ __model: 'profile' }) },
    };

    const options: any = {
      criteria: [{ field: 'profile.age', operator: Operators.GT, value: ['30'], required: true }],
      pagination: { limit: 10, offset: 0 },
      relatedEntities,
      parentSelectedFields: undefined,
      nestedSelectedFields: { profile: ['id', 'age'] },
      requiredJoins: true,
      isSubQuery: false,
      schemaMapping: new Map(),
    };

    const res = await service.searchQuery(options, model);

    expect(mockCount).toHaveBeenCalled();
    const countArg = (mockCount.mock.calls as any)[0][0];
    expect(Array.isArray(countArg.include)).toBe(true);
    expect(countArg.include.length).toBeGreaterThan(0);
    const inc = countArg.include[0];
    expect(inc.as).toBe('profile');
    expect(inc.where).toBeDefined();
    expect(inc.attributes).toEqual(['id', 'age']);
    expect(res.total).toBe(2);
  });
});
