import { DataProvider } from './data-provider';
import 'jasmine';

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
});
