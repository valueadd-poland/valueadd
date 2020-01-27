import { ValidatorValue } from '../enums/validator-value.enum';
import { ValidatorWithValue } from '../enums/validator-with-value.enum';

export const validatorsWithValue = {
  [ValidatorWithValue.MaxLength]: ValidatorValue.RequiredLength,
  [ValidatorWithValue.MinLength]: ValidatorValue.RequiredLength,
  [ValidatorWithValue.Pattern]: ValidatorValue.RequiredPattern
};
