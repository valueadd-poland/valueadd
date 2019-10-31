import { NavigationExtras } from '@angular/router';

export class FragmentUtil {
  static fragment(params: Record<'fragment', string>): NavigationExtras {
    let fragment = {};
    Object.keys(params).forEach(key => {
      if (key === 'fragment') {
        fragment = { [key]: `#${params[key]}` };
      }
    });
    return fragment;
  }
}
