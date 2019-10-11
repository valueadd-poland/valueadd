import { NavigationExtras } from '@angular/router';

export interface RouterLink {
  extras?: NavigationExtras;
  path: string[];
  query?: object;
}
