/**
 * Converts bytes to human readable format.
 * @param {number} size - size in bytes
 * @returns {string}
 */
export function humanizeBytes(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    ++i;
  }

  return size.toFixed(1) + ' ' + units[i];
}
