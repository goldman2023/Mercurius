import { TestBed } from '@angular/core/testing';

import { MyBiddingService } from './my-bidding.service';

describe('MyBiddingService', () => {
  let service: MyBiddingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyBiddingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
