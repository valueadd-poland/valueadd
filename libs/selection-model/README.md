# selection-model

The class defined in this library provides the same interface as Angular SelectionModel, but it supports object members,
and also lets You get current selected values without calling a method or a getter

The only difference to the original SelectionModel in the interface is that it accepts keyFn as the second parameter in the constructor
```ts
    const model = new SelectionModel(false, (item) => item.id);                           
```

The original SelectionModel:
https://github.com/angular/components/blob/master/src/cdk/collections/selection-model.ts

## Running unit tests

Run `nx test selection-model` to execute the unit tests.
