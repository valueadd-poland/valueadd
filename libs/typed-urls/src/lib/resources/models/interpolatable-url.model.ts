import { Params } from './params.model';
import { QueryParam } from './query-param.model';
import { interpolate } from '../utils/interpolate';
import { NavigationExtras } from '@angular/router';
import { Inject, Optional } from '@angular/core';
import { ARRAY_FORMAT_TYPE } from '../tokens';
import { ArrayFormatType } from '../enums';
import { QueryUtil } from '../utils/query/query.util';
import { FragmentUtil } from '../utils/fragment/fragment';

export class InterpolatableUrl<T extends Params> {
  constructor(
    private apiUrl: string,
    @Inject(ARRAY_FORMAT_TYPE)
    @Optional()
    private arrayFormatType: ArrayFormatType = ArrayFormatType.None
  ) {}

  fragment(params: Record<'fragment', string>): NavigationExtras {
    return FragmentUtil.fragment(params);
  }

  url(params: Record<T['urlParams'], string>): string {
    return interpolate(this.apiUrl, params);
  }

  query(params: { [key in keyof Record<T['queryParams'], string>]: QueryParam }): NavigationExtras {
    return QueryUtil.query(params, this.arrayFormatType);
  }
}
