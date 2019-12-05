import { GenerateLinksSchema, GenerateLinksSchematics } from './generate-links';
import { Rule } from '@angular-devkit/schematics';

export function generateLinks(_options: GenerateLinksSchema): Rule {
  return GenerateLinksSchematics.run(_options);
}
