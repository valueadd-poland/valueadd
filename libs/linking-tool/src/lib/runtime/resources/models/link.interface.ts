import { LinkParams } from './link-params.interface';

export interface Link<T = string> {
  params?: LinkParams;
  path?: string;
  type?: T;
}
