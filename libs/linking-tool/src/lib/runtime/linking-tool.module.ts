import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkService } from './link/link.service';
import { linkServiceFactory } from './link/link.service.factory';
import { LinksMap } from './resources/models';
import { LinkType } from './resources/enums';

@NgModule({
  imports: [CommonModule]
})
export class LinkingToolModule {
  static forRoot(linksMap: LinksMap, linkTypeEnum = LinkType): ModuleWithProviders {
    return {
      ngModule: LinkingToolModule,
      providers: [
        {
          provide: LinkService,
          useValue: linkServiceFactory(linksMap, linkTypeEnum)
        }
      ]
    };
  }
}
