import { Injectable } from '@angular/core';
import { NavigationExtras, Params } from '@angular/router';

export interface RouterLink {
  extras?: NavigationExtras;
  path: any[];
  query?: object;
}

@Injectable()
export class LinkService {
  // @TODO: json importing issue. With current import file is imported as Module, otherwise IDE shows errors.
  // This needs further investigation.
  static readonly links = linksMap;

  static convertParamsToQueryParamsString(params: Params): string {
    let result = '?';
    Object.keys(params).forEach((key: string) => {
      result += `${key}=${params[key]}&`;
    });

    return result.slice(0, -1);
  }

  static generateExternalUrlLink(url: string): Link {
    return {
      type: LinkType.externalUrl,
      params: {
        url
      }
    };
  }

  static resolveLinkUrl(link: Link): string {
    let url = null;
    if (link.type === LinkType.externalUrl) {
      return Utils.hasProtocolOrIsProtocolRelative(link.params.url)
        ? link.params.url
        : '//' + link.params.url;
    } else if (LinkUtilService.links[link.type]) {
      url = LinkUtilService.links[link.type];
    } else if (link.path) {
      url = link.path;
    }
    if (link.params) {
      url = Utils.interpolate(url, link.params);
      if (link.params.anchor) {
        url += '#' + link.params.anchor;
      }
      if (link.params.queryParams) {
        url += LinkUtilService.convertParamsToQueryParamsString(link.params.queryParams);
      }
    }
    return url || '#';
  }

  static resolveRouterLink(link: Link): RouterLink {
    return LinkUtilService.links[link.type] ? LinkUtilService.getRouterLink(link) : { path: ['#'] };
  }

  private static getRouterLink(link: Link): RouterLink {
    let result: RouterLink = { path: [LinkUtilService.links[link.type]] };

    if (link.params) {
      result = { path: [Utils.interpolate(LinkUtilService.links[link.type], link.params)] };

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
