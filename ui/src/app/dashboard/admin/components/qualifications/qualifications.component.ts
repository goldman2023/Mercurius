import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../store/app.reducers';
import * as QualificationAction from '../../store/admin.actions';
import { AddQualificationComponent } from './add-qualification/add-qualification.component';
import { UpdateQualificationsComponent } from './update-qualifications/update-qualifications.component';


@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.scss']
})
export class QualificationsComponent implements OnInit {
  displayedColumns: Array<string> = ['qual_name','qual_description', 'eff_start_date', 'eff_end_date','status', 'action'];
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  user_data: any | {}
  constructor(
    public dialog: MatDialog,
    private store: Store<appReducer.AppState>,
    ) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.Qualification = authdata;

      let sortedRoles = this.Qualification.Qualifications
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

    this.store.dispatch(new QualificationAction.GetAllQualification());
  }
  radioChange() {
    this.pageIndex = 0;
    this.store.dispatch(new QualificationAction.GetAllQualification());
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
