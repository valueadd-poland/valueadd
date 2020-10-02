import { async, TestBed } from '@angular/core/testing';
import { SelectionModelModule } from './selection-model.module';

describe('SelectionModelModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SelectionModelModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SelectionModelModule).toBeDefined();
  });
});
