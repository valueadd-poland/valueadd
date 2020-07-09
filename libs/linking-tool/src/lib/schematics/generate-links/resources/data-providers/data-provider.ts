import { ArrowFunction, ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';
import { RouteDeclaration } from '../interfaces/route-declaration.interface';
import { TypescriptApiUtil } from '../utils/typescript-api.util';
import { AngularUtil } from '../utils/angular.util';

export class DataProvider {
  static getRouteDeclarations(source: SourceFile): RouteDeclaration[] {
    if (
      TypescriptApiUtil.isVariableDeclarationExisting(GenerateLinksProperty.Routes, source) &&
      TypescriptApiUtil.isArrayExpression(
        source.getVariableDeclaration(GenerateLinksProperty.Routes).getInitializer()
      )
    ) {
      const routesExpression = source
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      return TypescriptApiUtil.getArrayExpression(routesExpression)
        .filter(TypescriptApiUtil.isObjectLiteralExpression)
        .map(expression =>
          DataProvider.resolveRouteDeclaration(expression as ObjectLiteralExpression)
        );
    }

    return [];
  }

  private static resolveChildren(object: ObjectLiteralExpression): RouteDeclaration[] {
    return TypescriptApiUtil.getArrayValue(
      TypescriptApiUtil.getPropertyAssignment(GenerateLinksProperty.Children, object)
    ).map(expression =>
      DataProvider.resolveRouteDeclaration(expression as ObjectLiteralExpression)
    );
  }

  private static resolveData(object: ObjectLiteralExpression): string {
    const propertyAssignment = TypescriptApiUtil.getPropertyAssignment(
      GenerateLinksProperty.Links,
      object
    );

    if (TypescriptApiUtil.isArrayValue(propertyAssignment)) {
      // links passed as an array
      const linksArray = TypescriptApiUtil.getArrayValue(propertyAssignment);
      return !!linksArray.length ? TypescriptApiUtil.getPropertyName(linksArray[0]) : '';
    }

    return TypescriptApiUtil.getStringValue(propertyAssignment);
  }

  private static resolveLoadChildren(object: ObjectLiteralExpression): string {
    const loadChildrenAssignment = TypescriptApiUtil.getPropertyAssignment(
      GenerateLinksProperty.LoadChildren,
      object
    );
    let lazyLoadedModulePath: string[] = [];
    let lazyLoadedModuleName = '';

    if (TypescriptApiUtil.isStringLiteral(loadChildrenAssignment)) {
      // lazy loaded module import till v7
      lazyLoadedModulePath = TypescriptApiUtil.getStringValue(loadChildrenAssignment).split('#');
      lazyLoadedModuleName = lazyLoadedModulePath[1];
    }

    if (TypescriptApiUtil.isArrowFunction(loadChildrenAssignment)) {
      // lazy loaded module import from v8 and Ivy
      lazyLoadedModuleName = AngularUtil.getLazyLoadedModuleName(
        loadChildrenAssignment.getInitializer() as ArrowFunction
      );
    }

    if (!lazyLoadedModuleName) {
      throw new Error(`Bad path detected: ${lazyLoadedModulePath.join('/')}`);
    }

    return (
      lazyLoadedModuleName
        .split(/(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .filter(word => word !== 'module')
        .join('-') + '-routing.module.ts'
    );
  }

  private static resolvePath(object: ObjectLiteralExpression): string {
    return TypescriptApiUtil.getStringValue(
      TypescriptApiUtil.getPropertyAssignment(GenerateLinksProperty.Path, object)
    );
  }

  private static resolveRouteDeclaration(object: ObjectLiteralExpression): RouteDeclaration {
    let result: RouteDeclaration = {
      path: ''
    };

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.Path, object)) {
      result = {
        ...result,
        path: DataProvider.resolvePath(object)
      };
    }

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.Children, object)) {
      result = {
        ...result,
        children: DataProvider.resolveChildren(object)
      };
    }

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.LoadChildren, object)) {
      result = {
        ...result,
        loadChildren: DataProvider.resolveLoadChildren(object)
      };
    }

    if (
      TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.Data, object) &&
      TypescriptApiUtil.isPropertyExisting(
        GenerateLinksProperty.Links,
        TypescriptApiUtil.getObjectLiteralExpression(GenerateLinksProperty.Data, object)
      )
    ) {
      result = {
        ...result,
        linkType: DataProvider.resolveData(
          TypescriptApiUtil.getObjectLiteralExpression(GenerateLinksProperty.Data, object)
        )
      };
    }

    return result;
  }
}
