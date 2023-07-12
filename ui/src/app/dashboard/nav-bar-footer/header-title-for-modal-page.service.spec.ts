import { TestBed } from '@angular/core/testing';

import { HeaderTitleForModalPageService } from './header-title-for-modal-page.service';

describe('HeaderTitleForModalPageService', () => {
  let service: HeaderTitleForModalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderTitleForModalPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
