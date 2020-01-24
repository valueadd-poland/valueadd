import { ArrowFunction, ObjectLiteralExpression, PropertyAssignment, SourceFile } from 'ts-morph';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';
import { RouteDeclaration } from '../interfaces/route-declaration.interface';
import { TypescriptApiUtil } from '../utils/typescript-api.util';

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

    if (TypescriptApiUtil.isStringLiteral(loadChildrenAssignment)) {
      // lazy loaded module import till v7
      return DataProvider.resolveLoadChildrenForV7AndBelow(loadChildrenAssignment);
    }

    if (TypescriptApiUtil.isArrowFunction(loadChildrenAssignment)) {
      // lazy loaded module import from v8 and Ivy
      return DataProvider.resolveLoadChildrenForIvy(loadChildrenAssignment);
    }
  }

  private static resolveLoadChildrenForV7AndBelow(
    loadChildrenAssignment: PropertyAssignment
  ): string {
    const lazyLoadedModulePath = TypescriptApiUtil.getStringValue(loadChildrenAssignment).split(
      '#'
    );
    const lazyLoadedModuleName = lazyLoadedModulePath[1];

    if (!lazyLoadedModuleName) {
      throw new Error(`Bad path detected: ${lazyLoadedModulePath.join('/')}`);
    }

    return lazyLoadedModuleName
      .split(/(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .filter(word => word !== 'module')
      .join('-')
      .concat('-routing.module.ts');
  }

  private static resolveLoadChildrenForIvy(loadChildrenAssignment: PropertyAssignment): string {
    const lazyLoadedModulePath = TypescriptApiUtil.getThenValueFromImportArrowFunction(
      loadChildrenAssignment.getInitializer() as ArrowFunction
    )
      .split(/([A-Z]?[^A-Z]*)/g)
      .filter(word => !!word && word !== 'Module' && word !== 'Feature');
    return lazyLoadedModulePath
      .map(word => word.toLowerCase())
      .join('-')
      .concat('-routing.module.ts');
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
