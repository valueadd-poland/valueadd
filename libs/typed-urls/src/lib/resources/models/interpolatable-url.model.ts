import { interpolate } from '../utils/interpolate/interpolate';

export class InterpolatableUrl<T extends string> {
  constructor(private _url: string) {}

  public url(params: Record<T, string | number>): string {
    return interpolate(this._url, params);
  }
}
