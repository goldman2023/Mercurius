import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AddRoleComponent } from './add-role/add-role.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';



import * as appReducer from '../../../../store/app.reducers'

import * as AdminActions from '../../store/admin.actions';
import { UpdateRoleComponent } from './update-role/update-role.component';



@Component({
  selector: 'app-user-list',
  templateUrl: './role-user-list.component.html',
  styleUrls: ['./role-user-list.component.scss']
})
export class UserRoleListComponent implements OnInit {

  displayedColumns: Array<string> = ['role_name', 'start_date', 'end_date','status', 'action'];
  dataSource
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  date = new Date().toJSON().slice(0, 10)

  roles
  user_data: any | {}
  checkActive = "Active"
  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store<appReducer.AppState>,
    ) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.roles = authdata;
      if(this.checkActive == "Active"){
        let sortedRoles = this.roles.role
        let activeData = sortedRoles.filter( res => res.status == "Active")
        this.dataSource = new MatTableDataSource(activeData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }else{
        let sortedRoles = this.roles.role
        let inactiveData = sortedRoles.filter( res => res.status == "Inactive")
        this.dataSource = new MatTableDataSource(inactiveData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
    this.store.dispatch(new AdminActions.GetAllRoles());
  }

  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
  radioChange() {
    this.pageIndex = 0;
      this.store.dispatch(new AdminActions.GetAllRoles());

  }


  addNewRole() {
    const dialogRef = this.dialog.open(AddRoleComponent,{
      width: '822px',
      height: '709px',
      data: {
        addName: 'Add Role'
      }
  });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateRoleComponent,{
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Role'
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


}
