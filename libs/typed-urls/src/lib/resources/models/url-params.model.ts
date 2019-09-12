import { QueryParams } from './query-params.model';

export class UrlParams<T extends string> {
  params: Record<T | string, number>;
  fragment: Record<T | string, number>;
  queryParams: QueryParams<T>[];
}
