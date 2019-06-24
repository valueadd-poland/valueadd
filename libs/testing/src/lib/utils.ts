/**
 *  Compare two states and exclude given properties. Useful for testing state in @ngrx/store.
 */
export function statesEqual<T, K extends keyof T>(
  state: T,
  initialState: object,
  excludeProps: K[]
): boolean {
  const s = { ...(state as any) };
  const is = { ...initialState };

  excludeProps.forEach(prop => {
    delete s[prop as any];
    delete is[prop as any];
  });

  for (const prop in s) {
    if (s.hasOwnProperty(prop) && s[prop] !== is[prop]) {
      return false;
    }
  }

  return true;
}

/**
 * Extract methods' names from class.
 */
export function getClassMethodsNames(obj: any): string[] {
  const methods: string[] = [];
  const instance = new obj();
  const prototype = Reflect.getPrototypeOf(instance);
  Reflect.ownKeys(prototype).forEach(k =>
    methods.push(typeof k === 'symbol' ? k.toString() : k + '')
  );

  return methods;
}
