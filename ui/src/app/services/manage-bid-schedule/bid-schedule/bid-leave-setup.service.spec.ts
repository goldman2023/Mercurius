import { TestBed } from '@angular/core/testing';

import { BidLeaveSetupService } from './bid-leave-setup.service';

describe('BidLeaveSetupService', () => {
  let service: BidLeaveSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidLeaveSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
