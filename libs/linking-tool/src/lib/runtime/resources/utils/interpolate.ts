export function interpolate(arg: string, params = {}): string {
  params = { ...params };
  const result = [];
  let segmentMatch;
  let key;

  (arg || '').split(':').forEach((segment, i) => {
    if (i === 0 || !/^[a-z]/i.test(segment)) {
      result.push(i === 0 ? segment : ':' + segment);
    } else {
      segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
      key = segmentMatch[1];
      result.push(params[key]);
      result.push(segmentMatch[2] || '');
      delete params[key];
    }
  });

  return result.join('');
}
