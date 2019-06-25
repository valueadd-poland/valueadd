import { ValidatorValue, ValidatorWithValue } from '../enums';

export const validatorsWithValue = {
  [ValidatorWithValue.MaxLength]: ValidatorValue.RequiredLength,
  [ValidatorWithValue.MinLength]: ValidatorValue.RequiredLength,
  [ValidatorWithValue.Pattern]: ValidatorValue.RequiredPattern
};
