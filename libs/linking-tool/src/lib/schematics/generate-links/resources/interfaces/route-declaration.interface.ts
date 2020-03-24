import { LoadChildren } from './load-children.interface';

export interface RouteDeclaration {
  path: string;
  children?: RouteDeclaration[];
  linkType?: string;
  loadChildren?: LoadChildren;
}
