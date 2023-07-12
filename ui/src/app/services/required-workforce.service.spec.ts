import { TestBed } from '@angular/core/testing';

import { RequiredWorkforceService } from './required-workforce.service';

describe('RequiredWorkforceService', () => {
  let service: RequiredWorkforceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequiredWorkforceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
