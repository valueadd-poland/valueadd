import * as memoizee_ from 'memoizee';

const memoize = memoizee_;

export function Memoize(): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const oldFunction = descriptor.value;
    descriptor.value = memoize(oldFunction);
    return descriptor;
  };
}
