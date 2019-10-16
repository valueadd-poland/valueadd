import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent]
})
export class ValidationMessagesModule {}
