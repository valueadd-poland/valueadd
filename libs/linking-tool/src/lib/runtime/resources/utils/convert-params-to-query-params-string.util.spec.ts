import { Params } from '@angular/router';
import { convertParamsToQueryParamsString } from './convert-params-to-query-params-string.util';

describe('convertParamsToQueryParamsString', () => {
  it('should return empty string if empty params passed in', () => {
    const params: Params = {};
    expect(convertParamsToQueryParamsString(params)).toBe('');
  });

  it('should return query params string with one value', () => {
    const params: Params = {
      param: 'param'
    };
    expect(convertParamsToQueryParamsString(params)).toBe('?param=param');
  });

  it('should return query params string with two values', () => {
    const params: Params = {
      param1: 'param1',
      param2: 'param2'
    };
    expect(convertParamsToQueryParamsString(params)).toBe('?param1=param1&param2=param2');
  });
});
