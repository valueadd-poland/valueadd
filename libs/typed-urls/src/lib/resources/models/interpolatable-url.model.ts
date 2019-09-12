import { interpolate } from '../utils/interpolate/interpolate';
import { UrlParams } from './url-params.model';

export class InterpolatableUrl<T extends string> {
  constructor(private _url: string) {}

  url(params: UrlParams<T>): string {
    return interpolate(this._url, params);
  }
}
