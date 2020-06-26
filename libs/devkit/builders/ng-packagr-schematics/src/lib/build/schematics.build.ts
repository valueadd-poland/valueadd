import { Builder } from './builder.interface';
import { TscBuilder } from './tsc.builder';

export interface SchematicsBuilderOptions {
  tsConfigSchematics: string;
}

export async function initialize(
  options: SchematicsBuilderOptions,
  root: string
): Promise<Builder> {
  return new TscBuilder(root, options.tsConfigSchematics);
}
