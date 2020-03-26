'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var childProcess = require('child_process');
var path_1 = require('path');
var Builder = /** @class */ (function() {
  function Builder(root, tsConfig) {
    this.root = root;
    this.tsConfig = tsConfig;
  }
  Builder.prototype.build = function() {
    console.log('Build Schematics');
    console.log('From: ' + this.root);
    console.log('To: ' + path_1.resolve(this.root, this.tsConfig));
    var child = childProcess.spawn('tsc', ['-p', path_1.resolve(this.root, this.tsConfig)]);
    child.stdout.on('data', function(data) {
      console.log('stdout:', data.toString());
    });
    child.stderr.on('data', function(data) {
      console.log('stderr:', data.toString());
    });
    return new Promise(function(res, reject) {
      child.on('close', function(code) {
        console.info('tsc exited with code ' + code);
        if (code === 0) {
          res();
        } else {
          reject();
        }
      });
    });
  };
  return Builder;
})();
function initialize(options, root) {
  return tslib_1.__awaiter(this, void 0, void 0, function() {
    return tslib_1.__generator(this, function(_a) {
      return [2 /*return*/, new Builder(root, options.tsConfig)];
    });
  });
}
exports.initialize = initialize;
//# sourceMappingURL=schematics.build.js.map
