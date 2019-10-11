import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Link, LinksMap, LinkType, RouterLink, utils } from '../resources';

@Injectable()
export class LinkService {
  private linksMap: LinksMap;
  private linkType: typeof LinkType;

  convertParamsToQueryParamsString(params: Params): string {
    let result = '?';
    Object.keys(params).forEach((key: string) => {
      result += `${key}=${params[key]}&`;
    });

    return result.slice(0, -1);
  }

  generateExternalUrlLink(url: string): Link {
    return {
      type: this.linkType.externalUrl,
      params: {
        url
      }
    };
  }

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
        url += this.convertParamsToQueryParamsString(link.params.queryParams);
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
