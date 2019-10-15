import { Injectable } from '@angular/core';
import { angularValidatorsWithValueMap } from '../resources/consts';
import { Memoize } from '../resources/decorators';
import { Parser, ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable()
export class ValidationMessagesService {
  private parser: Parser | null;
  private validationMessagesFinalConfig: ValidationMessagesConfig<ValidationMessage> = {};
  private templateMatcher: RegExp = /{{(.*)}}+/g;
  private _materialErrorMatcher = false;

  get materialErrorMatcher(): boolean {
    return this._materialErrorMatcher;
  }

  @Memoize()
  getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (!this.validationMessagesFinalConfig[validatorName]) {
      return this.validatorNotSpecified(validatorName);
    }

    if (validatorName === 'pattern') {
      if (!this.validationMessagesFinalConfig[validatorName][validatorValue.requiredPattern]) {
        return this.validatorNotSpecified(validatorName);
      }

      return this.validationMessagesFinalConfig[validatorName][validatorValue.requiredPattern]
        .message;
    }

    const validatorMessage = this.validationMessagesFinalConfig[validatorName];
    return validatorMessage.validatorValue
      ? this.interpolateValue(
          validatorMessage.message,
          validatorMessage.validatorValueParser
            ? validatorMessage.validatorValueParser(validatorValue[validatorMessage.validatorValue])
            : validatorValue[validatorMessage.validatorValue]
        )
      : validatorMessage.message;
  }

  setValidationMessages(validationMessagesConfig: ValidationMessagesConfig): void {
    const validationMessagesFinalConfig = {};
    // Clear memoized cache. Find different way to access clear method
    if ((this.getValidatorErrorMessage as any).clear) {
      (this.getValidatorErrorMessage as any).clear();
    }

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

  setServerMessagesParser(serverMessageParser: Parser | null): void {
    this.parser = serverMessageParser;
  }

  useMaterialErrorMatcher(): void {
    this._materialErrorMatcher = true;
  }

  parseApiErrorMessage(message: string, params: any): string {
    if (this.parser) {
      return this.parser.parse(message, params);
    }

    return message;
  }

  setTemplateMatcher(templateMatcher: RegExp): void {
    if (templateMatcher instanceof RegExp) {
      this.templateMatcher = templateMatcher;
    } else {
      console.error('Template matcher must be a regex.');
    }
  }

  private interpolateValue(str: string, value: any): string {
    return str.replace(new RegExp(this.templateMatcher), value);
  }

  private getValidatorValue(key: string): string {
    return angularValidatorsWithValueMap[key] || key;
  }

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
