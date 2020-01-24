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

  it('should return query params for array like passed arguments', () => {
    const params: Params = {
      param1: ['abc', 123],
      param2: 'param3'
    };
    expect(convertParamsToQueryParamsString(params)).toBe('?param1=abc&param1=123&param2=param3');
  });
});
