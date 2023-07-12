import { TestBed } from '@angular/core/testing';

import { ScheduleLeaveSummaryService } from './schedule-leave-summary.service';

describe('ScheduleLeaveSummaryService', () => {
  let service: ScheduleLeaveSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleLeaveSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
