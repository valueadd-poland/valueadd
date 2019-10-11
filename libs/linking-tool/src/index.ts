import { Rule } from '@angular-devkit/schematics';
import { GenerateLinksSchema, GenerateLinksSchematics } from './lib/schematics/generate-links';

export function generateLinks(_options: GenerateLinksSchema): Rule {
  return GenerateLinksSchematics.run(_options);
}
