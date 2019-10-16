'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var architect_1 = require('@angular-devkit/architect');
var path_1 = require('path');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
// @ts-ignore
var schema_1 = require('./schema');
exports.NgPackagrBuilderOptions = schema_1.Schema;
function initialize(options, root) {
  return tslib_1.__awaiter(this, void 0, void 0, function() {
    var packager;
    return tslib_1.__generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            Promise.resolve().then(function() {
              return require('ng-packagr');
            })
          ];
        case 1:
          packager = _a.sent().ngPackagr();
          packager.forProject(path_1.resolve(root, options.project));
          if (options.tsConfig) {
            packager.withTsConfig(path_1.resolve(root, options.tsConfig));
          }
          return [2 /*return*/, packager];
      }
    });
  });
}
function execute(options, context) {
  return rxjs_1.from(initialize(options, context.workspaceRoot)).pipe(
    operators_1.switchMap(function(packager) {
      return options.watch ? packager.watch() : packager.build();
    }),
    operators_1.mapTo({ success: true })
  );
}
exports.execute = execute;
exports.default = architect_1.createBuilder(execute);
//# sourceMappingURL=index.js.map
