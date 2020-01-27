function getItemPropertyValue(item: any, property: string): any {
  const props = property.split('.');

  if (props.length === 1) {
    return item[property];
  }

  let toReturn = item;

  for (const prop of props) {
    toReturn = toReturn[prop];
  }

  return toReturn;
}

/**
 * Create trackBy function for *ngFor.
 * @param {string} trackByProperties property names to return, it can be nested (separate with dot)
 * @returns {T}
 */
export function trackByFnFactory<T = any>(
  ...trackByProperties: string[]
): (index: number, item: T) => T {
  return (index: number, item: T) => {
    let toReturn = getItemPropertyValue(item, trackByProperties[0]);

    for (let i = 1; i < trackByProperties.length; i++) {
      toReturn += getItemPropertyValue(item, trackByProperties[i]);
    }

    return toReturn;
  };
}
