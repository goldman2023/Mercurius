import { TestBed } from '@angular/core/testing';

import { RequestDemoService } from './request-demo.service';

describe('RequestDemoService', () => {
  let service: RequestDemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestDemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
