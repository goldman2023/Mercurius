import { Component } from '@angular/core';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import { ActivatedRoute } from '@angular/router';
import { View, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-employee-information',
  templateUrl: './employee-information.component.html',
  styleUrls: ['./employee-information.component.scss']
  })
export class EmployeeInformationComponent  {

  // constructor( private headerTitleService: HeaderTitleService) {
  //   this.headerTitleService.setBackUrl('sTlines-dashboard');
  //   this.headerTitleService.setForwardUrl('sTlines-dashboard/daily-worksheet/schedule-worksheet');
  // }
  public currentDate: Date = new Date();

  public newViewMode: View = 'Month';

  public eventData: EventSettingsModel;
  empid;
  bischid;
  presentEmployee;
  constructor(
    private headerTitleService: HeaderTitleService,
    private route: ActivatedRoute,
    public manageSchedule: ManageScheduleService,
    public employeeService: EmployeeService,
    public serviceService: ServiceService
  ) {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setBackUrl(
      'sTlines-dashboard/daily-worksheet/schedule-worksheet'
    );
    this.headerTitleService.setForwardUrl('');
    this.serviceService.empID$.subscribe(empid => {
      if(empid)
      this.employeeService.getEmpDataBasedOnEmpId(empid).subscribe(res => this.presentEmployee = res)
    })
    
  }
}
