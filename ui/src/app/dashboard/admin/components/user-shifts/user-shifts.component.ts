import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserShiftComponent } from './add-user-shift/add-user-shift.component';

// import { UserShftServicesService } from 'src/app/services/;

import { SystemShiftsViewComponent } from '../system-shifts/system-shifts-view/system-shifts-view.component';
import { UpdateUserShiftComponent } from './update-user-shift/update-user-shift.component';
import { ViewShiftCategoryComponent } from './view-shift-category/view-shift-category.component';
import { UserShftServicesService } from 'src/app/services/user-shift-service/user-shft-services.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UpdateEmployeeComponent } from '../employees/update-employee/update-employee.component';

@Component({
  selector: 'app-user-shifts',
  templateUrl: './user-shifts.component.html',
  styleUrls: ['./user-shifts.component.scss'],
})
export class UserShiftsComponent implements OnInit {
  displayedColumns: Array<string> = [
    'area_name_ref',
    'sh_name',
    'sh_category_name_ref',
    'sh_duration',
    'sh_starttime',
    'sh_endtime',
    'sh_activation_date',
    'sh_expiration_date',
    'status',
    'action',
  ];
  dataSource;
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  checkActive = 'I';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  user_data: any | {}
  filter: any = [];
  allData: any = [];

  constructor(
    public dialog: MatDialog,
    private userShiftService: UserShftServicesService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.getUserShift('I');
  }
  getUserShift(activation) {
    this.allData = [];
    this.userShiftService
      .GetShiftDefinitionByUserID(this.user_data.id)
      .subscribe((res) => {
        this.filter = res
          .reduce(
            (acc, current) => {
              const area_name_ref = current.area_name_ref;
              if (area_name_ref != null && !acc.set.has(area_name_ref)) {
                acc.set.add(area_name_ref);
                acc.array.push(current);
              }
              return acc;
            },
            { set: new Set(), array: [] }
          )
          .array.sort((a, b) => {
            if (a.area_name_ref < b.area_name_ref) {
              return -1;
            }
            if (a.area_name_ref > b.area_name_ref) {
              return 1;
            }
            return 0;
          });
        this.allData = res;
        this.filterEmployees(activation);
      });
  }
  radioChange() {
    this.pageIndex = 0;
    if (this.checkActive == 'I') {
      this.getUserShift('I');
      this.filterEmployees('I');
    } else {
      this.getUserShift('E');
      this.filterEmployees('E');
    }
  }
  filterEmployees(status) {
    let userShifts = this.allData.filter(
      (employee: any) => employee.sh_include_exclude == status
    );
    this.pagination(userShifts);
  }
  pagination(userShifts) {
    this.dataSource = new MatTableDataSource(userShifts);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  addNewRole() {
    const dialogRef = this.dialog.open(AddUserShiftComponent, {
      width: '822px',
      height: '709px',
      data: {

        userShiftList: this.allData,
        addName: 'User Shift',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.allData.push(result);

      if (this.checkActive == 'I') {
        this.filterEmployees('I');
      } else {
        this.filterEmployees('E');
      }
    });
  }

  updateRole(element) {
    const dialogRef = this.dialog.open(UpdateUserShiftComponent, {
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        userShiftList: this.allData,
        editName: 'User Shift',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.allData.find((x, index) => {
        if (x.sh_id === result.sh_id) {
          this.allData[index] = result;
          this.pagination(result);
        }
      });

      if (this.checkActive == 'I') {
        this.filterEmployees('I');
      } else {
        this.filterEmployees('E');
      }
    });
  }

  view(element) {
    const dialogRef = this.dialog.open(ViewShiftCategoryComponent, {
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        viewName: 'user Shift',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
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

  filterChange(e) {
    this.dataSource.filter = e.value;
  }

  getStartHour(timeString) {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return formattedHours + formattedMinutes;
  }
  getEndTime(s, d) {
    let data = +s.split(':')[0] * 100 + +d * 100;
    if (data > 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }

 
  exclude(data) {
    let userShiftData = {
      sh_id: data.sh_id,
      sh_name: data.sh_name,
      sh_category_id: data.sh_category_id,
      sh_category_name_ref: data.sh_category_name_ref,
      sh_starttime: data.sh_starttime,
      sh_endtime: data.sh_endtime,
      sh_priority: data.sh_priority,
      sh_activation_date: data.sh_activation_date,
      sh_expiration_date: data.sh_expiration_date,
      sh_include_exclude: 'E',
      sh_area_id: data.sh_area_id,
      area_name_ref: data.area_name_ref,
      sh_duration: data.sh_duration,
      created_by: data.created_by,
      created_date: data.created_date,
      updated_by: this.user_data.id,
      sh_created_by:this.user_data.id, 
      updated_date: data.updated_date,
    };
    this.userShiftService
      .updateShiftDefinitionByUserID(userShiftData)
      .subscribe(
        (res) => {
          this.massageModal(res);
        },
        () => {},
        () => {}
      );
  }
  async massageModal(res) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'User Shift Excluded Successfully!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.modalCtrl.dismiss();
          },
        },
      ],
    });
    if (this.checkActive == 'I') {
      this.getUserShift('I');
      this.filterEmployees('I');
    } else {
      this.getUserShift('E');
      this.filterEmployees('E');
    }
    await alert.present();
  }
  Include(data) {
    let userShiftData = {
      sh_id: data.sh_id,
      sh_name: data.sh_name,
      sh_category_id: data.sh_category_id,
      sh_category_name_ref: data.sh_category_name_ref,
      sh_starttime: data.sh_starttime,
      sh_endtime: data.sh_endtime,
      sh_priority: data.sh_priority,
      sh_activation_date: data.sh_activation_date,
      sh_expiration_date: data.sh_expiration_date,
      sh_include_exclude: 'I',
      sh_area_id: data.sh_area_id,
      area_name_ref: data.area_name_ref,
      sh_duration: data.sh_duration,
      created_by: data.created_by,
      created_date: data.created_date,
      updated_by: this.user_data.id,
      sh_created_by:this.user_data.id, 
      updated_date: data.updated_date,
    };
    this.userShiftService
      .updateShiftDefinitionByUserID(userShiftData)
      .subscribe(
        (res) => {
          this.massageModalIncluded(res);
        },
        () => {},
        () => {}
      );
  }
  async massageModalIncluded(res) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'User Shift Excluded Successfully!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.modalCtrl.dismiss();
          },
        },
      ],
    });
    if (this.checkActive == 'I') {
      this.getUserShift('I');
      this.filterEmployees('I');
    } else {
      this.getUserShift('E');
      this.filterEmployees('E');
    }
    await alert.present();
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
