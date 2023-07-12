import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ViewSubmitRequestComponent } from '../view-submit-request/view-submit-request.component';




@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  user_data
  displayedColumns: Array<string> = [
    'requestType',
    'leaveStartDate',
    'leaveEndDate',
    'shiftTimeChangeFrom',
    'shiftTimeChangeTo',
    'requestSubmittedDate',
    'status',
    'empId',
    'action',
  ];
  dataSource 
  length = 5;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  checkActive = 'I';
  pageEvent

  @Input() empId: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  
  filter: any = [];
  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    public serviceService: ServiceService,
    private route: ActivatedRoute,
    ) { 
      this.user_data = JSON.parse(sessionStorage.getItem('userData'));
      if(!this.empId){
        if(this.route.snapshot.paramMap.get('empid')){
          this.empId = this.route.snapshot.paramMap.get('empid'); 
          this.serviceService.empID$.next(this.empId)
        }else{
          this.empId = this.user_data.empid
        }
      }

   
  }

  ngOnInit(): void {
    this.employeeService.getLeaveRequestBasedonEmpEd(this.empId).subscribe(res => {
      this.filter = res.sort((a, b) => {
            if (a.requestType < b.requestType) {
              return -1;
            }
            if (a.requestType > b.requestType) {
              return 1;
            }
            return 0;
    })
    this.dataSource = new MatTableDataSource(this.filter);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  })
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

handlePageEvent(e: PageEvent) {
  this.pageEvent = e;
  this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
}
filterUniqueRequestTypes(data,status) {
  const requestTypes = data.map(item => item[status]);
  const uniqueRequestTypes = new Set(requestTypes);
  const uniqueRequestTypesArray = Array.from(uniqueRequestTypes);
  return uniqueRequestTypesArray;
}

leaveCount(data, type) {
  let count = 0;
  data.forEach(item => {
    if (item.requestType === type) {
      const countDates = this.calculateDateDifference(item.leaveStartDate, item.leaveEndDate);
      count += countDates * item.shiftDuration;
    }
  });
  return count;
}
calculateDateDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.round(Math.abs((start.getTime() - end.getTime()) / millisecondsPerDay));
  return daysDifference + 1;
}
}
