import { TestBed } from '@angular/core/testing';

import { BusinessRulesValidationService } from './business-rules-validation.service';

describe('BusinessRulesValidationService', () => {
  let service: BusinessRulesValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessRulesValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
