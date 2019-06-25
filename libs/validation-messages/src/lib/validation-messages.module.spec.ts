import { async, TestBed } from '@angular/core/testing';
import { ValidationMessagesModule } from './validation-messages.module';

describe('ValidationMessagesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ValidationMessagesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ValidationMessagesModule).toBeDefined();
  });
});
