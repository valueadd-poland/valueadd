import { Params } from '@angular/router';

export function convertParamsToQueryParamsString(params: Params): string {
  let result = '?';
  Object.keys(params).forEach((key: string) => {
    if (Array.isArray(params[key])) {
      const paramsValues = params[key] as any[];
      paramsValues.forEach(paramValue => {
        result += `${key}=${paramValue}&`;
      });
    } else {
      result += `${key}=${params[key]}&`;
    }
  });

  return result.slice(0, -1);
}
