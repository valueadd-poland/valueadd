import { ArrayFormatType } from '../enums';
import { urlFactory } from '../utils/url-factory';

describe('InterpolatableUrl', () => {
  describe('query', () => {
    it('should return NavigationExtras with provided params', () => {
      const result = urlFactory<{
        urlParams: 'id' | 'test';
        queryParams: 'firstId' | 'secondId';
      }>('url/:id', true).query({
        firstId: {
          options: {
            arrayFormat: ArrayFormatType.Comma
          },
          values: [1, 2, 3]
        },
        secondId: {
          values: ['test1', 'test2']
        }
      });

      expect(result.queryParams).toEqual({
        firstId: 'firstId=1,2,3',
        secondId: 'secondId=test1&secondId=test2'
      });
    });
  });
});
