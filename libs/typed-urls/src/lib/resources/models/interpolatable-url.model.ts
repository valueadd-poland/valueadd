import { Params } from './params.model';
import { QueryParam } from './query-param.model';
import { interpolate } from '../utils/interpolate';

export class InterpolatableUrl<T extends Params> {
  constructor(private apiUrl: string) {}

  url(
    params: Record<T['urlParams'], string> &
      Record<keyof Omit<T, 'urlParams' | 'queryParams'>, string> &
      Record<keyof Omit<T, 'urlParams' | 'fragment'>, QueryParam[]>
  ): string {
    const urlParams: Record<T['urlParams'], string> = params;
    return interpolate(this.apiUrl, urlParams);
  }
}
