import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,
  ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import * as scheduel  from '@syncfusion/ej2-angular-schedule';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavController } from '@ionic/angular';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import moment from 'moment';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';

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
  selector: 'app-emp-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService], 
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class EmpScheduleComponent implements OnInit {
  public currentDate: Date = new Date();

  public newViewMode: View = 'Month';

  public eventData: EventSettingsModel
  @ViewChild('scheduleObj')
  public scheduleObj: scheduel.ScheduleComponent;
  empid
  bidscheduleid
  wroksheetData :Shceduel 
  firstName
  lastName
  initial
  isdataAvailable = false
  user_data 
  presentEmployee
  
  overlayRef: OverlayRef | null;
  constructor(public dialog: MatDialog, private ref: ChangeDetectorRef,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private employeeService: EmployeeService,
    public serviceService: ServiceService,
    ) {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.empid = this.user_data.empid
    
    this.employeeService.getEmpDataBasedOnEmpId(this.empid).subscribe(res => 
      {
        this.presentEmployee = res
      })
    }
    ngOnInit(): void {
    
    
      this.employeeService.getWorksheet( Object.keys(this.user_data.bidmap)[0], this.empid).subscribe(res => {
        this.isdataAvailable = true
        this.wroksheetData = res;
        this.firstName = this.wroksheetData.empFirstName
        this.lastName = this.wroksheetData.empLastName
        this.initial = this.wroksheetData.empinitials
          this.serviceService.emDetails$.next(res)
      })
    }

}
