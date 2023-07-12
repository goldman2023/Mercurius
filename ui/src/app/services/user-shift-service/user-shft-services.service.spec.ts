import { TestBed } from '@angular/core/testing';

import { UserShftServicesService } from './user-shft-services.service';

describe('UserShftServicesService', () => {
  let service: UserShftServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserShftServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
