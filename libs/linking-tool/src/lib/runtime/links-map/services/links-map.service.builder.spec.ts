import { LinksMapServiceBuilder } from './links-map.service.builder';
import { LinksMapService } from './links-map.service';
import { LinkType } from '../../resources/enums/link-type.enum';

describe('LinksMapServiceBuilder', () => {
  const linksMap = { link: 'link' };
  const linkType = { ...LinkType, link: 'link' };
  let serviceBuilder: LinksMapServiceBuilder;

  beforeEach(() => {
    serviceBuilder = new LinksMapServiceBuilder();
  });

  it('should be created', () => {
    expect(serviceBuilder).toBeTruthy();
  });

  it('should contain default LinkType enum', () => {
    // @ts-ignore
    expect(serviceBuilder.linkType).toBe(LinkType);
  });

  describe('build', () => {
    it('should return LinksMapService instance with linksMap and linkType', () => {
      const linksMapService = new LinksMapService();
      // @ts-ignore
      linksMapService.linksMap = linksMap;
      // @ts-ignore
      linksMapService.linkType = linkType;

      // @ts-ignore
      serviceBuilder.linksMap = linksMap;
      // @ts-ignore
      serviceBuilder.linkType = linkType;

      expect(serviceBuilder.build()).toEqual(linksMapService);
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
