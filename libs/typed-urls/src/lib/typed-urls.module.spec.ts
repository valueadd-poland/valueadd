import { async, TestBed } from '@angular/core/testing';
import { TypedUrlsModule } from './typed-urls.module';

describe('TypedUrlsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TypedUrlsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TypedUrlsModule).toBeDefined();
  });
});
