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

function test() {
  const url = urlFactory<{
    urlParams: 'id' | 'test';
    fragment: 'someFragment';
    queryParams: [
      {
        id: 'someId';
        options: {
          arrayFormat: 'none';
        };
        values: [];
      }
    ];
  }>('url/:id', true).url({ id: 'test', test: 'test', fragment: 'someFragment', queryParams: [] });
}

test();
