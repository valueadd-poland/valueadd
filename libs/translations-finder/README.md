# Translations Finder
Finds missing translations in your project.

## Installation
Install with npm
```shell script
# Locally
npm i translations-finder

# Globally
npm i -g translations-finder
```

## Usage
```typescript
import { findMissingTranslations } from 'translations-finder';

const missingTranslations = findMissingTranslations(
    definedTranslations,
    globFilePattern,
    regexTranslation,
    regexTranslationKey,
    directory
  );
```

``definedTranslations`` is an object of keys assigned to translations.
```typescript
{
  common: {
    login: "Login",
    logout: "Logout",
    menu: {
      title: "The Boring Company"
    }
  }
}
```

``globFilePattern`` is the glob matcher for files.
```typescript
'{,!(node_modules)/**/}*.html'
```

``regexTransaltion`` is a regular expression that is supposed to match the translation key or the text that includes the translation key.
```typescript
// Matches {{ 'common.author' | translate }}
/('+[A-Za-z]+\.[A-Za-z]+')( \| translate)/g
```

``regexTranslationKey`` is a an optional parameter which can be used to extract the actual key from the found text.
```js
// Extracts the key common.author from the previous matching.
/([A-Za-z]+(\.[A-Za-z]+)+)+/g
```

``directory`` is an optional parameter that is used as a root directory to search in. When not provided, the value is equal to ``process.cwt()``. 

## Example usage

```typescript
import { findMissingTranslations } from 'translations-finder';

preparedTranslations = {
  common: {
    login: "Login",
    logout: "Logout",
    menu: {
      title: "The Boring Company"
    }
  }
};

const missingTranslations = findMissingTranslations(
    preparedTranslations,
    '{,!(node_modules)/**/}*.html',
    /('+[A-Za-z]+\.[A-Za-z]+')( \| translate)/g,
    /([A-Za-z]+(\.[A-Za-z]+)+)+/g
  );
```

