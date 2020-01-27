import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ValidationMessagesModule } from '@valueadd/validation-messages';

import { ValidationMessagesComponent } from './validation-messages.component';

describe('ValidationMessagesComponent', () => {
  let component: ValidationMessagesComponent;
  let fixture: ComponentFixture<ValidationMessagesComponent>;
  const expectedControl = new FormControl('', [
    Validators.email,
    Validators.min(10),
    Validators.max(10),
    Validators.maxLength(10),
    Validators.minLength(3),
    Validators.required
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ValidationMessagesModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationMessagesComponent);
    component = fixture.componentInstance;
    component.control = expectedControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
