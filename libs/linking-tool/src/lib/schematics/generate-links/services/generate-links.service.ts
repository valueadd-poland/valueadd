import { Project, SourceFile } from 'ts-morph';
import { DataProvider } from '../resources/data-providers/data-provider';
import { LinkTypeMap } from '../resources/interfaces/link-type-map.interface';
import { RouteDeclaration } from '../resources/interfaces/route-declaration.interface';
import { CommonUtil } from '../resources/utils/common.util';
import { LinkTypeTree } from '../resources/interfaces/link-type-tree.interface';
import { RouteUtil } from '../resources/utils/route.util';
import { ResultType } from '../resources/enums/result-type.enum';
import { UrlKey } from '../../../shared/consts/url-key.const';

export class GenerateLinksService {
  private linksMap: LinkTypeMap = {};
  private linksTree: LinkTypeTree = {};
  private project: Project;
  private resultType: ResultType;

  constructor() {
    this.initProject();
  }

  generateLinks(resultType: ResultType): string {
    this.resultType = resultType;

    this.project
      .getSourceFiles()
      .filter(CommonUtil.isValidRoutingModule)
      .forEach(source => {
        const routeDeclarations = DataProvider.getRouteDeclarations(source);
        this.resolveLink('', routeDeclarations);
      });

    return JSON.stringify(resultType === ResultType.Map ? this.linksMap : this.linksTree);
  }

  private addToLinkMap(path: string, linkType: string): void {
    if (!this.linksMap[linkType]) {
      this.linksMap[linkType] = path;
    }
  }

  private initProject(): void {
    this.project = new Project();
    this.project.addExistingSourceFiles('./**/*-routing.module.ts');
  }

  private resolveLink(
    pathFromRoot: string,
    routes: RouteDeclaration[],
    parentLinkTypes: string[] = []
  ): void {
    routes.forEach(route => {
      const path = route.path ? `/${route.path}` : '';

      if (RouteUtil.hasLinkType(route)) {
        this.resolveLinkType(path, pathFromRoot, parentLinkTypes, route);
      }

      if (RouteUtil.hasChildren(route)) {
        this.resolveLink(
          pathFromRoot.concat(path),
          route.children,
          RouteUtil.getParentLinkTypesForRoute(parentLinkTypes, route)
        );
      }

      if (RouteUtil.hasLoadChildren(route)) {
        const childrenModule = this.project.getSourceFile(f => {
          return (
            f.getBaseName() === route.loadChildren.moduleName &&
            f.getDirectoryPath().indexOf(route.loadChildren.path) !== -1
          );
        });

        if (!childrenModule) {
          throw new Error(`Child module ${route.loadChildren.moduleName} not found!`);
        }

        this.resolveLink(
          pathFromRoot.concat(path),
          DataProvider.getRouteDeclarations(childrenModule as SourceFile),
          RouteUtil.getParentLinkTypesForRoute(parentLinkTypes, route)
        );
      }
    });
  }

  private resolveLinkType(
    path: string,
    pathFromRoot: string,
    parentLinkTypes: string[],
    route: RouteDeclaration
  ): void {
    if (this.resultType === ResultType.Map) {
      this.addToLinkMap(pathFromRoot.concat(path), route.linkType);
    }
    if (this.resultType === ResultType.Tree) {
      this.resolvePathInTree(path, pathFromRoot, route, parentLinkTypes);
    }
  }

  private resolvePathInTree(
    path: string,
    pathFromParent: string,
    route: RouteDeclaration,
    parentLinkTypes: string[]
  ): void {
    let linksTree = this.linksTree;

    parentLinkTypes.forEach(linkType => {
      linksTree = (linksTree[linkType] as LinkTypeTree) || { [linkType]: {} };
    });

    if (!RouteUtil.isRouteExistingInTree(route, linksTree)) {
      linksTree[route.linkType] =
        RouteUtil.hasChildren(route) || RouteUtil.hasLoadChildren(route)
          ? path
            ? { [UrlKey]: pathFromParent.concat(path) }
            : {}
          : { [UrlKey]: pathFromParent.concat(path) };
    }
  }
}
