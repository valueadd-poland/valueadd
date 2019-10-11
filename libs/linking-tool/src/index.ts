import { Rule } from '@angular-devkit/schematics';
import { GenerateLinksSchema, GenerateLinksSchematics } from './lib/schematics';

export function generateLinks(_options: GenerateLinksSchema): Rule {
  return GenerateLinksSchematics.run(_options);
}

export * from './lib/linking-tool.module';
export * from './lib/resources';
