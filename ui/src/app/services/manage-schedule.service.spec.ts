import { TestBed } from '@angular/core/testing';

import { ManageScheduleService } from './manage-schedule.service';

describe('ManageScheduleService', () => {
  let service: ManageScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
