import { TestBed } from '@angular/core/testing';

import { PhoneVerificationService } from './phone-verification.service';

describe('PhoneVerificationService', () => {
  let service: PhoneVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
