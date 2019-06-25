import { AngularValidatorsWithValue, AngularValidatorValue } from '../enums';

export const angularValidatorsWithValueMap = {
  [AngularValidatorsWithValue.MaxLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.MinLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.Pattern]: AngularValidatorValue.RequiredPattern
};
