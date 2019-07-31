import { interpolate } from './interpolate';

describe('interpolate', () => {
  it('should interpolate value', () => {
    const testId = '2';
    const url = '/test/:testId';

    expect(interpolate(url, { testId })).toBe('/test/2');
  });
});
