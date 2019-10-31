// See https://www.npmjs.com/package/query-string#options for details
export interface Options {
  arrayFormat: ArrayFormat;
  sort?: Function | boolean;
  parseNumbers?: boolean;
  parseBooleans?: boolean;
}

export type ArrayFormat = 'bracket' | 'index' | 'comma' | 'none';
