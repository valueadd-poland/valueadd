import { Options } from './options.model';
import { QueryParamValues } from '../types';

export interface QueryParam {
  options?: Options;
  values: QueryParamValues;
}
