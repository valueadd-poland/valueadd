import { RouteDeclaration } from '../interfaces/route-declaration.interface';
import { LinkTypeTree } from '../interfaces/link-type-tree.interface';

export class RouteUtil {
  static getParentLinkTypesForRoute(parentLinkTypes: string[], route: RouteDeclaration): string[] {
    return route.linkType ? [...parentLinkTypes, route.linkType] : parentLinkTypes;
  }

  static hasChildren(route: RouteDeclaration): boolean {
    return route.children && !!route.children.length;
  }

  static hasLoadChildren(route: RouteDeclaration): boolean {
    return !!route.loadChildren;
  }

  static hasLinkType(route: RouteDeclaration): boolean {
    return !!route.linkType;
  }

  static isRouteExistingInTree(route: RouteDeclaration, linksTree: LinkTypeTree): boolean {
    return !!(
      typeof linksTree[route.linkType] === 'string' ||
      (typeof linksTree[route.linkType] !== 'undefined' &&
        Object.keys(linksTree[route.linkType]).length)
    );
  }
}
