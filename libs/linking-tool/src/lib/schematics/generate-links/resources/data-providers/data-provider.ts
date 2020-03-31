import {
  ArrowFunction,
  Expression,
  ImportDeclaration,
  ObjectLiteralExpression,
  Project,
  PropertyAccessExpression,
  PropertyAssignment,
  SourceFile
} from 'ts-morph';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';
import { RouteDeclaration } from '../interfaces/route-declaration.interface';
import { TypescriptApiUtil } from '../utils/typescript-api.util';
import { LoadChildren } from '../interfaces/load-children.interface';

export class DataProvider {
  private project: Project = null;

  getRouteDeclarations(source: SourceFile): RouteDeclaration[] {
    if (!this.project) {
      throw new Error('Using data provider without access to a project!');
    }
    if (!source) {
      throw new Error('Using method to resolve route declarations with no file!');
    }

    if (
      TypescriptApiUtil.isVariableDeclarationExisting(GenerateLinksProperty.Routes, source) &&
      TypescriptApiUtil.isArrayExpression(
        source.getVariableDeclaration(GenerateLinksProperty.Routes).getInitializer()
      )
    ) {
      const routesExpression = source
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();
      const imports = source.getImportDeclarations();

      return TypescriptApiUtil.getArrayExpression(routesExpression)
        .filter(TypescriptApiUtil.isObjectLiteralExpression)
        .map(expression =>
          this.resolveRouteDeclaration(expression as ObjectLiteralExpression, imports)
        );
    }

    return [];
  }

  setProject(project: Project): void {
    this.project = project;
  }

  private getLinkTypeValue(linkType: PropertyAccessExpression): string {
    return `${linkType.getExpression().getText()}.${linkType.getName()}`;
  }

  private resolveChildren(
    object: ObjectLiteralExpression,
    imports: ImportDeclaration[]
  ): RouteDeclaration[] {
    return TypescriptApiUtil.getArrayValue(
      TypescriptApiUtil.getPropertyAssignment(GenerateLinksProperty.Children, object)
    ).map(expression =>
      this.resolveRouteDeclaration(expression as ObjectLiteralExpression, imports)
    );
  }

  private resolveData(object: ObjectLiteralExpression): string {
    const propertyAssignment = TypescriptApiUtil.getPropertyAssignment(
      GenerateLinksProperty.Links,
      object
    );

    if (TypescriptApiUtil.isArrayValue(propertyAssignment)) {
      // links passed as an array
      const [link] = TypescriptApiUtil.getArrayValue(propertyAssignment);

      if (!link) {
        return '';
      }

      return this.getLinkTypeValue(link as PropertyAccessExpression);
    }

    return this.getLinkTypeValue(propertyAssignment.getInitializer() as PropertyAccessExpression);
  }

  private resolveLoadChildren(object: ObjectLiteralExpression): LoadChildren {
    const loadChildrenAssignment = TypescriptApiUtil.getPropertyAssignment(
      GenerateLinksProperty.LoadChildren,
      object
    );

    if (TypescriptApiUtil.isStringLiteral(loadChildrenAssignment)) {
      // lazy loaded module import till v7
      return this.resolveLoadChildrenFromStringImport(loadChildrenAssignment);
    }

    if (TypescriptApiUtil.isArrowFunction(loadChildrenAssignment)) {
      // lazy loaded module import from v8 and Ivy
      return this.resolveLoadChildrenFromDynamicImport(loadChildrenAssignment);
    }
  }

  private resolveLoadChildrenFromStringImport(
    loadChildrenAssignment: PropertyAssignment
  ): LoadChildren {
    const [path, lazyLoadedModuleName] = TypescriptApiUtil.getStringValue(
      loadChildrenAssignment
    ).split('#');

    if (!lazyLoadedModuleName) {
      throw new Error(`Bad path detected: ${path} when resolving loadChildren for module.`);
    }

    const splittedPath = path
      .split('/')
      .filter(
        el => el !== '.' && el !== '..' && el.indexOf('.module') === -1 && !el.startsWith('@')
      );

    return {
      moduleName: this.resolveRoutingModuleName(lazyLoadedModuleName),
      path: splittedPath.join('/')
    };
  }

