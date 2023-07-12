import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import { ServiceService } from '../employee-information/service.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-my-information',
  templateUrl: './my-information.component.html',
  styleUrls: ['./my-information.component.scss']
})
export class MyInformationComponent implements OnInit {
  wroksheetData
  user_data
  constructor(
    private headerTitleService: HeaderTitleService,
    public serviceService: ServiceService,
    private employeeService: EmployeeService,) { }

  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.headerTitleService.setTitle('');
    this.headerTitleService.setBackUrl('sTlines-dashboard/manage-schedules');
    this.headerTitleService.setForwardUrl('');
    this.headerTitleService.setDefaultHeader(true);
    this.employeeService.getEmployeeDetailBasedonEmpId(this.user_data.empid).subscribe(res => {
      this.wroksheetData = res
    })
    
  }

}
