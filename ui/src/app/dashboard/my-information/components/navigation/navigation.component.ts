import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/dashboard/admin/shared-data.service';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent  {
  dailyWorksheetNavs
  empId
  bischid
  constructor(public sharedData: SharedDataService,
    public employeeService: EmployeeService,
    public serviceService: ServiceService){
    this.dailyWorksheetNavs = sharedData.dailyWorksheet

    this.serviceService.empID$.subscribe(empid => {
      this.empId = empid
      this.bischid = localStorage.getItem('bidScheduleId');
    })
  }
}
