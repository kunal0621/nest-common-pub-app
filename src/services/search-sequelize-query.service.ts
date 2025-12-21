import { Injectable, Logger } from '@nestjs/common';
import { Operators } from '../constant-type/search-shared.constant';
import { IncludeOptions, Op, WhereOptions, Order } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { SearchCriteria, SearchPayload, SortConfig } from '../interfaces/search-payload.interface';
import { SearchResultDto } from '../dto/search/search-result.dto';

@Injectable()
export class SearchQueryService {
    private readonly logger = new Logger(SearchQueryService.name);  
    constructor() {}
    private readonly operatorsMap: Record<Operators, (values: string[]) => WhereOptions> = {
        [Operators.EQ]: (values) => ({ [Op.eq]: values[0] }),
        [Operators.NEQ]: (values) => ({ [Op.ne]: values[0] }),
        [Operators.GT]: (values) => ({ [Op.gt]: values[0] }),
        [Operators.GTE]: (values) => ({ [Op.gte]: values[0] }),
        [Operators.LT]: (values) => ({ [Op.lt]: values[0] }),
        [Operators.LTE]: (values) => ({ [Op.lte]: values[0] }),
        [Operators.LIKE]: (values) => ({ [Op.like]: `%${values[0]}%` }),
        [Operators.IN]: (values) => ({ [Op.in]: values }),
        [Operators.NOT_IN]: (values) => ({ [Op.notIn]: values }),
        [Operators.BETWEEN]: (values) => ({ [Op.between]: [values[0], values[1]] }),
        [Operators.NOT_BETWEEN]: (values) => ({ [Op.notBetween]: [values[0], values[1]] }),
        [Operators.ILIKE]: (values) => ({ [Op.iLike]: `%${values[0]}%` }),
    };

    private getSequelizeCondition(operator: Operators, values: string[]): WhereOptions {
        this.logger.debug(`Mapping operator ${operator} with values ${values}`);
        return this.operatorsMap[operator]?.(values) ?? { [Op.eq]: values[0] };
    }

    /**
     * Recursively builds the include tree for nested relationships/associations.
     * @param includes IncludeOptions array to populate
     * @param pathSegments path segments representing relationships
     * @param relatedEntities related entities mapping
     * @param nestedSelectedFields nested selected fields mapping
     * @param requiredJoins whether joins are required
     * @param schemaMapping schema mapping for models
     * @returns 
     */

    private buildIncludeTree(
        includes: IncludeOptions[],
        pathSegments: string[],
        relatedEntities: Record<string, ModelCtor>,
        nestedSelectedFields?: Record<string, string[]>,
        requiredJoins: boolean = true,
        schemaMapping?: Map<ModelCtor, string>, 
    ) {
        if (pathSegments.length === 0) {
            return;
        }
        const [relationship, ...rest] = pathSegments;
        
        let relationInclude = includes.find(inc => inc.as === relationship);
        if (!relationInclude) {
            if (!relatedEntities[relationship]) {
                throw new Error(`Relationship ${relationship} not found in related entities`);  
            }
            this.logger.log(`Building include for relationship: ${relationship}`);
            relationInclude = {
                model: relatedEntities[relationship].schema(schemaMapping?.get(relatedEntities[relationship]),
                ),
                as: relationship,
                required: requiredJoins,
                include: [],
                attributes: nestedSelectedFields?.[relationship] || undefined,
            };
            includes.push(relationInclude);
        }
        // Recursively build include tree for nested relationships/associations
        this.buildIncludeTree(
            relationInclude.include as IncludeOptions[],
            rest,
            relatedEntities,
            nestedSelectedFields,
            requiredJoins,
            schemaMapping,
        );
    }

    /**
     * Applies nested attributes to the include options based on nestedSelectedFields.
     * This allows selecting specific fields for nested relationships.
     * @param include The include options to modify
     * @param nestedSelectedFields nested selected fields mapping
     * How it works:
     * - Iterates over each entry in nestedSelectedFields.
     * - Splits the key by '.' to handle nested relationships.
     * - Traverses the include options to find the correct relationship.
     * - Sets the attributes for the final relationship in the path.
     */
    private applyNestedAttributes(
        include: IncludeOptions[],
        nestedSelectedFields: Record<string, string[]>
    ){
        Object.entries(nestedSelectedFields).forEach(([key, fields]) => {
            const segments = key.split('.');
            let currentIncludes = include;
            for (const segment of segments) {
                const includeObj = currentIncludes.find(i => i.as === segment);
                if (includeObj) {
                    if (segments[segments.length - 1] === segment) {
                        includeObj.attributes = fields;
                    }
                }
                currentIncludes = includeObj.include as IncludeOptions[];
            }
        });
    }

