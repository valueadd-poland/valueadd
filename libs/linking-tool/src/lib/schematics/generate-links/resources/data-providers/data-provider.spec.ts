import { DataProvider } from './data-provider';
// import 'jasmine';
import { ObjectLiteralExpression, Project } from 'ts-morph';
import { TypescriptApiUtil } from '../utils/typescript-api.util';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';

describe('DataProvider', () => {
  describe('resolveRoutingModuleName', () => {
    it('should return valid routing module file name', () => {
      expect((DataProvider as any).resolveRoutingModuleName('SimpleModule')).toContain(
        'simple-routing.module'
      );
    });
    it('should return routing module file name with TS extension', () => {
      expect((DataProvider as any).resolveRoutingModuleName('SimpleModule')).toContain('.ts');
    });
    it('should be case sensitive', () => {
      expect((DataProvider as any).resolveRoutingModuleName('SiMpleMoDUle')).not.toBe(
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
        (DataProvider as any).resolveData(
          TypescriptApiUtil.getObjectLiteralExpression(
            GenerateLinksProperty.Data,
            objectLiteralExpression
          )
        )
      ).toEqual('testLink');
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
        (DataProvider as any).resolveLoadChildrenFromStringImport(
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
        (DataProvider as any).resolveLoadChildrenFromDynamicImport(
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
});
