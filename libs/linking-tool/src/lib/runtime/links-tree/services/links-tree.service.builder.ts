import { LinksTreeService } from './links-tree.service';
import { BaseLinksServiceBuilder } from '../../link/base-links.service.builder';
import { LinksTree } from '../resources/models/links-tree.interface';
import { LinkType } from '../../resources/enums/link-type.enum';

export class LinksTreeServiceBuilder extends BaseLinksServiceBuilder {
  private linksTree: LinksTree;
  private linksTreeService: LinksTreeService;

  build(): LinksTreeService {
    this.linksTreeService = new LinksTreeService();
    this.linksTreeService.init(this.linksTree, this.linkType);
    return this.linksTreeService;
  }

  setLinksTree(linksTree: LinksTree): LinksTreeServiceBuilder {
    this.linksTree = linksTree;
    return this;
  }

  setLinkType(linkType: typeof LinkType): LinksTreeServiceBuilder {
    this.linkType = linkType;
    return this;
  }
}
