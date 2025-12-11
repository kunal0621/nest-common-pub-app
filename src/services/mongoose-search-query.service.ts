import { Injectable, Logger } from '@nestjs/common';
import { Operators } from '../constant-type/search-shared.constant';
import { Model } from 'mongoose';
import { MongooseSearchPayload, SearchCriteria } from '../interfaces/mongoose-search-payload.interface';
import { SearchResultDto } from '../dto/search/search-result.dto';

@Injectable()
export class MongooseSearchQueryService {
  private readonly logger = new Logger(MongooseSearchQueryService.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly operatorsMap: Record<Operators, (values: string[]) => any> = {
    [Operators.EQ]: (values) => values[0],
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

  private getCondition(operator: Operators, values: string[]) {
    return this.operatorsMap[operator]?.(values) ?? values[0];
  }

  /**
   * Build a plain mongoose filter from criteria
   */
  private buildFilter(criteria?: SearchCriteria[]) {
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

  async searchQuery<T>(options: MongooseSearchPayload, model: Model<T>): Promise<SearchResultDto<T>> {
    const { criteria, pagination, populate, selectedFields, sort } = options;
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
    if (populate && populate.length > 0) {
      populate.forEach((p) => (query = query.populate(p)));
    }

    const items = await query.exec();

    const result = new SearchResultDto<T>();
    result.items = items;
    result.total = typeof count === 'number' ? count : Number(count);
    return result;
  }
}

export default MongooseSearchQueryService;
