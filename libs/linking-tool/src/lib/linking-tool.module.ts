import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkService } from './runtime';
import { linkServiceFactory } from './runtime/link/link.service.factory';
import { LinksMap, LinkType } from './resources';

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
          useFactory: linkServiceFactory,
          deps: [linksMap, linkTypeEnum]
        }
      ]
    };
  }
}
