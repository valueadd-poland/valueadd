import { LinkServiceBuilder } from './link.service.builder';
import { LinkType } from '../resources/enums';
import { LinkService } from './link.service';

describe('LinkServiceBuilder', () => {
  const linksMap = { link: 'link' };
  const linkType = { ...LinkType, link: 'link' };
  let serviceBuilder: LinkServiceBuilder;

  beforeEach(() => {
    serviceBuilder = new LinkServiceBuilder();
  });

  it('should be created', () => {
    expect(serviceBuilder).toBeTruthy();
  });

  it('should contain default LinkType enum', () => {
    // @ts-ignore
    expect(serviceBuilder.linkType).toBe(LinkType);
  });

  describe('build', () => {
    it('should return LinkService instance with linksMap and linkType', () => {
      const linkService = new LinkService();
      // @ts-ignore
      linkService.linksMap = linksMap;
      // @ts-ignore
      linkService.linkType = linkType;

      // @ts-ignore
      serviceBuilder.linksMap = linksMap;
      // @ts-ignore
      serviceBuilder.linkType = linkType;

      expect(serviceBuilder.build()).toEqual(linkService);
    });
  });

  describe('setLinksMap', () => {
    it('should set linksMap and return current builder instance', () => {
      expect(serviceBuilder.setLinksMap(linksMap)).toBe(serviceBuilder);
      // @ts-ignore
      expect(serviceBuilder.linksMap).toEqual(linksMap);
    });
  });

  describe('setLinkType', () => {
    it('should set linkType and return current builder instance', () => {
      expect(serviceBuilder.setLinkType(linkType)).toBe(serviceBuilder);
      // @ts-ignore
      expect(serviceBuilder.linkType).toEqual(linkType);
    });
  });
});