  private resolveRoutingModuleName(moduleName: string): string {
    return moduleName
      .split(/(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .filter(word => word !== 'module')
      .join('-')
      .concat('-routing.module.ts');
  }

  private resolveLoadChildrenFromDynamicImport(
    loadChildrenAssignment: PropertyAssignment
  ): LoadChildren {
    const { thenBody, functionArguments } = TypescriptApiUtil.getArrowFunctionThenBodyWithArguments(
      loadChildrenAssignment.getInitializer() as ArrowFunction
    );

    return {
      moduleName: thenBody
        .split(/([A-Z]?[^A-Z]*)/g)
        .filter(word => !!word)
        .map(word => word.toLowerCase())
        .join('-')
        .concat('-routing.module.ts'),
      path: functionArguments
        .map(el => el.replace(/['"]+/g, ''))
        .join('')
        .split('/')
        .filter(el => !el.startsWith('@'))
        .join('/')
    };
  }

  private resolvePath(object: ObjectLiteralExpression): string {
    return TypescriptApiUtil.getStringValue(
      TypescriptApiUtil.getPropertyAssignment(GenerateLinksProperty.Path, object)
    );
  }

  private resolveRouteDeclaration(
    object: ObjectLiteralExpression,
    imports: ImportDeclaration[]
  ): RouteDeclaration {
    let result: RouteDeclaration = {
      path: ''
    };

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.Path, object)) {
      result = {
        ...result,
        path: this.resolvePath(object)
      };
    }

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.Children, object)) {
      result = {
        ...result,
        children: this.resolveChildren(object, imports)
      };
    }

    if (TypescriptApiUtil.isPropertyExisting(GenerateLinksProperty.LoadChildren, object)) {
      result = {
        ...result,
        loadChildren: this.resolveLoadChildren(object)
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
        linkType: this.resolveLinkTypeValue(object, imports)
      };
    }

    return result;
  }

  private resolveLinkTypeValue(
    object: ObjectLiteralExpression,
    imports: ImportDeclaration[]
  ): string {
    const [linkTypeEnumName, linkTypeEnumKey] = this.resolveData(
      TypescriptApiUtil.getObjectLiteralExpression(GenerateLinksProperty.Data, object)
    ).split('.');

    imports.forEach(declaration => {
      const moduleSpecifier = declaration.getModuleSpecifier().getText();
      const importedFiles = declaration.getNamedImports().map(nimp => nimp.getText());

      const linkTypeEnum = importedFiles.find(imp => imp === linkTypeEnumName);
      if (linkTypeEnum) {
        const file =
          this.project.getSourceFile(`${moduleSpecifier}/${linkTypeEnum}`) ||
          this.project.getSourceFile(linkTypeEnum);
        if (!file) {
          throw new Error(
            `Tried to find enum ${linkTypeEnumName} with path ${moduleSpecifier}, but did not success.`
          );
        }

        const enumsInFile = file.getEnums();
        if (!enumsInFile) {
          throw Error('Tried to find file with enum but not-enum file found.');
        }

        const searchedEnumWithValue = enumsInFile.find(en => en.getMember(linkTypeEnumKey));
        if (!searchedEnumWithValue) {
          throw new Error(
            `Tried to find an enum ${linkTypeEnum}.${linkTypeEnumKey} value, but did not success.`
          );
        }

        return (searchedEnumWithValue
          .getMember(linkTypeEnumKey)
          .getInitializer() as Expression).getText();
      }
    });

    console.warn(`No imported enum found (searched for ${linkTypeEnumName}).`);
    return '';
  }
}
