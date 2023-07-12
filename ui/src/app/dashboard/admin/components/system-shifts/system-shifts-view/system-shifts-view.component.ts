import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';

import * as appReducer from '../../../../../store/app.reducers';

@Component({
  selector: 'app-system-shifts-view',
  templateUrl: './system-shifts-view.component.html',
  styleUrls: ['./system-shifts-view.component.scss'],
})
export class SystemShiftsViewComponent implements OnInit {
  viewName;
  viewElement;
  displayedColumns: Array<string> = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
  ];

  endTime;
  dataSource;
  viewSystemShift;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.viewName = data.viewName;
    this.viewElement = data.dataKey;
  }

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      this.viewSystemShift = authdata.viewSystemShift;
      if (this.viewSystemShift.week) {
        this.dataSource = new MatTableDataSource([
          this.convertArrayToObject(this.viewSystemShift.week),
        ]);
      }
    });
  }

  getEndTime(s, d) {
    let data = +s.split(':')[0] * 100 + +d * 100;
    if (data > 2400) {
      return data - 2400;
    } else {
      return data;
    }
  }
  convertArrayToObject = (array) =>
    array.reduce(
      (obj, item) => ({
        ...obj,
        [item.day]: item.value,
      }),
      {}
    );
}