    /**
     * Builds query filters including where conditions and include options based on search criteria.
     * @param criteria requested search criteria
     * @param relatedEntities related entities mapping
     * @param defaultReqJoins default required joins flag
     * @param nestedSelectedFields nested selected fields mapping
     * @param schemaMapping schema mapping for models
     * @returns query filters including where conditions and include options
     */
    private buildQueryFilters(
        criteria: SearchCriteria[],
        relatedEntities: Record<string, ModelCtor>,
        defaultReqJoins: boolean,
        nestedSelectedFields?: Record<string, string[]>,
        schemaMapping?: Map<ModelCtor, string>,
    ): { where: WhereOptions, include: IncludeOptions[] } {
        const include: IncludeOptions[] = [];
        const where: WhereOptions = {};

        criteria.forEach(({field, operator, value, required} ) => {
            const segment = field.toString().split('.');
            if (segment.length === 1) {
                where[segment[0]] = this.getSequelizeCondition(operator, value);
            } else {
               const pathSegments = segment.slice(0, -1);
               const attribute = segment.slice(-1)[0];
               const condition = this.getSequelizeCondition(operator, value);

               let currentIncludes = include;
               pathSegments.forEach((segment, index) => {
                    let includeObj = currentIncludes.find(inc => inc.as === segment);
                    if (!includeObj) {
                        if (!relatedEntities[segment]) {
                            throw new Error(`Relationship ${segment} not found in related entities`);
                        }
                        includeObj = {
                            model: relatedEntities[segment].schema(schemaMapping.get(relatedEntities[segment])),
                            as: segment,
                            required: required ?? defaultReqJoins,
                            include: [],
                            where: index === pathSegments.length -1 ? { [attribute]: condition } : undefined,
                        };
                        currentIncludes.push(includeObj);
                    } else if (index === pathSegments.length -1) {
                        includeObj.where = { ...(includeObj.where || {}), [attribute]: condition};
                        includeObj.required = required ?? defaultReqJoins;
                    }
                    currentIncludes = includeObj.include as IncludeOptions[];
               });
            }
        });
        // Ensure join for all nested attributes are applied even if not in criteria
        if (nestedSelectedFields) {
            Object.keys(nestedSelectedFields).forEach((relation) => {
                const pathSegments = relation.split('.');
                this.buildIncludeTree(
                    include,
                    pathSegments,
                    relatedEntities,
                    undefined,
                    defaultReqJoins,
                    schemaMapping,
                );
            });
        }

        return { where, include};
    }

    /**
     * sort order config preparation
     * @param orderConfig defined sort config
     * @returns array of sort order configurations
     */

    private prepareSortOrderConfig(
        orderConfig: SortConfig[],
    ): Order | undefined {
        if(!orderConfig || orderConfig.length === 0){
            return undefined;
        }
        return orderConfig.map(({field, order}) => {
            const segments = field.split('.');
            if(segments.length > 1){
                return [
                    ...segments.slice(0, -1),
                    segments[segments.length -1],
                    order
                ] as Order;
            }
            return [field, order] as Order;
        }) as Order;
    }

    async searchQuery<T extends Model>(
        options: SearchPayload<T>,
        model: ModelCtor<T>,
    ): Promise<SearchResultDto<T>> {
        const defaultOptions: Partial<SearchPayload<T>> = {
            requiredJoins: true,
            isSubQuery: false,
            schemaMapping: new Map<ModelCtor<T>, string>(),
        };
        const mergedOptions = { ...defaultOptions, ...options };
        const {
            criteria,
            pagination,
            relatedEntities,
            parentSelectedFields,
            nestedSelectedFields,
            requiredJoins,
            isSubQuery,
            schemaMapping,
            orderBy,
            defaultOrder,
            groupBy,
        } = mergedOptions;

        const { where, include } = this.buildQueryFilters(
            criteria,
            relatedEntities,
            requiredJoins,
            nestedSelectedFields,
            schemaMapping,
        );

        if (nestedSelectedFields) {
            this.applyNestedAttributes(include, nestedSelectedFields);
        }

        const sortOrder = this.prepareSortOrderConfig(orderBy || defaultOrder);
        this.logger.debug(`Final where clause: ${JSON.stringify(where)}`);
        this.logger.debug(`Final include options: ${JSON.stringify(include)}`);
        this.logger.debug(`Final sort order: ${JSON.stringify(sortOrder)}`);

        const count = await model.count({ where, include, distinct: include.length > 0 });

        const results = await model.findAll({
            where,
            include,
            attributes: parentSelectedFields || undefined,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: isSubQuery,
            order: sortOrder,
            group: groupBy,
        });
        const searchResult = new SearchResultDto<T>();
        searchResult.items = results;
        searchResult.total = count;
        return searchResult;

    }
}
