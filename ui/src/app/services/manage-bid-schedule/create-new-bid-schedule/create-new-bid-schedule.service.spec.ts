import { TestBed } from '@angular/core/testing';

import { CreateNewBidScheduleService } from './create-new-bid-schedule.service';

describe('CreateNewBidScheduleService', () => {
  let service: CreateNewBidScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNewBidScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
