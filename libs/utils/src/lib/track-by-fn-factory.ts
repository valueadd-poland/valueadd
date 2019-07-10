/**
 * Create trackBy function for *ngFor.
 * @param {string} trackByProperty property name to return, it can be nested (separate with dot)
 * @returns {T}
 */
export function trackByFnFactory<T = any>(trackByProperty: string): (index: number, item: T) => T {
  return (index: number, item: T) => {
    const props = trackByProperty.split('.');

    if (props.length === 1) {
      return item[trackByProperty];
    }

    let toReturn = item;

    for (const prop of props) {
      toReturn = toReturn[prop];
    }

    return toReturn;
  };
}
