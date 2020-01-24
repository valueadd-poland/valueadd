import { LinkType } from '../resources/enums/link-type.enum';

export abstract class BaseLinksServiceBuilder {
  protected linkType: typeof LinkType;

  constructor() {
    this.linkType = LinkType;
  }
}
