import { LinkService } from './link.service';
import { LinksMap } from '../resources/models';
import { LinkType } from '../resources/enums';

export const linkServiceFactory = (linksMap: LinksMap, linkTypeEnum = LinkType) => {
  return new LinkService(linksMap, linkTypeEnum);
};
