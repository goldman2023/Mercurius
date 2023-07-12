import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { WeeklyScheduleComponent } from '../weekly-schedule/weekly-schedule.component';
import { SharedDataService } from 'src/app/dashboard/admin/shared-data.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';
import { DailyScheduleComponent } from '../daily-schedule/daily-schedule.component';
interface Shceduel {
  areaid: number;
  bidscheduleid: number;
  empid: number;
  managerid: number;
  empFirstName: string;
  empLastName: string;
  empinitials: string;
  year: string;
  shiftInfo:any;
  vacationInfo:any;
}

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
})
export class EmployeeInfoComponent implements OnInit {
  empData;
  bid_schedule_data;
  shiftlineScheduleData;
  empID;
  selectedShiftLineScheduleData: any = [];

  empid
  bidscheduleid
  wroksheetData :Shceduel 
  firstName
  lastName
  initial
  isdataAvailable = false
  presentEmployee: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WeeklyScheduleComponent,
    @Inject(MAT_DIALOG_DATA) public dailydata: DailyScheduleComponent,
    public dialogRef: MatDialogRef<EmployeeInfoComponent>,
    public sharedData: SharedDataService,
    public employeeService: EmployeeService,
    public serviceService: ServiceService
  ) {

    this.serviceService.empID$.subscribe(empid => {
      this.empId = empid
      this.bischid = localStorage.getItem('bidScheduleId');
    })
  }
  schedule_type;
  empId
  bischid

  ngOnInit(): void {
    let empData
    if(this.data){
       empData = this.data[0]
       this.presentEmployee = this.data[0].empData
       
    }else{
      empData = this.dailydata[0]
      this.presentEmployee = this.dailydata[0].empData
    }
    this.employeeService.getWorksheet(empData.bidScheduleData, empData.empData.empid).subscribe(res => {
      this.isdataAvailable = true
      this.wroksheetData = res;
      this.firstName = this.wroksheetData.empFirstName
      this.lastName = this.wroksheetData.empLastName
      this.initial = this.wroksheetData.empinitials
        this.serviceService.emDetails$.next(res)
    })
  }
  close() {
    this.dialogRef.close();
  }
  
}
