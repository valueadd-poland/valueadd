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
export declare const findMissingTranslations: (
  definedTranslations: any,
  globFilePattern: string,
  translationsRegex: RegExp,
  translationKeyRegex?: RegExp,
  directory?: string
) => Promise<Record<string, string[]>>;
