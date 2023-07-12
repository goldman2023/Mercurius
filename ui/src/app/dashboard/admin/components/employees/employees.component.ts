import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';

import * as appReducer from '../../../../store/app.reducers';

import * as AdminActions from '../../store/admin.actions';
import { Store } from '@ngrx/store';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Employee } from '../../store/adminModel';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  allData;
  activeEmloyees;
  user_data: any | {}
  checkActive = 'Active';

  displayedColumns: Array<string> = [
    'lname',
    'initials',
    'email',
    'phone',
    'areaName',
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
  facilityAbbrList

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private store: Store<appReducer.AppState>,
    private empService: EmployeeService,
    private addEmpService: AddNewEmployeeService,
    public alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new AdminActions.GetAllFacility());
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.getAllEmployees();
    this.store.select('adminStore').subscribe(async (authdata) => {
      this.allData = authdata;
    });
    this.empService.getFacilityAreaDropdown().subscribe(res => {
      this.facilityAbbrList = res.sort((a, b) => {
        const aParts = a.split("- ");
        const bParts = b.split("- ");
        if (aParts[0] < bParts[0]) {
          return -1;
        } else if (aParts[0] > bParts[0]) {
          return 1;
        } else {
          if (aParts[1] < bParts[1]) {
            return -1;
          } else if (aParts[1] > bParts[1]) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    });
  }
  allEmp: Array<Employee> = [];
  async setData(employees: Array<Employee>) {
    this.allEmp = [];
    this.allEmp = employees.map((employee) => ({
      ...employee,
      areaName: employee.facilityName  + ' - ' +employee.areaName,
      phone: this.phoneFormat(employee.phone),
    }));
    this.filterEmployees(1);
  }
  async getAllEmployees() {
    try{
      const employees = await this.empService.getAllEmployeeBasedOnUserId(this.user_data.id).toPromise();
      this.setData(employees);
    }catch(err){
      console.error(err)
    }
  }
  pagination(allEmp: Array<Employee>) {
    this.dataSource = new MatTableDataSource(allEmp);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  filterEmployees(status: number){
    let employees = this.allEmp.filter((employee: any) => employee.status == status);
    this.pagination(employees);
  }
  radioChange() {
    this.pageIndex = 0;
    if (this.checkActive == 'Active') {
      this.filterEmployees(1);
    } else {
      this.filterEmployees(0);
    }
  }
  getAreaName(id) {
    let areaName;
    this.empService.getAreaName(id).subscribe((res) => {
      areaName = res;
    });
    return areaName;
  }

  filterChange(e) {
    this.dataSource.filter = e.value;
  }

  addNewEmployee() {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '822px',
      height: '709px',
      data: {
        addName: 'Employee',
      },
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (this.checkActive == 'Active') {
        this.empService.getAreaName(result.areaid).subscribe((res) => {
          let updatedData = result;
          updatedData.areaName = res;
          updatedData.phone = this.phoneFormat(result.phone);
          this.allEmp.push(updatedData);
          this.pagination(this.allEmp);
        });
      }
    });
  }

  phoneFormat(phone) {
    if (phone != 0) {
      let phoneNumber = phone;
      const countryCodeStr = phoneNumber.toString().slice(0, 3);
      const areaCodeStr = phoneNumber.toString().slice(3, 6);
      const midSectionStr = phoneNumber.toString().slice(6, 10);
      return `(${countryCodeStr}) ${areaCodeStr}-${midSectionStr}`;
    } else return 'N/A';
  }

  updateEmployee(element) {
    const dialogRef = this.dialog.open(UpdateEmployeeComponent, {
      width: '822px',
      height: '709px',
      data: {
        dataKey: element,
        editName: 'Employee',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.areaid > 0) {
        let phoneNumber = this.phoneFormat(result.phone);
        this.empService.getAreaName(result.areaid).subscribe((res) => {
          this.allEmp.find((x, index) => {
            if (x.empid === result.empid) {
              let updatedData = result;
              updatedData.phone = phoneNumber;
              updatedData.areaName = res;
              this.allEmp[index] = updatedData;
              this.pagination(result);
            }
          });
        });
      }
    });
  }

  employeeStatus(employee) {
    if (employee.status != 0) {
      return 'Deactivate';
    } else return 'Activate';
  }
  async updateEmployeeStatus(data) {
    const employeeStatusMessage = this.employeeStatus(data);
    const confirm = await this.alertController.create({
      header: 'Are you sure?',
      message: `Are you sure you want to ${employeeStatusMessage} the Employee?`,
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: `${employeeStatusMessage}`,
          role: 'update',
          handler: () => {
            const updateEmployeeStatusData =
              employeeStatusMessage == 'Deactivate' ? 0 : 1;
            this.addEmpService
              .updateEmpStatusBasedOnId(data.empid, updateEmployeeStatusData)
              .subscribe(
                async (res) => {
                  let allEmp = this.allEmp.filter((emp) => {
                    return emp.empid != data.empid;
                  });
                  this.pagination(allEmp);
                  const alertC = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Success',
                    message: `Employee ${employeeStatusMessage}d Successfully!`,
                    buttons: [
                      {
                        text: 'Ok',
                        role: 'cancel',
                        handler: () => {},
                      },
                    ],
                  });
                  await alertC.present();
                },
                async (err) => {
                  const alertC = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Error',
                    message: 'Failed to Update Data',
                    buttons: [
                      {
                        text: 'Ok',
                        role: 'cancel',
                        handler: () => {},
                      },
                    ],
                  });
                  await alertC.present();
                  console.log(err);
                },
                () => {}
              );
          },
        },
      ],
    });
    await confirm.present();
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
  ngAfterViewInit() {
    if(this.dataSource){
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
