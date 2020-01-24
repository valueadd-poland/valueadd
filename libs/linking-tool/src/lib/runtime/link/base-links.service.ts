import { LinkType } from '../resources/enums/link-type.enum';
import { Link } from '../resources/models/link.interface';

export abstract class BaseLinksService {
  protected linkType: typeof LinkType;

  generateExternalUrlLink(url: string): Link {
    return {
      type: this.linkType.externalUrl,
      params: {
        url
      }
    };
  }
}
