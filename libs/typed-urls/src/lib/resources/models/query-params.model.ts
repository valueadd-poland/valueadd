import { QueryParamsType } from './query-params-type.model';

export class QueryParams<T extends string> {
  id: Record<T | string, number>;
  type: QueryParamsType;
  values: Array<string | number | boolean>;
}
