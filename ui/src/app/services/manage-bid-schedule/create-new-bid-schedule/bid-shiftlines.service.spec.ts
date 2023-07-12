import { TestBed } from '@angular/core/testing';

import { BidShiftlinesService } from './bid-shiftlines.service';

describe('BidShiftlinesService', () => {
  let service: BidShiftlinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidShiftlinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
