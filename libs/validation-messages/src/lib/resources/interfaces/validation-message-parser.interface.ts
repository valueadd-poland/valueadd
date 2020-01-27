export interface ValidationMessageParser {
  parse: ((str: string, params?: any) => string) | null;
}
