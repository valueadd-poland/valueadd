/**
 * Checks if given url either has protocol or is a protocol relative url
 *
 * @param {string} url
 * @return {boolean}
 */
export function hasProtocolOrIsProtocolRelative(url: string): boolean {
  const protocolRegexp = new RegExp(/^(([a-zA-Z]+:\/\/)|(\/\/))/);
  return protocolRegexp.test(url);
}
