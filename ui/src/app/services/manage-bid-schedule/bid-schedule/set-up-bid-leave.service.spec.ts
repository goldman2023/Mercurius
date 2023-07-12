import { TestBed } from '@angular/core/testing';

import { SetUpBidLeaveService } from './set-up-bid-leave.service';

describe('SetUpBidLeaveService', () => {
  let service: SetUpBidLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetUpBidLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
