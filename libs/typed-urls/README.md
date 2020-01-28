# Typed Urls

Library for strong-typed URLs. This library is using a [query-string](https://www.npmjs.com/package/query-string) library as a dependency, to serialize query params in URLs.

Table of contents
-
1. Common models:
    - `Url` - representing URL
    - `InterpolatableUrl` - representing URL, which can be parametrized
    - `Params` - representing URL's params
2. URL Factory
3. Examples

Common models
-
### Url
#### Properties:
- `url` - URL address

#### Methods:
- `url()` - returns URL address

#### Source code:
```
export class Url {
    constructor(private _url: string) {}

    url(): string {
      return this._url;
    }
}
```

### InterpolatableUrl
#### Properties:
- `apiUrl` - URL address
- `arrayFormatType` (optional) - used to serialize query params; passed via injection token `ARRAY_FORMAT_TYPE` with possible values:
    - `ArrayFormatType.Bracket` - example output: `foo[]=1&foo[]=2`,
    - `ArrayFormatType.Comma` - example output: `foo=1,2`,
    - `ArrayFormatType.Index` - example output: `foo[0]=1&foo[1]=2`,
    - `ArrayFormatType.None` (default value) - example output: `foo=1&foo=2`
    
#### Methods:
- `fragment(params: Record<'fragment', string>): NavigationExtras` - returns fragment of URL if passed via params
- `url(params: Record<T['urlParams'], string>): string` - returns URL address, which can be interpolated
- `query(params: { [key in keyof Record<T['queryParams'], string>]: QueryParam }): NavigationExtras` - returns query params of URL

Note that used `NavigationExtras` interface comes from `@angular/router`.

#### Source code:
```
constructor(
    private apiUrl: string,
    @Inject(ARRAY_FORMAT_TYPE)
    @Optional()
    private arrayFormatType: ArrayFormatType = ArrayFormatType.None
  ) {}

  fragment(params: Record<'fragment', string>): NavigationExtras {
    return FragmentUtil.fragment(params);
  }

  url(params: Record<T['urlParams'], string>): string {
    return interpolate(this.apiUrl, params);
  }

  query(params: { [key in keyof Record<T['queryParams'], string>]: QueryParam }): NavigationExtras {
    return QueryUtil.query(params, this.arrayFormatType);
  }
```

### Params
#### Properties:
- `urlParams` - keys to interpolate URL
- `fragment` (optional) - fragment keys
- `queryParams` (optional) - query params keys

#### Source code:
```
export interface Params {
  urlParams: string;
  fragment?: string;
  queryParams?: string;
}
```

URL Factory
-
Factory is used to generate urls. Following overloads are available:
1. `urlFactory(url: string, interpolatable?: false): Url`
    - params:
        - `url` - url address, which can be interpolated
        - `interpolatable` - boolean value, used to decide if URL value should be interpolated. Default `false`. 
    - returned value: an `Url` object
    
2. `urlFactory<T extends Params>(url: string, interpolatable: true): InterpolatableUrl<T>`
    - params:
        - `T extends Params` - generic type defining params for an URL
        - `url` - URL address, which can be interpolated

Examples
-
#### Initialization
First import `TypedUrlsModule` in root of your project, and call `forRoot()` method.
```
NgModule({
  imports: [
    TypedUrlsModule.forRoot()
  ]
})
export class AppModule {}
```
Then you can use this like the following:
```
const googleUrl = urlFactory('http://google.com');
console.log(googleUrl.url()); // prints "http://google.com"

const googleUrlWithFragment = urlFactory<{fragment: "true"}>('http://google.com');
console.log(googleUrlWithFragment.fragment({fragment: 'someFragment'})); // prints "NavigationExtras {fragment: 'someFragment'}"

const googleUrlWithQuery = urlFactory<{queryParams: "param1" | "param2"}>('http://google.com');
console.log(googleUrlWithQuery.query({param1: [1, 2], param2: "test"}));   // prints "NavigationExtras {params: {param1: [1, 2], param2: "test"}}"
```
