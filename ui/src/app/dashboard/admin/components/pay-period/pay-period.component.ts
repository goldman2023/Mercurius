import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../store/app.reducers';
import * as QualificationAction from '../../store/admin.actions';
import { AddQualificationComponent } from '../qualifications/add-qualification/add-qualification.component';
import { UpdateQualificationsComponent } from '../qualifications/update-qualifications/update-qualifications.component';
import { PayPeriodService } from 'src/app/services/pay-period/pay-period.service';
import { FormBuilder, FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-pay-period',
  templateUrl: './pay-period.component.html',
  styleUrls: ['./pay-period.component.scss']
})
export class PayPeriodComponent implements OnInit {
  payPeriodForm

  years = [2018,2019,2020,2021,2022,2023]

  displayedColumns: Array<string> = ['name', 'start_date', 'end_date'];
  dataSource
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  Qualification
  checkActive = 'Active'
  currentYear = new Date()
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  user_data: any | {}

  allPeriods = []
  constructor(
    public dialog: MatDialog,
    private payPeriodService : PayPeriodService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.payPeriodForm = this.fb.group({
      year: new FormControl(parseInt(moment(this.currentYear).format("YYYY"))),
    })
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
   this.getAllPayPeriod()
  }
  getAllPayPeriod(){
    this.payPeriodService.getAllPayPeriod(this.payPeriodForm.value.year).subscribe( res =>{
      this.allPeriods = res
      this.allPeriods.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, ''), 10);
        const numB = parseInt(b.name.replace(/\D/g, ''), 10);
      
        return numA - numB;
      });
      this.setDataSource()
    })
  }
  setDataSource(){
      this.dataSource = new MatTableDataSource(this.allPeriods);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }
  createArrayOfDates(data) {
    const dateArray = [];
    const currentDate = new Date(data.start_date);
    const targetDate = new Date(data.end_date);
  
    while (currentDate <= targetDate) {
      let periods = 
        {
          ...data,
          start_date: currentDate.toISOString().split('T')[0],
          end_date :  moment(currentDate.setDate(currentDate.getDate() + 14)).format('YYYY-MM-DD')
        }
      dateArray.push(periods);
      currentDate.setDate(currentDate.getDate() + 14);
    }
    return dateArray
  }
  onChangeYear(){
    this.payPeriodForm.patchValue({
      year: this.payPeriodForm.value.year
    })
    this.getAllPayPeriod()
  }
  radioChange() {
    this.pageIndex = 0;
    // this.store.dispatch(new QualificationAction.GetAllQualification());
  }

  addNewRole() {
    const dialogRef = this.dialog.open(AddQualificationComponent,{
      width: '822px',
      height: '709px',
      data: {
        addName: 'Qualification'
      }
  });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateQualificationsComponent,{
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Qualification'
      }
  } );

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
 
getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }

  makeEditable(row: any) {
    row.editable = true;
  }

  makeNonEditable(row: any) {
    row.editable = false;
  }

  dateChange(event,element,index){
    this.updateStartDates(index, event.value)
  }

  updateStartDates(index: number, date: string): void {
    const startDate = moment(date).startOf('day');
    const year = startDate.year();
    const lastDayOfYear = moment({ year }).endOf('year');
    const payPeriodsToUpdate = this.allPeriods.slice(index);
  
    let payPeriodNumber = 1; 
  
    payPeriodsToUpdate.forEach((period, i) => {
      const currentDate = startDate.clone().add(i * 14, 'days');
      if (currentDate.year() === year) {
        period.start_date = currentDate.format('YYYY-MM-DD');
        period.name = `PP${payPeriodNumber}`;
        const newEndDate = currentDate.clone().add(13, 'days');
        period.end_date = newEndDate <= lastDayOfYear ? newEndDate.format('YYYY-MM-DD') : lastDayOfYear.format('YYYY-MM-DD');
        payPeriodNumber++;
      }
    });
  
    const lastIndexToUpdate = payPeriodsToUpdate.findIndex((period, i) => {
      const periodEndDate = startDate.clone().add(i * 14 + 13, 'days');
      return periodEndDate.isSameOrAfter(lastDayOfYear, 'day');
    });
  
    if (lastIndexToUpdate !== -1) {
      payPeriodsToUpdate[lastIndexToUpdate].end_date = lastDayOfYear.format('YYYY-MM-DD');
      this.allPeriods.splice(index + lastIndexToUpdate + 1);
    } else {
      const lastPeriod = payPeriodsToUpdate[payPeriodsToUpdate.length - 1];
      if (lastPeriod && moment(lastPeriod.start_date).isBefore(lastDayOfYear, 'day')) {
        let currentDate = moment(lastPeriod.start_date);
        while (currentDate.isBefore(lastDayOfYear, 'day')) {
          const newStartDate = currentDate.clone().add(14, 'days');
          const newEndDate = newStartDate.clone().add(13, 'days');
          if (newEndDate.isSameOrBefore(lastDayOfYear, 'day')) {
            const newPeriod = {
              uuid: null,
              year,
              number: payPeriodNumber,
              name: `PP${payPeriodNumber}`,
              start_date: newStartDate.format('YYYY-MM-DD'),
              end_date: newEndDate.format('YYYY-MM-DD'),
            };
            payPeriodsToUpdate.push(newPeriod);
            this.allPeriods.push(newPeriod);
            payPeriodNumber++;
            currentDate.add(14, 'days');
          } else {
            lastPeriod.end_date = lastDayOfYear.format('YYYY-MM-DD');
            this.allPeriods.push(lastPeriod);
            break;
          }
        }
      }
    }
  
    this.setDataSource();
  }
  
  
  
  
  
  
  dataSourceIndex: number;

  // Calculate the index based on the current page index and page size
  calculateDataSourceIndex(index: number): number {
    return index + (this.paginator.pageIndex * this.paginator.pageSize);
  }
  
  
  
  updatePayPeriodsMore(){
    this.payPeriodService.updatePayperiodUpdateMore(this.allPeriods).subscribe(res =>{
    })
  }
  
}
