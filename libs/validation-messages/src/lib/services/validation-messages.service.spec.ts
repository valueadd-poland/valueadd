import { TestBed } from '@angular/core/testing';
import { ValidationMessagesConfig } from '../resources/interfaces';
import { ValidationMessagesService } from './validation-messages.service';

describe('ValidationMessagesService', () => {
  let service: ValidationMessagesService;
  const errorMessages: ValidationMessagesConfig = {
    documentType: 'Invalid document type.',
    email: 'Invalid e-mail address.',
    emailDomain: 'Invalid email domain, it should be @valueadd.pl',
    length: 'This field should be {{value}} characters long.',
    matDatepickerMax: 'The date can not be later than {{value}}.',
    matDatepickerMin: 'The date can not be earlier than {{value}}.',
    max: 'This field value should be lower than {{value}}.',
    maxlength: 'This field should have maximum {{value}} characters.',
    min: 'This field value should be greater than {{value}}.',
    minlength: 'This field should contain at least {{value}} characters.',
    required: 'This field is required.',
    pattern: {
      message: 'patternIssue',
      validatorValue: 'requiredPattern',
      pattern: '^[a-zA-Z]*$'
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationMessagesService]
    });

    service = TestBed.get(ValidationMessagesService);
    service.setValidationMessages(errorMessages);
  });

  it('should return empty string if there is no validator', () => {
    const msg = service.getValidatorErrorMessage(undefined as any);
    expect(msg).toEqual('');
  });

  it('should return validation message for Validators.email', () => {
    const msg = service.getValidatorErrorMessage('email');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.min', () => {
    const msg = service.getValidatorErrorMessage('min');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.max', () => {
    const msg = service.getValidatorErrorMessage('max');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.maxlength', () => {
    const msg = service.getValidatorErrorMessage('maxlength');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.minlength', () => {
    const msg = service.getValidatorErrorMessage('minlength');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.required', () => {
    const msg = service.getValidatorErrorMessage('required');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.length', () => {
    const msg = service.getValidatorErrorMessage('length');
    expect(!!msg).toBeTruthy();
  });
});
