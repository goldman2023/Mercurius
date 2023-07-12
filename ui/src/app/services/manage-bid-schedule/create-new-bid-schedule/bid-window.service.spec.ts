import { TestBed } from '@angular/core/testing';

import { BidWindowService } from './bid-window.service';

describe('BidWindowService', () => {
  let service: BidWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
