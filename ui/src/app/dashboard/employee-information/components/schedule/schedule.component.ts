import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { ServiceService } from '../../service.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, take } from 'rxjs/operators';
import { SubmitRequestModalComponent } from 'src/app/dashboard/manage-schedules/component/submit-request-modal/submit-request-modal.component';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public currentDate: Date = new Date();

  public newViewMode: View = 'Month';

  public eventData: EventSettingsModel;
  empid;
  bischid;
  presentEmployee;




  wroksheetData :Shceduel 
  firstName
  lastName
  initial
  isdataAvailable = false
  fullEmpDetails: any
  @ViewChild('userMenu') userMenu: TemplateRef<any>;
  
  overlayRef: OverlayRef | null;


  constructor(
    private headerTitleService: HeaderTitleService,
    private route: ActivatedRoute,
    public manageSchedule: ManageScheduleService,
    public employeeService: EmployeeService,
    public serviceService: ServiceService,
    public dialog: MatDialog, private ref: ChangeDetectorRef,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private modal: NgbModal,
  ) {
    this.headerTitleService.setTitle(' ');
    this.headerTitleService.setBackUrl(
      'sTlines-dashboard/daily-worksheet/schedule-worksheet'
    );
    this.headerTitleService.setForwardUrl('');
    this.empid = this.route.snapshot.paramMap.get('empid');
    this.bischid = this.route.snapshot.paramMap.get('bischid');
    
    this.employeeService.getEmpDataBasedOnEmpId(this.empid).subscribe(res => 
      {
        this.presentEmployee = res
      })
    this.serviceService.empID$.next(this.empid)
  }

  ngOnInit(): void {
    
    
    this.employeeService.getWorksheet(this.bischid, this.empid).subscribe(res => {
      this.isdataAvailable = true
      this.wroksheetData = res;
      this.firstName = this.wroksheetData.empFirstName
      this.lastName = this.wroksheetData.empLastName
      this.initial = this.wroksheetData.empinitials
        this.serviceService.emDetails$.next(res)
    })
  }
  
  
}
