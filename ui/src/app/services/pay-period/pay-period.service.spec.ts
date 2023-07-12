import { TestBed } from '@angular/core/testing';

import { PayPeriodService } from './pay-period.service';

describe('PayPeriodService', () => {
  let service: PayPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
