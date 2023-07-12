import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ManageAreaComponent } from '../manage-area/manage-area.component';
import * as appReducer from '../../../../store/app.reducers';
import { Store } from '@ngrx/store';
import * as AdminActions from '../../store/admin.actions';
import { AddFacilityComponent } from './add-facility/add-facility.component';
import { UpdateFacilityComponent } from './update-facility/update-facility.component';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss'],
})
export class FacilityComponent implements OnInit {
  displayedColumns: Array<string> = [
    'facilityname',
    'facilitytypenameref',
    'facilityabbr',
    'facilitycity',
    'facilitystate',
    'start_date',
    'end_date',
    'status',
    'action',
  ];
  checkActive = 'Active'
  dataSource;
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  facilityTypesName;
  filter = [{ type: 'TRACON' }, { type: 'TOWER' }];
  allData
  facilityNameDropdown
  user_data
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public dialog: MatDialog,
    private store: Store<appReducer.AppState>
  ) {}

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.allData = authdata
      this.facilityTypesName = this.allData.Facility.reduce((acc, current) => {
        const facilitytypenameref = current.facilitytypenameref;
        if (!acc.set.has(facilitytypenameref)) {
          acc.set.add(facilitytypenameref);
          acc.array.push(current);
        }
        return acc;
      }, { set: new Set(), array: [] }).array.sort((a, b) => {
        if (a.facilitytypenameref < b.facilitytypenameref) {
          return -1;
        }
        if (a.facilitytypenameref > b.facilitytypenameref) {
          return 1;
        }
        return 0;
      });
      this.facilityNameDropdown = this.allData.Facility.sort((a, b) => {
        if (a.facilityname < b.facilityname) {
          return -1;
        }
        if (a.facilityname > b.facilityname) {
          return 1;
        }
        return 0;
      })
      let sortedRoles = this.allData.Facility
      if(this.checkActive == "Active"){
        let activeData = sortedRoles.filter( res => res.status == "Active")
        this.dataSource = new MatTableDataSource(activeData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }else{
        let inactiveData = sortedRoles.filter( res => res.status == "Inactive")
        this.dataSource = new MatTableDataSource(inactiveData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
    this.dataSource.filter = 'Active';
    this.store.dispatch(new AdminActions.GetAllFacility());
    this.store.dispatch(new AdminActions.GetFacilityTypes());
  }
  radioChange() {
    this.pageIndex = 0;
    this.store.dispatch(new AdminActions.GetAllFacility());
  }
  addNewRole() {
    const dialogRef = this.dialog.open(AddFacilityComponent, {
      width: '822px',
      height: '709px',
      data: {
        addName: 'Facility',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateFacilityComponent, {
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Facility',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }



  filterChange(e) {
    this.dataSource.filter = e.value;
  }
  filterChangeByName(e) {
    this.dataSource.filter = e.value;
  }

  manageArea(element) {
    const dialogRef = this.dialog.open(ManageAreaComponent, {
      width: '822px',
      height: '709px',
      data: {
        addName: 'New Role',
        facilityId: element.facilityid,
      },
    });
    this.store.dispatch(new AdminActions.GetFacilityArea(element.facilityid));
    dialogRef.afterClosed().subscribe((result) => {});
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
