import { Injectable } from '@angular/core';
import { utils } from '../../resources/utils';
import { BaseLinksService } from '../../link/base-links.service';
import { LinksMap } from '../resources/models/links-map.interface';
import { LinkType } from '../../resources/enums/link-type.enum';
import { Link } from '../../resources/models/link.interface';
import { RouterLink } from '../../resources/models/router-link.interface';

@Injectable()
export class LinksMapService extends BaseLinksService {
  private linksMap: LinksMap;

  init(linksMap: LinksMap, linkType: typeof LinkType): void {
    this.linksMap = linksMap;
    this.linkType = linkType;
  }

  resolveLinkUrl(link: Link): string {
    let url = null;
    if (link.type === LinkType.externalUrl) {
      return utils.hasProtocolOrIsProtocolRelative(link.params.url)
        ? link.params.url
        : '//' + link.params.url;
    } else if (this.linksMap[link.type]) {
      url = this.linksMap[link.type];
    } else if (link.path) {
      url = link.path;
    }
    if (link.params) {
      url = utils.interpolate(url, link.params);
      if (link.params.anchor) {
        url += '#' + link.params.anchor;
      }
      if (link.params.queryParams) {
        url += utils.convertParamsToQueryParamsString(link.params.queryParams);
      }
    }
    return url || '#';
  }

  resolveRouterLink(link: Link): RouterLink {
    return this.linksMap[link.type] ? this.getRouterLink(link) : { path: ['#'] };
  }

  private getRouterLink(link: Link): RouterLink {
    let result: RouterLink = { path: [this.linksMap[link.type]] };

    if (link.params) {
      result = { path: [utils.interpolate(this.linksMap[link.type], link.params)] };

      if (link.params.anchor) {
        result.extras = {};
        result.extras.fragment = link.params.anchor;
      }

      if (link.params.skipLocationChange) {
        result.extras = result.extras ? result.extras : {};
        result.extras.skipLocationChange = link.params.skipLocationChange;
      }

      if (link.params.queryParams) {
        result.query = {};

        Object.keys(link.params.queryParams).forEach((key: string) => {
          result.query[key] = link.params.queryParams[key];
        });
      }
    }

    return result;
  }
}
