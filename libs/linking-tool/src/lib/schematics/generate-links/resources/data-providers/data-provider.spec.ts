import { DataProvider } from './data-provider';
// import 'jasmine';
import { ObjectLiteralExpression, Project } from 'ts-morph';
import { TypescriptApiUtil } from '../utils/typescript-api.util';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';

describe('DataProvider', () => {
  describe('resolveRoutingModuleName', () => {
    it('should return valid routing module file name', () => {
      expect((new DataProvider() as any).resolveRoutingModuleName('SimpleModule')).toContain(
        'simple-routing.module'
      );
    });
    it('should return routing module file name with TS extension', () => {
      expect((new DataProvider() as any).resolveRoutingModuleName('SimpleModule')).toContain('.ts');
    });
    it('should be case sensitive', () => {
      expect((new DataProvider() as any).resolveRoutingModuleName('SiMpleMoDUle')).not.toBe(
        'simple-routing.module.ts'
      );
    });
  });

  describe('resolveData', () => {
    it('returns data.links value', () => {
      const testLinkValue = 'someValue';
      const enumFile = `
      export enum LinkType {
        testLink: ${testLinkValue}
      }`;
      const file = `
      export const routes = [
        {
          path: 'to-do',
          loadChildren: './modules/to-do-dashboard/to-do-dashboard.module#ToDoDashboardModule',
          data: {
            links: LinkType.testLink'
          }
        }
      ];`;
      const project = new Project({ useVirtualFileSystem: true });
      const sourceFile = project.createSourceFile('file.ts', file);
      sourceFile.saveSync();
      project.createSourceFile('link-type.enum.ts', enumFile).saveSync();

      const routesExpression = sourceFile
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      const [objectLiteralExpression] = TypescriptApiUtil.getArrayExpression(
        routesExpression
      ).filter(TypescriptApiUtil.isObjectLiteralExpression) as ObjectLiteralExpression[];

      expect(
        (new DataProvider() as any).resolveData(
          TypescriptApiUtil.getObjectLiteralExpression(
            GenerateLinksProperty.Data,
            objectLiteralExpression
          )
        )
      ).toEqual('LinkType.testLink');
    });
  });

  describe('resolveLoadChildrenFromStringImport', () => {
    it('returns routing module name with path object', () => {
      const file = `
      export const routes = [
        {
          path: 'to-do',
          loadChildren: './modules/to-do-dashboard/to-do-dashboard.module#ToDoDashboardModule'
        }
      ];`;
      const project = new Project({ useVirtualFileSystem: true });
      const sourceFile = project.createSourceFile('file.ts', file);
      sourceFile.saveSync();

      const routesExpression = sourceFile
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      const [objectLiteralExpression] = TypescriptApiUtil.getArrayExpression(
        routesExpression
      ).filter(TypescriptApiUtil.isObjectLiteralExpression) as ObjectLiteralExpression[];

      expect(
        (new DataProvider() as any).resolveLoadChildrenFromStringImport(
          TypescriptApiUtil.getPropertyAssignment(
            GenerateLinksProperty.LoadChildren,
            objectLiteralExpression
          )
        )
      ).toEqual({
        moduleName: 'to-do-dashboard-routing.module.ts',
        path: 'modules/to-do-dashboard'
      });
    });
  });

  describe('resolveLoadChildrenFromDynamicImport', () => {
    it('returns routing module name with path object', () => {
      const file = `
      export const routes = [
        {
          path: '',
          loadChildren: () =>
            import('@cps/admin/customer/customers/feature').then(
             module => module.AdminCustomerCustomersFeatureModule
            )
        }
      ];`;
      const project = new Project({ useVirtualFileSystem: true });
      const sourceFile = project.createSourceFile('file.ts', file);
      sourceFile.saveSync();

      const routesExpression = sourceFile
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      const [objectLiteralExpression] = TypescriptApiUtil.getArrayExpression(
        routesExpression
      ).filter(TypescriptApiUtil.isObjectLiteralExpression) as ObjectLiteralExpression[];

      expect(
        (new DataProvider() as any).resolveLoadChildrenFromDynamicImport(
          TypescriptApiUtil.getPropertyAssignment(
            GenerateLinksProperty.LoadChildren,
            objectLiteralExpression
          )
        )
      ).toEqual({
        moduleName: 'admin-customer-customers-feature-module-routing.module.ts',
        path: 'admin/customer/customers/feature'
      });
    });
  });

  describe('resolveRouteDeclaration', () => {
    let project: Project;
    let dataProvider: DataProvider;

    beforeEach(() => {
      project = new Project({ useVirtualFileSystem: true });
      dataProvider = new DataProvider();
      dataProvider.setProject(project);
    });

    it('returns an array with linkType enum value when data.links passed as an array', () => {
      const en = `
      export enum LinkType {
        test: 'test'
      }`;
      const file = `
      import { LinkType } from './link-type.enum';

      export const routes = [
        {
          path: '',
          data: {
            links: [LinkType.test]
          }
        }
      ];`;
      const sourceFile = project.createSourceFile('file.ts', file);
      const enumFile = project.createSourceFile('link-type.enum.ts', en);
      sourceFile.saveSync();
      enumFile.saveSync();

      const routesExpression = sourceFile
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      const [objectLiteralExpression] = TypescriptApiUtil.getArrayExpression(
        routesExpression
      ).filter(TypescriptApiUtil.isObjectLiteralExpression) as ObjectLiteralExpression[];

      expect(
        (new DataProvider() as any).resolveRouteDeclaration(objectLiteralExpression, [])
      ).toEqual({
        path: '',
        linkType: 'LinkType.test'
      });
    });

    it('returns an array with linkType enum value when data.links passed as pure value', () => {
      const en = `
      export enum LinkType {
        test: 'test'
      }`;
      const source = `
      import { LinkType } from './link-type.enum';

      export const routes = [
        {
          path: '',
          data: {
            links: LinkType.test
          }
        }
      ];`;
      const sourceFile = project.createSourceFile('file.ts', source);
      const enumFile = project.createSourceFile('link-type.enum.ts', en);
      sourceFile.saveSync();
      enumFile.saveSync();

      const routesExpression = sourceFile
        .getVariableDeclaration(GenerateLinksProperty.Routes)
        .getInitializer();

      const [objectLiteralExpression] = TypescriptApiUtil.getArrayExpression(
        routesExpression
      ).filter(TypescriptApiUtil.isObjectLiteralExpression) as ObjectLiteralExpression[];

      expect(
        (dataProvider as any).resolveRouteDeclaration(
          objectLiteralExpression,
          sourceFile.getImportDeclarations()
        )
      ).toEqual({
        path: '',
        linkType: 'LinkType.test'
      });
    });
  });
});
