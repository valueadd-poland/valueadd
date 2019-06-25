# Installation

`npm install @valueadd/ng-validation-messages`

# Usage

### 1. Import ValidationMessagesModule

Import ValidationMessagesModule in the module of your application you'd like to use ng-validation-messages component.

```
@NgModule({
    exports: [
        CommonModule,
        ValidationMessagesModule
    ]
})
export class SharedModule { }
```


### 2. Configuration

Inject ValidationMessagesService in the constructor of the root module of your application, or, create a service
which is provided in root which will have ValidationMessagesService injected.

```
export class AppModule { 
  constructor(private validationMessagesService: ValidationMessagesService) {}
}
```

```
@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesConfigService {
  constructor(private validationMessagesService: ValidationMessagesService) {}
}
```

Define the messages for validators by creating a config object of type ValidationMessagesConfig. We can provide the definitions in multiple ways, the simpliest form is a key value pair where the key is the key of the validator in Form Control's "errors" object and the value is the error message to be displayed.

```
const validationMessagesConfig: ValidationMessagesConfig = {
    email: 'This email is invalid!',
    min: 'This field must have at least {{value}} characters.'
}
```

Another form is to provide under a key an object of type ValidationMessage: 

```
export interface ValidationMessage {
  message: string;
  validatorValue?: string;
  pattern?: string;
  validatorValueParser?: (value: any) => string;
  templateMatcher?: RegExp;
}
```

`validatorValue`: specifies the name of the property under the validator name in Form Control errrors object from where the value for interpolation will be taken. 

`validatorValueParser`: specifies a function to parse the validator value

`templateMatcher`: specifies which part of the message string will be replaced with interpolated value (the default matcher is /{{(.*)}}+/g)

`pattern`: specifies pattern for which the message will be shown when using Angular pattern validator

Once a configuration object is created, pass it as parameter to setValidationMessage method on ValidationMessagesService:

```
this.validationMessagesService.setValidationMessages(validationMessagesConfig);
```

Now, in some component's template, instantiate ValidationMessagesComponent and pass it a Form Control with validators attached to it:

```
<ng-validation-messages [control]="emailControl">
</ng-validation-messages>
```

# 3. API

### ValidationMessagesService

##### Methods:
`setValidationMessages(config: ValidationMessagesConfig)`: Sets validation messages configuration

`setTemplateMatcher(matcher: RegExp)`: Sets specifies which part of the message string will be replaced with interpolated value (the default matcher is `/{{(.*)}}+/g`)

`useMaterialErrorMatcher()`: If ValidationMessagesComponent is used together with custom errorStateMatcher for Angular Material's matInput and this method is called, the errors will be shown instantly and not on lost focus (errorStateMatcher needs to reflect that). 

### ValidationMessagesComponent

##### Inputs:
`control: FormControl`: Specifies for which control errors should be shown 

`multiple: boolean`: Specifies wether to show multiple error messages (default: false)

`apiErrorMessages: Array<string | ApiErrorMessage>`: If an error is returned from an API request, this input allows to display it instantly













