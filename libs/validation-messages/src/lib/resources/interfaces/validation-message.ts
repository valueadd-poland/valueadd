export interface ValidationMessage {
  message: string;
  validatorValue?: string;
  pattern?: string;
  validatorValueParser?: (value: any) => string;
  templateMatcher?: RegExp;
}
