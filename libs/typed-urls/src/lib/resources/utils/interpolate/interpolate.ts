/**
 * @param str
 * @param params
 * @returns Interpolation of the path with the parameters.
 */
export function interpolate(str: string, params = {}): string {
  const paramsCopy = { ...params };
  const result: string[] = [];
  let segmentMatch;
  let key: string | null;

  (str || '').split(':').forEach((segment: string, i: number) => {
    if (i === 0 || !/^[a-z]/i.test(segment)) {
      result.push(i === 0 ? segment : ':' + segment);
    } else {
      segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
      // @ts-ignore
      key = segmentMatch[1];
      // @ts-ignore
      result.push(paramsCopy[key]);
      // @ts-ignore
      result.push(segmentMatch[2] || '');
      // @ts-ignore
      delete paramsCopy[key];
    }
  });

  return result.join('');
}
