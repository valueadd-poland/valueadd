import { Params } from '@angular/router';

export interface LinkParams {
  anchor?: string;
  embedded?: { id: string };
  queryParams?: Params;
  skipLocationChange?: boolean;
  url?: string;
  id?: string;
}