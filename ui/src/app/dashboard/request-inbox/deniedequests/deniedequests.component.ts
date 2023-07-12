import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, ModalController } from '@ionic/angular';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { UserShftServicesService } from 'src/app/services/user-shift-service/user-shft-services.service';
import { ViewSubmitRequestComponent } from 'src/app/shared/component/view-submit-request/view-submit-request.component';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';

@Component({
  selector: 'app-deniede-requests',
  templateUrl: './deniedequests.component.html',
  styleUrls: ['./deniedequests.component.scss']
})
export class DeniedequestsComponent implements OnInit {


  displayedColumns: Array<string> = [
    'requestType',
    'leaveStartDate',
    'leaveEndDate',
    'shiftTimeChangeFrom',
    'shiftTimeChangeTo',
    'requestSubmittedDate',
    'empId',
    'action',
  ];
  dataSource;
  checkActive = 'I';
  data: any;
  action: any;
  constructor(
    private headerTitleService: HeaderTitleService,
    public dialog: MatDialog,
    private userShiftService: UserShftServicesService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public employeeService: EmployeeService,) { }

  @ViewChild(MatPaginator) paginatorPending!: MatPaginator;

  @ViewChild(MatSort) sortPending!: MatSort;
  user_data;
  filter: any = [];
  allData: any = [];

  pendingData
  ngOnInit(): void {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setBackUrl('sTlines-dashboard');
    this.headerTitleService.setForwardUrl('');
    this.headerTitleService.setDefaultHeader(true);

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));

    this.loadRequests()
  }

  loadRequests(){
    this.employeeService.getLeaveRequestBasedonbidManagerId(this.user_data.id).subscribe(res => {
      this.filter = res
          .reduce(
            (acc, current) => {
              const requestType = current.requestType;
              if (requestType != null && !acc.set.has(requestType)) {
                acc.set.add(requestType);
                acc.array.push(current);
              }
              return acc;
            },
            { set: new Set(), array: [] }
          )
          .array.sort((a, b) => {
            if (a.requestType < b.requestType) {
              return -1;
            }
            if (a.requestType > b.requestType) {
              return 1;
            }
            return 0;
          });
         this.pendingData = res.filter(response => response.status === "Denied")
          this.dataSource = new MatTableDataSource(this.pendingData);
          this.dataSource.sort = this.sortPending;
          this.dataSource.paginator = this.paginatorPending;

        })
  }

  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent

  pendingEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  filterChange(e) {
    this.dataSource.filter = e.value;
  }


  viewRequests(element){
    const dialogRef = this.dialog.open(ViewSubmitRequestComponent, {
      width: '822px',
      height: 'auto',
      data: {
        data:element,
        action:'View'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }



}
