
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';


import { SystemShiftsViewComponent } from './system-shifts-view/system-shifts-view.component';
import * as appReducer from '../../../../store/app.reducers';
import * as QualificationAction from '../../store/admin.actions';

@Component({
  selector: 'app-system-shifts',
  templateUrl: './system-shifts.component.html',
  styleUrls: ['./system-shifts.component.scss']
})
export class SystemShiftsComponent implements OnInit {

  displayedColumns: Array<string> = ['shiftName', 'shiftCategoryName','shiftDuration','startTime','s_e_time',  'action'];
  dataSource
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  systemShift
  shiftCategoryNameDropDown
  durationDropDown
  user_data
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,  private store: Store<appReducer.AppState>) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.systemShift = authdata.systemShift;
      this.dataSource = new MatTableDataSource(this.systemShift);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.shiftCategoryNameDropDown = authdata.systemShift.reduce((acc, current) => {
        const shiftCategoryName = current.shiftCategoryName;
        if (!acc.set.has(shiftCategoryName)) {
          acc.set.add(shiftCategoryName);
          acc.array.push(current);
        }
        return acc;
      }, { set: new Set(), array: [] }).array.sort((a, b) => {
        if (a.shiftCategoryName < b.shiftCategoryName) {
          return -1;
        }
        if (a.shiftCategoryName > b.shiftCategoryName) {
          return 1;
        }
        return 0;
      });

      this.durationDropDown = authdata.systemShift.reduce((acc, current) => {
        const shiftDuration = current.shiftDuration;
        if (!acc.set.has(shiftDuration)) {
          acc.set.add(shiftDuration);
          acc.array.push(current);
        }
        return acc;
      }, { set: new Set(), array: [] }).array.sort((a, b) => {
        if (a.shiftDuration < b.shiftDuration) {
          return -1;
        }
        if (a.shiftDuration > b.shiftDuration) {
          return 1;
        }
        return 0;
      });;

  })
    this.store.dispatch(new QualificationAction.GetSystemShift());
  }





  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  view(element) {
    const dialogRef = this.dialog.open(SystemShiftsViewComponent,{
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        viewName: 'System Shift'
      }

  } );

    dialogRef.afterClosed().subscribe(result => {
    });
    this.store.dispatch(new QualificationAction.GetViewSystemShift(element.id));
  }
  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  testSortChange() {
    alert('changed');
  }
   getStartHour(startTime) {
    return startTime.split(':')[0].padStart(2, '0') + '00';
  }
   getEndTime(s, d) {
    let data = (+s.split(':')[0] * 100) + +d * 100;
    if (data > 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }

  filterChange(e) {
    this.dataSource.filter = e.value;
  }
  durationFilterChange(e) {
    if(e.value){
      this.dataSource.filter = e.value.toString();
    }else{
      this.dataSource.filter = e.value
    }
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
