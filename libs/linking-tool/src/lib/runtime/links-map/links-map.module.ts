import { ModuleWithProviders, NgModule } from '@angular/core';
import { LinksMap } from './resources/models/links-map.interface';
import { LinkType } from '../resources/enums/link-type.enum';
import { LinksMapService } from './services/links-map.service';
import { LinksMapServiceBuilder } from './services/links-map.service.builder';

// @dynamic
@NgModule({})
export class LinksMapModule {
  static forRoot(
    linksMap: LinksMap,
    linkType: typeof LinkType = LinkType
  ): ModuleWithProviders<LinksMapModule> {
    return {
      ngModule: LinksMapModule,
      providers: [
        {
          provide: LinksMapService,
          useFactory: () =>
            new LinksMapServiceBuilder()
              .setLinksMap(linksMap)
              .setLinkType(linkType)
              .build()
        }
      ]
    };
  }
}
