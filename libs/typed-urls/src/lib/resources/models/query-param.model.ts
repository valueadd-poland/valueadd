import { Options } from '@valueadd/typed-urls';

export interface QueryParam {
  id: string;
  options: Options;
  values: (string | boolean | number)[];
}
