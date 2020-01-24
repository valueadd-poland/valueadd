import { LinksTreeServiceBuilder } from './links-tree.service.builder';
import { LinksTreeService } from './links-tree.service';
import { UrlKey } from '../../../shared/consts/url-key.const';
import { LinkType } from '../../resources/enums/link-type.enum';

describe('LinksTreeServiceBuilder', () => {
  const linksTree = { link: { [UrlKey]: 'link' } };
  const linkType = { ...LinkType, link: 'link' };
  let serviceBuilder: LinksTreeServiceBuilder;

  beforeEach(() => {
    serviceBuilder = new LinksTreeServiceBuilder();
  });

  it('should be created', () => {
    expect(serviceBuilder).toBeTruthy();
  });

  it('should contain default LinkType enum', () => {
    // @ts-ignore
    expect(serviceBuilder.linkType).toBe(LinkType);
  });

  describe('build', () => {
    it('should return LinksTreeService instance with linksTree and linkType', () => {
      const linksTreeService = new LinksTreeService();
      // @ts-ignore
      linksTreeService.linksTree = linksTree;
      // @ts-ignore
      linksTreeService.linkType = linkType;

      // @ts-ignore
      serviceBuilder.linksTree = linksTree;
      // @ts-ignore
      serviceBuilder.linkType = linkType;

      expect(serviceBuilder.build()).toEqual(linksTreeService);
    });
  });

  describe('setLinksTree', () => {
    it('should set linksTree and return current builder instance', () => {
      expect(serviceBuilder.setLinksTree(linksTree)).toBe(serviceBuilder);
      // @ts-ignore
      expect(serviceBuilder.linksTree).toEqual(linksTree);
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
