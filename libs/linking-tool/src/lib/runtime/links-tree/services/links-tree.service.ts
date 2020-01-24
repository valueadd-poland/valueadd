import { Injectable } from '@angular/core';
import { utils } from '../../resources/utils';
import { BaseLinksService } from '../../link/base-links.service';
import { LinkType } from '../../resources/enums/link-type.enum';
import { Link } from '../../resources/models/link.interface';
import { RouterLink } from '../../resources/models/router-link.interface';
import { UrlKey } from '../../../shared/consts/url-key.const';
import { LinkParams } from '../../resources/models/link-params.interface';
import { LinksTree } from '../resources/models/links-tree.interface';

@Injectable()
export class LinksTreeService extends BaseLinksService {
  private readonly defaultUrl = '#';
  private linksTree: LinksTree;

  init(linksTree: LinksTree, linkType: typeof LinkType): void {
    this.linksTree = linksTree;
    this.linkType = linkType;
  }

  resolveLinkUrl(linkPath: Link[]): string {
    if (linkPath.length === 1 && linkPath.every(link => link.type === LinkType.externalUrl)) {
      return this.getExternalUrl(linkPath[0]);
    }

    if (linkPath.length > 1 && linkPath.some(link => link.type === LinkType.externalUrl)) {
      console.warn(
        `Passed many link types with external url type. Returning default url (${this.defaultUrl})`
      );
      return this.defaultUrl;
    }

    return this.getUrlFromTree(linkPath);
  }

  resolveRouterLink(linkPath: Link[]): RouterLink {
    if (!linkPath.length) {
      console.warn(`No path passed. Returning router link with default url (${this.defaultUrl})`);
      return { path: [this.defaultUrl] };
    }

    return this.getRouterLink(linkPath, this.findNodeWithPath(linkPath));
  }

  private findNodeWithPath(linkPath: Link[]): LinksTree {
    let linksTree = { ...this.linksTree };
    linkPath.forEach(link => {
      linksTree = linksTree[link.type] as LinksTree;
    });
    return linksTree;
  }

  private getExternalUrl(link: Link): string {
    return utils.hasProtocolOrIsProtocolRelative(link.params.url)
      ? link.params.url
      : '//' + link.params.url;
  }

  private getUrlFromTree(linkPath: Link[]): string {
    let url: string;
    let lastLink: Link;
    const linksNode = this.findNodeWithPath(linkPath);

    if (this.isDestinationNodeFound(linksNode)) {
      url = linksNode[UrlKey] as string;
      lastLink = linkPath[linkPath.length - 1];
    } else {
      console.warn('No node in a tree found. Returning url based on passed link paths');
      const filteredLinkPath = linkPath.filter(link => !!link.path);
      url = filteredLinkPath.map(link => (link.path ? link.path : '')).join('/');
      lastLink = filteredLinkPath[filteredLinkPath.length - 1];
    }

    if (lastLink && lastLink.params) {
      return this.getUrlWithParams(url, lastLink);
    }

    return url || this.defaultUrl;
  }

  private getUrlWithParams(url: string, params: LinkParams): string {
    let resultUrl = utils.interpolate(url, params);
    if (params.anchor) {
      resultUrl += '#' + params.anchor;
    }
    if (params.queryParams) {
      resultUrl += utils.convertParamsToQueryParamsString(params.queryParams);
    }

    return resultUrl;
  }

  private getRouterLink(linkPath: Link[], linksNode: LinksTree): RouterLink {
    let result: RouterLink = { path: [linksNode[UrlKey] as string] };
    const lastLink = linkPath[linkPath.length - 1];

    if (lastLink.params) {
      result = {
        path: [utils.interpolate(linksNode[UrlKey] as string, lastLink.params)]
      };

      if (lastLink.params.anchor) {
        result.extras = {};
        result.extras.fragment = lastLink.params.anchor;
      }

      if (lastLink.params.skipLocationChange) {
        result.extras = result.extras ? result.extras : {};
        result.extras.skipLocationChange = lastLink.params.skipLocationChange;
      }

      if (lastLink.params.queryParams) {
        result.query = {};

        Object.keys(lastLink.params.queryParams).forEach((key: string) => {
          result.query[key] = lastLink.params.queryParams[key];
        });
      }
    }

    return result;
  }

  private isDestinationNodeFound(linksTree: LinksTree): boolean {
    return !!Object.keys(linksTree).length;
  }
}
