
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



import * as appReducer from '../../../../store/app.reducers';
import * as QualificationAction from '../../store/admin.actions';
import { Store } from '@ngrx/store';
import { AddShiftCategoryComponent } from './add-shift-category/add-shift-category.component';
import { UpdateShiftCategoryComponent } from './update-shift-category/update-shift-category.component';

@Component({
  selector: 'app-shift-category',
  templateUrl: './shift-category.component.html',
  styleUrls: ['./shift-category.component.scss']
})
export class ShiftCategoryComponent implements OnInit {

  displayedColumns: Array<string> = ['shcategory_name', 'start_date', 'end_date','status', 'action'];
  dataSource
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  shiftCategory
  checkActive= 'Active'
  user_data: any | {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,
    private store: Store<appReducer.AppState>) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.select('adminStore').subscribe((authdata) => {
      this.shiftCategory = authdata;

      let sortedRoles = this.shiftCategory.ShiftCategory
      this.dataSource = new MatTableDataSource(sortedRoles);
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
    this.store.dispatch(new QualificationAction.GetAllShiftCategory());
  }


  radioChange() {
    this.pageIndex = 0;
    this.store.dispatch(new QualificationAction.GetAllShiftCategory());
  }

  addNewRole() {
    const dialogRef = this.dialog.open(AddShiftCategoryComponent,{
      width: '822px',
      height: '709px',
      data: {
        addName: 'Shift Category'
      }
  });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateShiftCategoryComponent,{
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Shift Category'
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
