import { TestBed } from '@angular/core/testing';

import { BidLeaveService } from './bid-leave.service';

describe('BidLeaveService', () => {
  let service: BidLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
