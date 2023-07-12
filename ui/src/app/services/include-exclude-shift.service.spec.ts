import { TestBed } from '@angular/core/testing';

import { IncludeExcludeShiftService } from './include-exclude-shift.service';

describe('IncludeExcludeShiftService', () => {
  let service: IncludeExcludeShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncludeExcludeShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
