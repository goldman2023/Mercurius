import { Injectable } from '@angular/core';
import { baseUrls } from 'src/app/services/constants/baseUrl';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor() {}

  public navs = [
    { navLink: 'roles', navName: 'Roles' },
    { navLink: 'permissions', navName: 'Permissions' },
    { navLink: 'qualifications', navName: 'Qualifications' },
    { navLink: 'facility-type', navName: 'Facility Type' },
    { navLink: 'facility', navName: 'Facility' },
    { navLink: 'employees', navName: 'Employees' },
    { navLink: 'shift-category', navName: 'Shift Category' },
    { navLink: 'system-shifts', navName: 'System Shifts' },
    { navLink: 'user-shifts', navName: 'User Shifts' },
    { navLink: 'pay-periods', navName: 'Pay Periods' },
  ];

  public dailyWorksheet = [
    { navLink: 'schedule', navName: 'Schedule' },
    { navLink: 'requests', navName: 'Requests' },
    { navLink: 'overtime', navName: 'Overtime' },
    { navLink: 'other-duties', navName: 'Other Duties' },
  ];

  public empList = [
    { navLink: 'am', navName: 'Amit Mukherjee' },
    { navLink: 'em', navName: 'Employee Name' },
    { navLink: 'em2', navName: 'Employee Name 1' },
    { navLink: 'em3', navName: 'Employee Name 2' },
    { navLink: 'em4', navName: 'Employee Name 3' },
    { navLink: 'em5', navName: 'Employee Name 4' },
    { navLink: 'em6', navName: 'Employee Name 5' },
  ];

  public baseUrl() {
    switch (location.hostname) {
      case 'localhost' || '127.0.0.1':
        return baseUrls.LOCALENV;

      case 'dev.straightlines.io' || '3.13.254.87':
        return baseUrls.DEVENV;

      case 'test.straightlines.io' || '52.14.8.217':
        return baseUrls.TESTENV;

      case 'staging.straightlines.io' || '3.140.109.198':
        return baseUrls.STAGING;

      default:
        return baseUrls.DEFAULT;
    }
  }
}
