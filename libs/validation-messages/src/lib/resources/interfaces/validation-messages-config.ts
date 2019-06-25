import { ValidationMessage } from './validation-message';

export interface ValidationMessagesConfig<T = string | ValidationMessage> {
  [key: string]: T;
}
