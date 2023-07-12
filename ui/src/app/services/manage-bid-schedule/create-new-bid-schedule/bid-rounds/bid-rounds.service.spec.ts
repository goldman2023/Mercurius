import { TestBed } from '@angular/core/testing';

import { BidRoundsService } from './bid-rounds.service';

describe('BidRoundsService', () => {
  let service: BidRoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidRoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
