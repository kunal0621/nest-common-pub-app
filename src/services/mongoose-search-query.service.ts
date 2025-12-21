import { Injectable, Logger } from '@nestjs/common';
import { Operators } from '../constant-type/search-shared.constant';
import { Model, PipelineStage, QuerySelector } from 'mongoose';
import { MongooseSearchPayload, SearchCriteria } from '../interfaces/search-payload.interface';
import { SearchResultDto } from '../dto/search/search-result.dto';

@Injectable()
export class MongooseSearchQueryService {
  private readonly logger = new Logger(MongooseSearchQueryService.name);

  private readonly operatorsMap: Record<Operators, (values: string[]) => QuerySelector<string>> = {
    [Operators.EQ]: (values) => ({ $eq: values[0] }),
    [Operators.NEQ]: (values) => ({ $ne: values[0] }),
    [Operators.GT]: (values) => ({ $gt: values[0] }),
    [Operators.GTE]: (values) => ({ $gte: values[0] }),
    [Operators.LT]: (values) => ({ $lt: values[0] }),
    [Operators.LTE]: (values) => ({ $lte: values[0] }),
    [Operators.LIKE]: (values) => ({ $regex: values[0], $options: 'i' }),
    [Operators.IN]: (values) => ({ $in: values }),
    [Operators.NOT_IN]: (values) => ({ $nin: values }),
    [Operators.BETWEEN]: (values) => ({ $gte: values[0], $lte: values[1] }),
    [Operators.NOT_BETWEEN]: (values) => ({ $not: { $gte: values[0], $lte: values[1] } }),
    [Operators.ILIKE]: (values) => ({ $regex: values[0], $options: 'i' }),
  };

  private getCondition(operator: Operators, values: string[]): QuerySelector<string> | string {
    return this.operatorsMap[operator]?.(values) ?? values[0];
  }

  /**
   * Build a plain mongoose filter from criteria
   */
  private buildFilter(criteria?: SearchCriteria[]): Record<string, unknown> {
    const filter = {};
    if (!criteria || criteria.length === 0) return filter;
    criteria.forEach(({ field, operator, value }) => {
      const segments = field.split('.');
      if (segments.length === 1) {
        filter[field] = this.getCondition(operator, value);
      } else {
        // Build nested object path
        let current = filter;
        for (let i = 0; i < segments.length - 1; i++) {
          const seg = segments[i];
          current[seg] = current[seg] || {};
          current = current[seg];
        }
        current[segments[segments.length - 1]] = this.getCondition(operator, value);
      }
    });
    return filter;
  }

  async searchQuery<T>(
    options: MongooseSearchPayload,
    model: Model<T>
  ): Promise<SearchResultDto<T>> {
    const { criteria, pagination, selectedFields, sort } = options;
    const filter = this.buildFilter(criteria);

    this.logger.debug(`Mongoose filter: ${JSON.stringify(filter)}`);

    const limit = pagination?.limit;
    const offset = pagination?.offset;

    const count = await model.countDocuments(filter).exec();

    let query = model.find(filter);
    if (selectedFields && selectedFields.length > 0) {
      query = query.select(selectedFields.join(' '));
    }
    if (typeof limit === 'number') query = query.limit(limit);
    if (typeof offset === 'number') query = query.skip(offset);
    if (sort && sort.length > 0) {
      const sortObj = {};
      sort.forEach(({ field, order }) => {
        sortObj[field] = order === 'ASC' ? 1 : -1;
      });
      query = query.sort(sortObj);
    }

    const items = await query.exec();

    const result = new SearchResultDto<T>();
    result.items = items;
    result.total = typeof count === 'number' ? count : Number(count);
    return result;
  }

  /**
   * Perform search using MongoDB aggregation pipeline.
   * consdering criteria, pagination, lookups, projections, and sorting.
   * On condition, build an array of atomic conditions (we will combine with $and later).
   * matchStage is built from conditions.
   * final match stage: if multiple conditions, wrap in $and, otherwise single object or {}.
   * pipeline stages line 132:
   *   1) $match (early filter)
   *   2) Optional $lookups for relatedCollections
   *   3) custom pipeline for lookups if provided
   *   4) Optional $unwind for single object lookups
   *   5) $project for selected fields
   *   6) $sort for sorting
   *   7) $facet for pagination and total count
   * @param options Search options for building aggregation pipeline
   * @param model parent Mongoose model to run aggregation on
   * @returns search result with items and total count
   */

  async searchQueryAggregate<T>(
    options: MongooseSearchPayload,
    model: Model<T>
  ): Promise<SearchResultDto<T>> {
    const { criteria, pagination, relatedCollections, selectedFields, sort } = options;

    const limit = Math.min(Math.max(pagination.limit ?? 10, 1), 100); // cap limit
    const offset = Math.max(pagination?.offset ?? 0, 0);

    const conditions: Record<string, unknown>[] = [];
    if (criteria && criteria.length) {
      for (const c of criteria) {
        const field = c.field; // keep dotted path as-is: "a.b.c"
        const cond = this.getCondition(c.operator, c.value);
        conditions.push({ [field]: cond });
      }
    }
    const matchStage = (() => {
      if (conditions.length === 0) return {};
      if (conditions.length === 1) return conditions[0];
      return { $and: conditions };
    })();

    this.logger.debug(`Aggregation $match: ${JSON.stringify(matchStage)}`);
    const pipeline: PipelineStage[] = [];

    if (Object.keys(matchStage).length) pipeline.push({ $match: matchStage });
    if (relatedCollections && relatedCollections.length) {
      for (const p of relatedCollections) {
        const lookupStage: PipelineStage.Lookup = {
          $lookup: {
            from: p.from,
            localField: p.localField,
            foreignField: p.foreignField,
            as: p.as,
          },
        };
        if (p.pipeline && p.let) {
          lookupStage.$lookup = {
            from: p.from,
            let: p.let,
            pipeline: p.pipeline,
            as: p.as,
          };
        }
        pipeline.push(lookupStage);
        if (p.single) {
          pipeline.push({ $unwind: { path: `$${p.as}`, preserveNullAndEmptyArrays: true } });
        }
      }
    }

    // 3) Project selected fields (if provided). We apply after lookups if you want projected joined fields too.
    if (selectedFields && selectedFields.length) {
      const proj: Record<string, 1 | 0> = {};
      selectedFields.forEach((f) => (proj[f] = 1));
      pipeline.push({ $project: proj });
    }

    // 4) Sorting
    if (sort && sort.length) {
      const sortObj: Record<string, 1 | -1> = {};
      sort.forEach(({ field, order }) => (sortObj[field] = order === 'ASC' ? 1 : -1));
      pipeline.push({ $sort: sortObj });
    }

    // 5) Facet for pagination + total count in one request
    //    Put $skip/$limit inside facet.data to page results after all prior stages
    const facetStage: PipelineStage.Facet = {
      $facet: {
        data: [{ $skip: offset }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    };

    pipeline.push(facetStage);

    this.logger.debug(`Aggregation pipeline: ${JSON.stringify(pipeline)}`);
    // Using aggregate on model ensures pipeline runs on DB (server-side)
    const aggResult = await model.aggregate(pipeline).allowDiskUse(true).exec();

    // aggResult is array with single element because of $facet
    const first = aggResult[0] ?? { data: [], totalCount: [] };
    const items = first.data;
    const total = first.totalCount && first.totalCount[0] ? first.totalCount[0].count : 0;

    const result = new SearchResultDto<T>();
    result.items = items;
    result.total = typeof total === 'number' ? total : Number(total);
    return result;
  }
}

export default MongooseSearchQueryService;
