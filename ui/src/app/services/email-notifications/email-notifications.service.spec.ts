import { TestBed } from '@angular/core/testing';

import { EmailNotificationsService } from './email-notifications.service';

describe('EmailNotificationsService', () => {
  let service: EmailNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
