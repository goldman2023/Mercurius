import { TestBed } from '@angular/core/testing';

import { BidVacationLeaveService } from './bid-vacation-leave.service';

describe('BidVacationLeaveService', () => {
  let service: BidVacationLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidVacationLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
