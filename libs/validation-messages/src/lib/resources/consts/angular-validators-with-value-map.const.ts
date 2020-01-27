import { AngularValidatorValue } from '../enums/angular-validator-value.enum';
import { AngularValidatorsWithValue } from '../enums/angular-validators-with-value.enum';

export const angularValidatorsWithValueMap = {
  [AngularValidatorsWithValue.MaxLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.MinLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.Pattern]: AngularValidatorValue.RequiredPattern
};
