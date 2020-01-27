import { TestBed } from '@angular/core/testing';

import { LinkService } from './link.service';
import { LinkingToolModule } from '../linking-tool.module';
import { LinksMap, LinkType } from '../resources';
import { Params } from '@angular/router';

describe('LinkService', () => {
  const customLinkType = 'link';
  const customUrl = 'link';
  const linksMap: LinksMap = { [customLinkType]: customUrl };
  const linkType = {
    ...LinkType,
    [customLinkType]: customLinkType
  };
  let service: LinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkingToolModule.forRoot(linksMap, linkType)]
    });
    service = TestBed.get(LinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertParamsToQueryParamsString', () => {
    it('should return empty string if empty params passed in', () => {
      const params: Params = {};
      // @ts-ignore
      expect(service.convertParamsToQueryParamsString(params)).toBe('');
    });

    it('should return query params string with one value', () => {
      const params: Params = {
        param: 'param'
      };
      // @ts-ignore
      expect(service.convertParamsToQueryParamsString(params)).toBe('?param=param');
    });

    it('should return query params string with two values', () => {
      const params: Params = {
        param1: 'param1',
        param2: 'param2'
      };
      // @ts-ignore
      expect(service.convertParamsToQueryParamsString(params)).toBe('?param1=param1&param2=param2');
    });
  });

  describe('generateExternalUrlLink', () => {
    it('should return external url link', () => {
      const url = 'url';
      const link = service.generateExternalUrlLink(url);
      expect(link.type).toBe(LinkType.externalUrl);
      expect(link.params).toEqual({ url });
      expect(link.path).toBeUndefined();
    });
  });

  describe('init', () => {
    it('should set linksMap and linkType', () => {
      const newLinksMap = {};
      const newLinkType = { ...linkType, anotherLink: 'anotherLinkType' };
      service.init(newLinksMap, newLinkType);
      // @ts-ignore
      expect(service.linksMap).toBe(newLinksMap);
      // @ts-ignore
      expect(service.linkType).toBe(newLinkType);
    });
  });

  describe('resolveLinkUrl', () => {
    describe('default value', () => {
      it('should return "#" if link does not exists in linksMap', () => {
        expect(service.resolveLinkUrl({ type: 'notExistingLinkType' })).toBe('#');
      });

      it('should return "#" if empty link object passed in', () => {
        expect(service.resolveLinkUrl({})).toBe('#');
      });
    });

    describe('external url', () => {
      it('should return external url link if has protocol or is protocol relative', () => {
        const url = '//someUrl';
        const link = service.resolveLinkUrl({
          type: LinkType.externalUrl,
          params: { url }
        });
        expect(link).toBe(url);
      });

      it('should return external url link if does not have protocol or is not protocol relative', () => {
        const url = 'someUrl';
        const link = service.resolveLinkUrl({
          type: LinkType.externalUrl,
          params: { url }
        });
        expect(link).toBe(`//${url}`);
      });
    });

    describe('link with/without link type in linksMap', () => {
      it('should return url from linksMap', () => {
        expect(service.resolveLinkUrl({ type: customLinkType })).toBe(customUrl);
      });

      it('should return link path if linkType not exists in linksMap', () => {
        expect(service.resolveLinkUrl({ type: 'notExistingLinkType', path: 'somePath' })).toBe(
          'somePath'
        );
      });
    });

    describe('link with params', () => {
      beforeEach(() => {
        // @ts-ignore
        service.linksMap = { link: 'entity/:id' };
      });

      it('should return link with interpolated values', () => {
        expect(service.resolveLinkUrl({ type: customLinkType, params: { id: 'test' } })).toBe(
          'entity/test'
        );
      });

      it('should return link with interpolated values and anchor', () => {
        expect(
          service.resolveLinkUrl({ type: customLinkType, params: { id: 'test', anchor: 'anchor' } })
        ).toBe('entity/test#anchor');
      });

      it('should return link with interpolated values and query params', () => {
        expect(
          service.resolveLinkUrl({
            type: customLinkType,
            params: { id: 'test', queryParams: { param: 'param' } }
          })
        ).toBe('entity/test?param=param');
      });
    });
  });

  describe('resolveRouterLink', () => {
    it('should return routerL. ink if link type exists in linksMap', () => {
      expect(service.resolveRouterLink({ type: customLinkType })).toEqual({ path: [customUrl] });
    });

    it('should return routerLink if link type does not exist in linksMap', () => {
      expect(service.resolveRouterLink({ type: 'notExistingLinkType' })).toEqual({ path: ['#'] });
    });
  });

  describe('getRouterLink', () => {
    it('should return routerLink when no params in link', () => {
      // @ts-ignore
      expect(service.getRouterLink({ type: customLinkType })).toEqual({ path: [customUrl] });
    });

    describe('link with params', () => {
      beforeEach(() => {
        // @ts-ignore
        service.linksMap = { [customLinkType]: `${customUrl}/:id` };
      });

      it('should return routerLink with interpolated values', () => {
        // @ts-ignore
        expect(service.getRouterLink({ type: customLinkType, params: { id: 'test' } })).toEqual({
          path: [`${customUrl}/test`]
        });
      });

      it('should return routerLink with interpolated values and anchor', () => {
        expect(
          // @ts-ignore
          service.getRouterLink({ type: customLinkType, params: { id: 'test', anchor: 'anchor' } })
        ).toEqual({ path: [`${customUrl}/test`], extras: { fragment: 'anchor' } });
      });

      it('should return routerLink with interpolated values and skipLocationChange', () => {
        expect(
          service
            // @ts-ignore
            .getRouterLink({
              type: customLinkType,
              params: { id: 'test', skipLocationChange: true }
            })
        ).toEqual({
          path: [`${customUrl}/test`],
          extras: {
            skipLocationChange: true
          }
        });
      });

      it('should return routerLink with interpolated values and queryParams', () => {
        expect(
          // @ts-ignore
          service.getRouterLink({
            type: customLinkType,
            params: {
              id: 'test',
              queryParams: {
                param: 'param'
              }
            }
          })
        ).toEqual({
          path: [`${customUrl}/test`],
          query: {
            param: 'param'
          }
        });
      });
    });
  });
});
