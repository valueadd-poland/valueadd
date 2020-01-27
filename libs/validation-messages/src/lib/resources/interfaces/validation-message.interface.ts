export interface ValidationMessage {
  message: string;
  pattern?: string;
  templateMatcher?: RegExp;
  validatorValue?: string;
  validatorValueParser?: (value: any) => string;
}
