export interface RouteDeclaration {
  path: string;
  children?: RouteDeclaration[];
  linkType?: string;
  loadChildren?: string;
}
