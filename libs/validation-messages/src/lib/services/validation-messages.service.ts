import { Injectable } from '@angular/core';
import { angularValidatorsWithValueMap } from '../resources/consts/angular-validators-with-value-map.const';
import { ValidationMessageParser } from '../resources/interfaces/validation-message-parser.interface';
import { ValidationMessage } from '../resources/interfaces/validation-message.interface';
import { ValidationMessagesConfig } from '../resources/interfaces/validation-messages-config.interface';

let cache: { [key: string]: string } = {};

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private _materialErrorMatcher = false;
  private parser: ValidationMessageParser | null;
  private templateMatcher: RegExp = /{{(.*)}}+/g;
  private validationMessagesFinalConfig: ValidationMessagesConfig<ValidationMessage> = {};

  get materialErrorMatcher(): boolean {
    return this._materialErrorMatcher;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    const cacheKey = `${validatorName}${JSON.stringify(validatorValue)}`;

    if (cache[cacheKey] !== undefined) {
      return cache[cacheKey];
    }

    if (!this.validationMessagesFinalConfig[validatorName]) {
      return (cache[cacheKey] = this.validatorNotSpecified(validatorName));
    }

    if (validatorName === 'pattern') {
      if (!this.validationMessagesFinalConfig[validatorName][validatorValue.requiredPattern]) {
        return (cache[cacheKey] = this.validatorNotSpecified(validatorName));
      }

      return (cache[cacheKey] = this.validationMessagesFinalConfig[validatorName][
        validatorValue.requiredPattern
      ].message);
    }

    const validatorMessage = this.validationMessagesFinalConfig[validatorName];

    return (cache[cacheKey] = validatorMessage.validatorValue
      ? this.interpolateValue(
          validatorMessage.message,
          validatorMessage.validatorValueParser
            ? validatorMessage.validatorValueParser(validatorValue[validatorMessage.validatorValue])
            : validatorValue[validatorMessage.validatorValue]
        )
      : validatorMessage.message);
  }

  parseApiErrorMessage(message: string, params: any): string {
    if (this.parser) {
      return this.parser.parse(message, params);
    }

    return message;
  }

  setServerMessagesParser(serverMessageParser: ValidationMessageParser | null): void {
    this.parser = serverMessageParser;
  }

  setTemplateMatcher(templateMatcher: RegExp): void {
    if (templateMatcher instanceof RegExp) {
      this.templateMatcher = templateMatcher;
    } else {
      console.error('Template matcher must be a regex.');
    }
  }

  setValidationMessages(validationMessagesConfig: ValidationMessagesConfig): void {
    const validationMessagesFinalConfig = {};
    // Clear cache.
    cache = {};

    // Set validation errorMessages
    for (const key in validationMessagesConfig) {
      if (typeof validationMessagesConfig[key] === 'string') {
        validationMessagesFinalConfig[key] = {
          message: validationMessagesConfig[key],
          validatorValue: this.getValidatorValue(key)
        };
      } else {
        const validator = validationMessagesConfig[key] as ValidationMessage;
        if (validator.pattern) {
          validationMessagesFinalConfig['pattern'] = {
            ...validationMessagesFinalConfig['pattern'],
            [validator.pattern]: validator
          };
        } else {
          validationMessagesFinalConfig[key] = validator;
        }
      }
    }

    this.validationMessagesFinalConfig = { ...validationMessagesFinalConfig };
  }

  useMaterialErrorMatcher(): void {
    this._materialErrorMatcher = true;
  }

  private getValidatorValue(key: string): string {
    return angularValidatorsWithValueMap[key] || key;
  }

  private interpolateValue(str: string, value: any): string {
    return str.replace(new RegExp(this.templateMatcher), value);
  }

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
