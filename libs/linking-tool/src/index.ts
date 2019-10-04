import { Schema } from './lib/resources/interfaces/schema.interface';
import { Rule } from '@angular-devkit/schematics';
import { Schematics } from './lib/schematics/schematics';

export function generateLinks(_options: Schema): Rule {
  return Schematics.generateLinks(_options);
}
