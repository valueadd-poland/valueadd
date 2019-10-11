import { LinksMap } from '../resources/models';
import { LinkType } from '../resources/enums';
import { LinkService } from './link.service';

export class LinkServiceBuilder {
  private linksMap: LinksMap;
  private linkType: typeof LinkType;
  private linkService: LinkService;

  constructor() {
    this.linkType = LinkType;
  }

  build(): LinkService {
    this.linkService = new LinkService();
    this.linkService.init(this.linksMap, this.linkType);
    return this.linkService;
  }

  setLinksMap(linksMap: LinksMap): LinkServiceBuilder {
    this.linksMap = linksMap;
    return this;
  }

  setLinkType(linkType: typeof LinkType): LinkServiceBuilder {
    this.linkType = linkType;
    return this;
  }
}
