import * as glob from 'glob';
import * as fs from 'fs';

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
const flattenObjectRecursively = (object: any, prefix: string): Record<string, string> => {
  let flattenedObject: Record<string, string> = {};

  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object' && object[key] !== null) {
      flattenedObject = {
        ...flattenedObject,
        ...flattenObjectRecursively(object[key], prefix + '.' + key)
      };
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
const flattenObject = (object: any): Record<string, string> => {
  let flattenedObject: Record<string, string> = {};

  Object.keys(object).forEach(propertyPrefix => {
    if (typeof object[propertyPrefix] !== 'string') {
      const flattenedNesting = flattenObjectRecursively(object[propertyPrefix], propertyPrefix);
      flattenedObject = { ...flattenedObject, ...flattenedNesting };
    } else {
      flattenedObject = { ...flattenedObject, [propertyPrefix]: object[propertyPrefix] };
    }
  });

  return flattenedObject;
};

/**
 * @description
 * Compares foundTranslationKeys with preparedTranslations
 * and returns only missing ones
 *
 * @method compareTranslations
 *
 * @param {Record<string, string[]>} foundTranslationKeys
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
const compareTranslations = (
  foundTranslationKeys: Record<string, string[]>,
  preparedTranslations: Record<string, string>,
  translationKeyRegex?: RegExp
): Record<string, string[]> => {
  let missingTranslations: Record<string, string[]> = {};

  Object.keys(foundTranslationKeys).forEach(fileName => {
    const missingTranslationsPerFile: string[] = [];

    foundTranslationKeys[fileName]
      .map(translation =>
        translationKeyRegex ? (translation.match(translationKeyRegex) || [])[0] : translation
      )
      .forEach(translation => {
        if (!Object.keys(preparedTranslations).includes(translation)) {
          missingTranslationsPerFile.push(translation);
        }
      });

    if (missingTranslationsPerFile.length) {
      missingTranslations = { ...missingTranslations, [fileName]: missingTranslationsPerFile };
    }
  });

  return missingTranslations;
};

/**
 * @description
 * Used inside {@link findTranslationKeysInFiles}
 * to connect the file path with found translation keys in Promises
 */
interface FilePathTranslationKeys {
  filePath: string;
  translationKeys: string[] | null;
}

/**
 * @description
 * Takes an array filePaths and returns them with translation keys only if they have translations
 *
 * @method findTranslationKeysInFiles
 *
 * @param {string[]} filePaths
 * Files to search in
 *
 * @param {RegExp} translationKeysRegex
 * Regex used to find the text which distinguish translation keys
 *
 * @return {Promise<Record<string, string[]>>}
 * All found translations with filenames
 */
const findTranslationKeysInFiles = async (
  filePaths: string[],
  translationKeysRegex: RegExp
): Promise<Record<string, string[]>> => {
  const promises = filePaths.map((filePath: string) =>
    fs.promises.readFile(filePath, 'utf8').then((fileContent: string) => {
      const foundInFile: FilePathTranslationKeys = {
        filePath,
        translationKeys: fileContent.match(translationKeysRegex)
      };

      return foundInFile;
    })
  );

  const promisesResults: FilePathTranslationKeys[] = await Promise.all(promises);
  let results = {};

  promisesResults.forEach((foundTranslationKeysInFile: FilePathTranslationKeys) => {
    if (foundTranslationKeysInFile.translationKeys) {
      results = {
        ...results,
        [foundTranslationKeysInFile.filePath]: foundTranslationKeysInFile.translationKeys
      };
    }
  });

  return results;
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
export const findMissingTranslations = async (
  definedTranslations: Record<string, string> | any,
  globFilePattern: string,
  translationsRegex: RegExp,
  translationKeyRegex?: RegExp,
  directory?: string
): Promise<Record<string, string[]>> => {
  const options = directory ? { cwd: directory } : {};
  definedTranslations = flattenObject(definedTranslations);

  const files: string[] = glob.sync(globFilePattern, options);
  const allTranslations = await findTranslationKeysInFiles(files, translationsRegex);

  return translationKeyRegex
    ? compareTranslations(allTranslations, definedTranslations, translationKeyRegex)
    : compareTranslations(allTranslations, definedTranslations);
};
