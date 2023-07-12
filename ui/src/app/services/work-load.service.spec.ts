import { TestBed } from '@angular/core/testing';

import { WorkLoadService } from './work-load.service';

describe('WorkLoadService', () => {
  let service: WorkLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
