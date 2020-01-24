import { resolve } from 'path';
import { NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';

interface RuntimeBuilderOptions extends NgPackagrBuilderOptions {
  tsConfigRuntime: string;
}

export async function initialize(
  options: RuntimeBuilderOptions,
  root: string
): Promise<import('ng-packagr').NgPackagr> {
  const packager = (await import('ng-packagr')).ngPackagr();

  packager.forProject(resolve(root, options.project));

  if (options.tsConfigRuntime) {
    packager.withTsConfig(resolve(root, options.tsConfigRuntime));
  }

  return packager;
}
