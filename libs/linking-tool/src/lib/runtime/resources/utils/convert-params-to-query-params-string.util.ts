import { Params } from '@angular/router';

export function convertParamsToQueryParamsString(params: Params): string {
  let result = '?';
  Object.keys(params).forEach((key: string) => {
    result += `${key}=${params[key]}&`;
  });

  return result.slice(0, -1);
}
