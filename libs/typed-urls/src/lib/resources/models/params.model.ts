import { QueryParam } from './query-param.model';

export interface Params {
  urlParams: string;
  fragment?: string;
  queryParams?: QueryParam[];
}
