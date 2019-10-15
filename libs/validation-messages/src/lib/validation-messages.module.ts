import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { ValidationMessagesService } from './services/validation-messages.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent],
  providers: [ValidationMessagesService]
})
export class ValidationMessagesModule {}
