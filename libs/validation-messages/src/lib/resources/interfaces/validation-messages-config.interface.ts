import { ValidationMessage } from './validation-message.interface';

export interface ValidationMessagesConfig<T = string | ValidationMessage> {
  [key: string]: T;
}
