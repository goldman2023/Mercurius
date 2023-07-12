import { TestBed } from '@angular/core/testing';

import { BidScheduleService } from './bid-schedule.service';

describe('BidScheduleService', () => {
  let service: BidScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
