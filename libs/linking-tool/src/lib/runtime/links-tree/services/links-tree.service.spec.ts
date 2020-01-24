import { TestBed } from '@angular/core/testing';

import { LinksTreeService } from './links-tree.service';
import { LinksTreeModule } from '../links-tree.module';
import { UrlKey } from '../../../shared/consts/url-key.const';
import { LinkType } from '../../resources/enums/link-type.enum';
import { LinksTree } from '../resources/models/links-tree.interface';

describe('LinksTreeService', () => {
  const linksTree: LinksTree = { test: { [UrlKey]: 'test' } };
  const linkType = LinkType;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [LinksTreeModule.forRoot(linksTree, linkType)]
    })
  );

  it('should be created', () => {
    const service: LinksTreeService = TestBed.get(LinksTreeService);
    expect(service).toBeTruthy();
  });
});
