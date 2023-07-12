import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

 public empID$ = new BehaviorSubject<any>(0);
 public employeeList$ = new BehaviorSubject<any>([]);
 public bidShceduleID$ = new BehaviorSubject<any>(null);
 public emDetails$ = new BehaviorSubject<any>({});
 public emFullDetails$ = new BehaviorSubject<any>({});

  constructor() { }


  employeeList(empLilst) {
    this.employeeList$.next(empLilst);
  }
  bidScheduleId(id) {
    this.bidShceduleID$.next(id);
  }
  empId(id) {
    this.empID$.next(id);
  }
  empDetails(id) {
    this.emDetails$.next({});
  }
  empFullDetails(id) {
    this.emFullDetails$.next({});
  }
}
