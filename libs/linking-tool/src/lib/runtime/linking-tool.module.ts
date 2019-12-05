import { ModuleWithProviders, NgModule } from '@angular/core';
import { LinkService } from './link/link.service';
import { LinksMap } from './resources/models';
import { LinkType } from './resources/enums';
import { LinkServiceBuilder } from './link/link.service.builder';

@NgModule({})
export class LinkingToolModule {
  static forRoot(
    linksMap: LinksMap,
    linkType: typeof LinkType = LinkType
  ): ModuleWithProviders<LinkingToolModule> {
    return {
      ngModule: LinkingToolModule,
      providers: [
        {
          provide: LinkService,
          useValue: new LinkServiceBuilder()
            .setLinksMap(linksMap)
            .setLinkType(linkType)
            .build()
        }
      ]
    };
  }
}
