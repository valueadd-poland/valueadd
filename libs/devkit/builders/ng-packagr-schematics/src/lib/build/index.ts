import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { combineLatest, from, Observable } from 'rxjs';
import { last, mapTo, switchMap } from 'rxjs/operators';
import { initialize as initializeNgPackagrBuilder } from './ng-packagr-build';
import { initialize as initializeSchematicsBuilder } from './schematics.build';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
  project: string;
  tsConfigRuntime: string;
  tsConfigSchematics: string;
  watch?: boolean;
}

export function execute(options: Options, context: BuilderContext): Observable<BuilderOutput> {
  return combineLatest([
    from(
      initializeNgPackagrBuilder(
        { ...options, tsConfig: options.tsConfigRuntime },
        context.workspaceRoot
      )
    ).pipe(switchMap(packager => (options.watch ? packager.watch() : packager.build()))),
    from(initializeSchematicsBuilder(options, context.workspaceRoot)).pipe(
      switchMap(builder => (options.watch ? builder.watch() : builder.build()))
    )
  ]).pipe(last(), mapTo({ success: true }));
}

export default createBuilder(execute);
