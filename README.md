# ValueAdd

This repository contains a set of libraries and tools for developing frontend applications with Angular.  

## Packages

* [Local storage](https://github.com/valueadd-poland/valueadd/tree/master/libs/common/src/lib/local-storage) - local storage client for simple crud operations.  
* [Testing utilities](https://github.com/valueadd-poland/valueadd/tree/master/libs/testing) - testing utilities.  
* [Validation messages](https://github.com/valueadd-poland/valueadd/tree/master/libs/validation-messages) - validation messages.  


## Releasing & publishing

To release and publish all libs follow steps below:  

1. `npm run release:prepare`  
2. `npm run release:push`  
3. `npm run publish:latest -- {npm-otp}`  
