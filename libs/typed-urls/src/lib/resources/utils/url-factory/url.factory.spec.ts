import { urlFactory } from './url.factory';
import { Url } from '../../models';

describe('UrlFactory', () => {
  it('should return Url', () => {
    const url = urlFactory('testUrl');

    expect(url instanceof Url).toBeTruthy();
  });
});
