import { UrlKey } from '../../../../shared/consts/url-key.const';

export interface LinkTypeTree {
  [key: string]: LinkTypeTree | { [UrlKey]: string };
}
