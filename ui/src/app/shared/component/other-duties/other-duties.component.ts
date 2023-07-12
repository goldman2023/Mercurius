import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { PayPeriodService } from 'src/app/services/pay-period/pay-period.service';

export interface PeriodicElement {
  submittedForDate: string;
  description: string;
  submitteddate: string;
}


@Component({
  selector: 'app-other-duties',
  templateUrl: './other-duties.component.html',
  styleUrls: ['./other-duties.component.scss']
})
export class OtherDutiesComponent implements OnInit {
  length = 5;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent

  @Input() empId  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['submittedForDate', 'description', 'submitteddate'];
  dataSource
  constructor(
    private payPeriodService: PayPeriodService,) { }

  ngOnInit(): void {
    this.payPeriodService.getAllEmployeeNotesByEmpId(this.empId).subscribe(res => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
}
