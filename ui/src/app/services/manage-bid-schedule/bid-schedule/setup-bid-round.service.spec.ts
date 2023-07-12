import { TestBed } from '@angular/core/testing';

import { SetupBidRoundService } from './setup-bid-round.service';

describe('SetupBidRoundService', () => {
  let service: SetupBidRoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetupBidRoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
