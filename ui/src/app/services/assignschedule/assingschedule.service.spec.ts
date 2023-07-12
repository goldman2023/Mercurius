import { TestBed } from '@angular/core/testing';

import { AssingscheduleService } from './assingschedule.service';

describe('AssingscheduleService', () => {
  let service: AssingscheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssingscheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
