import { QueryUtil } from './query.util';
import { Options } from '../../models';
import { ArrayFormatType } from '../../enums';

describe('QueryUtil', () => {
  describe('getOptionsForQueryParam', () => {
    it('should return default options if no options provided', () => {
      const providedDefaultArrayFormat = ArrayFormatType.None;
      expect(
        (QueryUtil as any).getOptionsForQueryParam({ values: [] }, providedDefaultArrayFormat)
      ).toEqual({ arrayFormat: providedDefaultArrayFormat });
    });

    it('should return provided options', () => {
      const providedOptions: Options = {
        arrayFormat: ArrayFormatType.None
      };
      expect(
        (QueryUtil as any).getOptionsForQueryParam(
          { options: providedOptions, values: [] },
          ArrayFormatType.None
        )
      ).toEqual(providedOptions);
    });
  });
});
