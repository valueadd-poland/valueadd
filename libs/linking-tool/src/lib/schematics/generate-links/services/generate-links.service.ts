import { Project } from 'ts-morph';
import { DataProvider } from '../resources/data-providers/data-provider';
import { LinkTypeMap } from '../resources/interfaces/link-type-map.interface';
import { RouteDeclaration } from '../resources/interfaces/route-declaration.interface';
import { CommonUtil } from '../resources/utils/common.util';

export class GenerateLinksService {
  private linksMap: LinkTypeMap = {};
  private project: Project;

  constructor() {
    this.initProject();
  }

  generateLinksMap(): string {
    this.project
      .getSourceFiles()
      .filter(CommonUtil.isValidRoutingModule)
      .forEach(source => {
        const routeDeclarations = DataProvider.getRouteDeclarations(source);
        this.resolveLink('', routeDeclarations);
      });

    return JSON.stringify(this.linksMap);
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

  private resolveLink(pathFromRoot: string, routes: RouteDeclaration[]): void {
    routes.forEach(route => {
      const path = route.path ? `/${route.path}` : '';
      if (route.linkType) {
        this.addToLinkMap(pathFromRoot.concat(path), route.linkType);
      }

      if (route.children && route.children.length) {
        this.resolveLink(pathFromRoot.concat(path), route.children);
      }

      if (route.loadChildren) {
        const moduleFile = this.project.getSourceFile(route.loadChildren);
        if (!moduleFile) {
          throw Error(`Can't find module ${route.loadChildren}`);
        }
        this.resolveLink(pathFromRoot.concat(path), DataProvider.getRouteDeclarations(moduleFile));
      }
    });
  }
}
