// See https://www.npmjs.com/package/query-string#options for details
import { ArrayFormatType } from '../enums';

export interface Options {
  arrayFormat: ArrayFormatType;
  sort?: false | ((itemLeft: string, itemRight: string) => number);
  parseNumbers?: boolean;
  parseBooleans?: boolean;
}
