import { ArrayFormatType } from '../../enums';
import { Options, QueryParam } from '../../models';
import { NavigationExtras } from '@angular/router';
import * as queryString from 'query-string';

export class QueryUtil {
  static query(
    params: { [key: string]: QueryParam },
    arrayFormat: ArrayFormatType
  ): NavigationExtras {
    let queryParams = {};

    Object.keys(params).forEach(key => {
      queryParams = {
        ...queryParams,
        [key]: queryString.stringify(
          { [key]: params[key].values },
          QueryUtil.getOptionsForQueryParam(params[key], arrayFormat)
        )
      };
    });

    return { queryParams };
  }

  private static getOptionsForQueryParam(param: QueryParam, arrayFormat: ArrayFormatType): Options {
    return param.options ? param.options : { arrayFormat };
  }
}
