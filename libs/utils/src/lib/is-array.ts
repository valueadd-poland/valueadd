/**
 * Checks if provided value is an array.
 * @param {any} value
 * @returns {boolean}
 */
export function isArray(value: any): boolean {
  if (value === Array) {
    return true;
  } else if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return value instanceof Array;
  }
}
