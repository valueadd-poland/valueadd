'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _this = this;
exports.__esModule = true;
var glob = require('glob');
var fs = require('fs');
/**
 * @description
 * Extracts the string key of the text from the text
 *
 * @method extractString
 *
 * @param {string} text
 * The whole text matched by regex
 *
 * @param {RegExp} regex
 * The regex to extract the text key from the matched text
 *
 * @return {string}
 * Extracted string
 */
var extractString = function(text, regex) {
  return (text.match(regex) || [])[0];
};
/**
 * @description
 * Transforms an object like:
 * ```
 * {
 *      validation: {
 *          accepted: "aaa",
 *          after: "bbb",
 *          between: {
 *              numeric: "xxx"
 *          }
 *      }
 * }
 * ```
 *
 * to the object like:
 *
 * ```
 *  {
 *      validation.accepted: "aaa",
 *      validation.after: "bbb",
 *      validation.between.numeric: "xxx"
 *  }
 * ```
 *
 *
 * @method flattenObjectRecursively
 *
 * @param {any} object
 *
 * @param {string} prefix
 * The key of the parent property
 *
 * @return {Record<string, string>}
 * Object without any nesting
 */
var flattenObjectRecursively = function(object, prefix) {
  var flattenedObject = {};
  Object.keys(object).forEach(function(key) {
    if (typeof object[key] === 'object' && object[key] !== null) {
      flattenedObject = __assign(
        {},
        flattenedObject,
        flattenObjectRecursively(object[key], prefix + '.' + key)
      );
    } else {
      flattenedObject[prefix + '.' + key] = object[key];
    }
  });
  return flattenedObject;
};
/**
 * @description
 * Transforms an object with nested properties into
 * the object without any nesting.
 *
 * @method flattenObjectRecursively
 *
 * @param {any} object
 */
var flattenObject = function(object) {
  var flattenedObject = {};
  Object.keys(object).forEach(function(propertyPrefix) {
    var _a;
    if (typeof object[propertyPrefix] !== 'string') {
      var flattenedNesting = flattenObjectRecursively(object[propertyPrefix], propertyPrefix);
      flattenedObject = __assign({}, flattenedObject, flattenedNesting);
    } else {
      flattenedObject = __assign(
        {},
        flattenedObject,
        ((_a = {}), (_a[propertyPrefix] = object[propertyPrefix]), _a)
      );
    }
  });
  return flattenedObject;
};
/**
 * @description
 * Compares foundTranslations with preparedTranslations
 * and returns only missing ones
 *
 * @method compareTranslations
 *
 * @param {Record<string, string[]>} foundTranslations
 * Translations found in the local filesystem
 *
 * @param {Record<string, string>} preparedTranslations
 * Translated keys
 *
 * @param {RegExp} translationKeyRegex
 * The regex to extract the translation key from the matched text
 *
 * @return {Record<string, string[]>}
 * Missing translations
 */
var compareTranslations = function(foundTranslations, preparedTranslations, translationKeyRegex) {
  var missingTranslations = {};
  Object.keys(foundTranslations).forEach(function(fileName) {
    var _a;
    var missingTranslationsPerFile = [];
    foundTranslations[fileName]
      .map(function(translation) {
        return translationKeyRegex ? extractString(translation, translationKeyRegex) : translation;
      })
      .forEach(function(translation) {
        if (!Object.keys(preparedTranslations).includes(translation)) {
          missingTranslationsPerFile.push(translation);
        }
      });
    if (missingTranslationsPerFile.length) {
      missingTranslations = __assign(
        {},
        missingTranslations,
        ((_a = {}), (_a[fileName] = missingTranslationsPerFile), _a)
      );
    }
  });
  return missingTranslations;
};
/**
 * @description
 * Takes an array filePaths and returns them with translation keys only if they have translations
 *
 * @method findTranslationKeysInFiles
 *
 * @param {string[]} filePaths
 * Files to search in
 *
 * @param {RegExp} translationsRegex
 * Regex used to find the text which distinguish translation keys
 *
 * @return {Promise<Record<string, string[]>>}
 * All found translations with filenames
 */
var findTranslationKeysInFiles = function(filePaths, translationsRegex) {
  return __awaiter(_this, void 0, void 0, function() {
    var promises, promisesResults, results;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          promises = filePaths.map(function(filePath) {
            return fs.promises.readFile(filePath, 'utf8').then(function(fileContent) {
              var foundInFile = {
                filePath: filePath,
                translationKeys: fileContent.match(translationsRegex)
              };
              return foundInFile;
            });
          });
          return [4 /*yield*/, Promise.all(promises)];
        case 1:
          promisesResults = _a.sent();
          results = {};
          promisesResults.forEach(function(foundTranslationKeysInFile) {
            var _a;
            if (foundTranslationKeysInFile.translationKeys) {
              results = __assign(
                {},
                results,
                ((_a = {}),
                (_a[foundTranslationKeysInFile.filePath] =
                  foundTranslationKeysInFile.translationKeys),
                _a)
              );
            }
          });
          return [2 /*return*/, results];
      }
    });
  });
};
/**
 * @description
 * Searches in local file system for translations matching the given regex
 * and compares with the given object of translated keys
 *
 * @method findTranslations
 *
 * @param {Record<string, string> | any} definedTranslations
 * Translated keys
 * If the given object has nested properties, it will be flattened
 *
 * @param {string} globFilePattern
 * Glob to find files
 *
 * @param {RegExp} translationsRegex
 * When:
 *
 * a) translationKeyRegex is given,
 * translationsRegex finds the text that includes a translation key
 * and the translation key is matched using translationKeyRegex
 *
 * b) translationKeyRegex is not given,
 * translationRegex finds the translation key
 *
 * @param {RegExp} translationKeyRegex
 * Use if translationRegex is used to distinguish a text that includes a key
 * and this text isn't the key itself
 *
 * #example
 * ```
 * translationsRegex matches:
 * {{ 'common.author' | translate }}
 *
 * translationKeyRegex matches:
 * 'common.author'
 *
 * ```
 *
 * @param {string} directory
 * Root directory that will be searched in,
 * by default it is process.cwd()
 *
 * @return {Promise<Record<string, string[]>>}
 * Missing translation keys
 */
exports.findMissingTranslations = function(
  definedTranslations,
  globFilePattern,
  translationsRegex,
  translationKeyRegex,
  directory
) {
  return __awaiter(_this, void 0, void 0, function() {
    var options, files, allTranslations;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          options = directory ? { cwd: directory } : {};
          definedTranslations = flattenObject(definedTranslations);
          files = glob.sync(globFilePattern, options);
          return [4 /*yield*/, findTranslationKeysInFiles(files, translationsRegex)];
        case 1:
          allTranslations = _a.sent();
          return [
            2 /*return*/,
            translationKeyRegex
              ? compareTranslations(allTranslations, definedTranslations, translationKeyRegex)
              : compareTranslations(allTranslations, definedTranslations)
          ];
      }
    });
  });
};
