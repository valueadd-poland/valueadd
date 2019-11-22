'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var path_1 = require('path');
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
exports.initialize = initialize;
//# sourceMappingURL=ng-packagr-build.js.map
