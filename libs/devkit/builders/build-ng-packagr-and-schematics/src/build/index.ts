import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
// @ts-ignore
import { Schema as NgPackagrBuilderOptions } from './schema';
import { initialize as initializeNgPackagrBuilder } from './ng-packagr-build';
import { initialize as initializeSchematicsBuilder } from './schematics.build';

export function execute(
  options: NgPackagrBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return from(initializeNgPackagrBuilder(options, context.workspaceRoot)).pipe(
    switchMap(packager => (options.watch ? packager.watch() : packager.build())),
    switchMap(() => initializeSchematicsBuilder(options, context.workspaceRoot)),
    switchMap(builder => builder.build()),
    mapTo({ success: true })
  );
}

export { NgPackagrBuilderOptions };
export default createBuilder<Record<string, string> & NgPackagrBuilderOptions>(execute);
