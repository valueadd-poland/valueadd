import { TestBed } from '@angular/core/testing';

import { LinkService } from './link.service';
import { LinkingToolModule } from '../linking-tool.module';
import { LinksMap, LinkType } from '../resources';

describe('LinkService', () => {
  const linksMap: LinksMap = { test: 'test' };
  const linkType = LinkType;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [LinkingToolModule.forRoot(linksMap, linkType)]
    })
  );

  it('should be created', () => {
    const service: LinkService = TestBed.get(LinkService);
    expect(service).toBeTruthy();
  });

  describe('convertParamsToQueryParamsString', () => {});

  describe('generateExternalUrlLink', () => {});

  describe('resolveLinkUrl', () => {});

  describe('resolveRouterLink', () => {});

  // test private method
  describe('getRouterLink', () => {});
});
