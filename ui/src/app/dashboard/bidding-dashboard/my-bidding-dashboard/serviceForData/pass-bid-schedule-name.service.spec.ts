import { TestBed } from '@angular/core/testing';

import { PassBidScheduleNameService } from './pass-bid-schedule-name.service';

describe('PassBidScheduleNameService', () => {
  let service: PassBidScheduleNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassBidScheduleNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
