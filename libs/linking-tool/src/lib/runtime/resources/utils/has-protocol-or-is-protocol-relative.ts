export function hasProtocolOrIsProtocolRelative(url: string): boolean {
  const protocolRegexp = new RegExp(/^(([a-zA-Z]+:\/\/)|(\/\/))/);
  return protocolRegexp.test(url);
}
