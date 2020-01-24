import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFormatType } from './resources/enums';
import { ARRAY_FORMAT_TYPE } from './resources/tokens';

@NgModule({
  imports: [CommonModule]
})
export class TypedUrlsModule {
  static forRoot(arrayFormatType = ArrayFormatType.None): ModuleWithProviders {
    return {
      ngModule: TypedUrlsModule,
      providers: [
        {
          provide: ARRAY_FORMAT_TYPE,
          useValue: arrayFormatType
        }
      ]
    };
  }
}
