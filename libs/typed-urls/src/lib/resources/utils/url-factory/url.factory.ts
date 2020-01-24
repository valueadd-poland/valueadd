import { InterpolatableUrl, Params, Url } from '../../models';

export function urlFactory(url: string, interpolatable?: false): Url;
export function urlFactory<T extends Params>(
  url: string,
  interpolatable: true
): InterpolatableUrl<T>;
export function urlFactory<T extends Params>(
  url: string,
  interpolatable = false
): InterpolatableUrl<T> | Url {
  return interpolatable ? new InterpolatableUrl<T>(url) : new Url(url);
}
