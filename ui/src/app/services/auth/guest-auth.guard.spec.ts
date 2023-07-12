import { TestBed } from '@angular/core/testing';

import { GuestAuthGuard } from './guest-auth.guard';

describe('GuestAuthGuard', () => {
  let guard: GuestAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuestAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
