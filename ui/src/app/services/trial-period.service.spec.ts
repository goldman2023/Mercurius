import { TestBed } from '@angular/core/testing';

import { TrialPeriodService } from './trial-period.service';

describe('TrialPeriodService', () => {
  let service: TrialPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
