import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import * as appReducer from '../../../../store/app.reducers';
import { Store } from '@ngrx/store';
import * as AdminActions from '../../store/admin.actions';
import { AddFacilityTypeComponent } from './add-facility-type/add-facility-type.component';
import { UpdateFacilityTypeComponent } from './update-facility-type/update-facility-type.component';


@Component({
  selector: 'app-facility-type',
  templateUrl: './facility-type.component.html',
  styleUrls: ['./facility-type.component.scss']
})
export class FacilityTypeComponent implements OnInit {

  displayedColumns: Array<string> = ['facilitytype_name','facilitytype_desc', 'start_date', 'end_date','status', 'action'];
  dataSource
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  checkActive = 'Active'
  allData
  user_data: any | {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,
    private store: Store<appReducer.AppState>,) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.allData = authdata
      let sortedRoles = this.allData.FacilityType
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
  })
    this.store.dispatch(new AdminActions.GetAllFacilityType());
  }


  radioChange() {
    this.pageIndex = 0;
    this.store.dispatch(new AdminActions.GetAllFacilityType());
  }
  addNewRole() {
    const dialogRef = this.dialog.open(AddFacilityTypeComponent,{
      width: '822px',
      height: '709px',
      data: {
        addName: 'Facility Type'
      }
  });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateFacilityTypeComponent,{
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Facility Type'
      }
  } );

    dialogRef.afterClosed().subscribe(result => {
    });
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
 
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
