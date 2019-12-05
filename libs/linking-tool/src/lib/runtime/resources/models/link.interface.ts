import { Params } from '@angular/router';

export interface Link<T = string> {
  params?: {
    anchor?: string;
    embedded?: { id: string };
    queryParams?: Params;
    skipLocationChange?: boolean;
    [key: string]: any;
  };
  path?: string;
  type?: T;
}
