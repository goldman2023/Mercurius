import { TestBed } from '@angular/core/testing';

import { GeneratedScheduleService } from './generated-schedule.service';

describe('GeneratedScheduleService', () => {
  let service: GeneratedScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratedScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
