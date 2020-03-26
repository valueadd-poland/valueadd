import { resolve } from 'path';
import { NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';

export async function initialize(
  options: NgPackagrBuilderOptions,
  root: string
): Promise<import('ng-packagr').NgPackagr> {
  const packager = (await import('ng-packagr')).ngPackagr();

  packager.forProject(resolve(root, options.project));

  if (options.tsConfig) {
    packager.withTsConfig(resolve(root, options.tsConfig));
  }

  return packager;
}
