import { interpolate } from './interpolate';
import { hasProtocolOrIsProtocolRelative } from './has-protocol-or-is-protocol-relative';
import { convertParamsToQueryParamsString } from './convert-params-to-query-params-string.util';

export const utils = {
  convertParamsToQueryParamsString,
  hasProtocolOrIsProtocolRelative,
  interpolate
};
