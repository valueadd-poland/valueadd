import { ModuleWithProviders, NgModule } from '@angular/core';
import { LinksTreeService } from './services/links-tree.service';
import { LinksTreeServiceBuilder } from './services/links-tree.service.builder';
import { LinksTree } from './resources/models/links-tree.interface';
import { LinkType } from '../resources/enums/link-type.enum';

// @dynamic
@NgModule({})
export class LinksTreeModule {
  static forRoot(
    linksTree: LinksTree,
    linkType: typeof LinkType = LinkType
  ): ModuleWithProviders<LinksTreeModule> {
    return {
      ngModule: LinksTreeModule,
      providers: [
        {
          provide: LinksTreeService,
          useFactory: () =>
            new LinksTreeServiceBuilder()
              .setLinksTree(linksTree)
              .setLinkType(linkType)
              .build()
        }
      ]
    };
  }
}
