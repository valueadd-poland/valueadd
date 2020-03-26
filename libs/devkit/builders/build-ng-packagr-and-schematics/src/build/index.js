'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var architect_1 = require('@angular-devkit/architect');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
// @ts-ignore
var schema_1 = require('./schema');
exports.NgPackagrBuilderOptions = schema_1.Schema;
var ng_packagr_build_1 = require('./ng-packagr-build');
var schematics_build_1 = require('./schematics.build');
function execute(options, context) {
  return rxjs_1.from(ng_packagr_build_1.initialize(options, context.workspaceRoot)).pipe(
    operators_1.switchMap(function(packager) {
      return options.watch ? packager.watch() : packager.build();
    }),
    operators_1.switchMap(function() {
      return schematics_build_1.initialize(options, context.workspaceRoot);
    }),
    operators_1.switchMap(function(builder) {
      return builder.build();
    }),
    operators_1.mapTo({ success: true })
  );
}
exports.execute = execute;
exports.default = architect_1.createBuilder(execute);
//# sourceMappingURL=index.js.map
