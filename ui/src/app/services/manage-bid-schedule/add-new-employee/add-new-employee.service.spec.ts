import { TestBed } from '@angular/core/testing';

import { AddNewEmployeeService } from './add-new-employee.service';

describe('AddNewEmployeeService', () => {
  let service: AddNewEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddNewEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
