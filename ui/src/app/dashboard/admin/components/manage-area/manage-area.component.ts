import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { EditAreaComponent } from './edit-area/edit-area.component';

import * as appReducer from '../../../../store/app.reducers';
import { Store } from '@ngrx/store';
import * as AdminActions from '../../store/admin.actions';
import { MatPaginator } from '@angular/material/paginator';
import { AddAreaComponent } from './add-area/add-area.component';

export interface PeriodicElement {
  area_name: string;
  area_description: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { area_name: 'Area 1', area_description: 'Area 1' },
];

@Component({
  selector: 'app-manage-area',
  templateUrl: './manage-area.component.html',
  styleUrls: ['./manage-area.component.scss'],
})
export class ManageAreaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: Array<string> = ['areaname', 'areadescription', 'action'];
  dataSource;
  facilityId;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.facilityId = data.facilityId;
  }

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      this.dataSource = new MatTableDataSource(authdata.FacilityArea);
      this.dataSource.paginator = this.paginator;
    });
  }


  addArea() {
    const dialogRef = this.dialog.open(AddAreaComponent, {
      width: '722px',
      height: '534px',

      data: {
        addName: 'New Role',
        facilityId: this.facilityId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  close() {}


  updateArea(element) {
    const dialogRef = this.dialog.open(EditAreaComponent, {
      width: '722px',
      height: '534px',
      data: {
        addName: 'New Role',
        dataKey: element,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
