import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { View, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { ServiceService } from '../../service.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import { Location } from '@angular/common';
import { ScrollService } from '../../scroll.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  public eventData: EventSettingsModel;
  empid;
  bischid;
  Bidparamesget: any = [];
  allEmployees: any = [];
  presentEmployee;
  empData;
  currentSection 
  constructor(
    public scheduleComponent: ServiceService,
    public manageSchedule: ManageScheduleService,
    public employeeService: EmployeeService,
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    public serviceService: ServiceService
  ) {}
  ngOnInit(): void {
    this.bischid = localStorage.getItem('bidScheduleId');
    this.getEmployeeListByBidScheduleID();
  }
  sortEmployeesByRank(employees) {
    return employees.sort((a, b) => {
      return a.rank - b.rank;
    });
  }
  getEmployeeListByBidScheduleID() {
    this.allEmployees = [];
    this.manageSchedule
      .GetBidParamgetAllEmpIdBasedonBidschId(
        this.bischid
      )
      .subscribe((res) => {
        this.allEmployees = res
      });
  }
  scrollToId(id: string) {
    this.scrollService.scrollToElementById(id);
  }
  @ViewChild('employeeList') employeeList: ElementRef;
  goDown2(emp) {
    this.serviceService.emDetails$.next(emp)
    this.serviceService.empID$.next(emp.empid)
    const activeIndex = this.sortEmployeesByRank(this.allEmployees).findIndex(employee => employee.empid === emp.empid);
    
    this.employeeList.nativeElement.scrollTop = activeIndex * 50; 
  }
  
  

}
