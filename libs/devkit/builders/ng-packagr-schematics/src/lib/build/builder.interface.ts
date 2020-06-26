export interface Builder {
  build(): Promise<void>;

  watch(): Promise<void>;
}
