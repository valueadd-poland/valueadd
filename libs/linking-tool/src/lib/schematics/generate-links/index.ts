import { GenerateLinksSchema } from './resources/interfaces/generate-links-schema.interface';
import { Rule } from '@angular-devkit/schematics';
import { GenerateLinksSchematics } from './generate-links.schematics';

export * from './generate-links.schematics';
export * from './resources/interfaces/generate-links-schema.interface';

export function generateLinks(_options: GenerateLinksSchema): Rule {
  return GenerateLinksSchematics.run(_options);
}
