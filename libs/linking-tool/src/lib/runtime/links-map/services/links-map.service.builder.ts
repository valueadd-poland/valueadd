import { LinksMapService } from './links-map.service';
import { BaseLinksServiceBuilder } from '../../link/base-links.service.builder';
import { LinksMap } from '../resources/models/links-map.interface';
import { LinkType } from '../../resources/enums/link-type.enum';

export class LinksMapServiceBuilder extends BaseLinksServiceBuilder {
  private linksMap: LinksMap;
  private linksMapService: LinksMapService;

  build(): LinksMapService {
    this.linksMapService = new LinksMapService();
    this.linksMapService.init(this.linksMap, this.linkType);
    return this.linksMapService;
  }

  setLinksMap(linksMap: LinksMap): LinksMapServiceBuilder {
    this.linksMap = linksMap;
    return this;
  }

  setLinkType(linkType: typeof LinkType): LinksMapServiceBuilder {
    this.linkType = linkType;
    return this;
  }
}
