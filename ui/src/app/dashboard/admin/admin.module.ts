import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComponent } from './admin.component';
import { AdminNavsComponent } from './components/admin-navs/admin-navs.component';
import { FacilityTypeComponent } from './components/facility-type/facility-type.component';
import { FacilityComponent } from './components/facility/facility.component';
import { ManageAreaComponent } from './components/manage-area/manage-area.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { QualificationsComponent } from './components/qualifications/qualifications.component';
import { ShiftCategoryComponent } from './components/shift-category/shift-category.component';
import { SystemShiftsViewComponent } from './components/system-shifts/system-shifts-view/system-shifts-view.component';
import { SystemShiftsComponent } from './components/system-shifts/system-shifts.component';
import {  UpdateUserShiftComponent } from './components/user-shifts/update-user-shift/update-user-shift.component';
import { UserShiftsComponent } from './components/user-shifts/user-shifts.component';
import { AddFacilityTypeComponent } from './components/facility-type/add-facility-type/add-facility-type.component';
import { AddFacilityComponent } from './components/facility/add-facility/add-facility.component';
import { AddQualificationComponent } from './components/qualifications/add-qualification/add-qualification.component';
import { AddShiftCategoryComponent } from './components/shift-category/add-shift-category/add-shift-category.component';
import { AddUserShiftComponent } from './components/user-shifts/add-user-shift/add-user-shift.component';
import { AddRoleComponent } from './components/role-user-list/add-role/add-role.component';
import { AddAreaComponent } from './components/manage-area/add-area/add-area.component';
import { UserRoleListComponent } from './components/role-user-list/role-user-list.component';
import { EditAreaComponent } from './components/manage-area/edit-area/edit-area.component';
import { UpdateRoleComponent } from './components/role-user-list/update-role/update-role.component';
import { UpdateQualificationsComponent } from './components/qualifications/update-qualifications/update-qualifications.component';
import { UpdateFacilityTypeComponent } from './components/facility-type/update-facility-type/update-facility-type.component';
import { UpdateFacilityComponent } from './components/facility/update-facility/update-facility.component';
import { UpdateShiftCategoryComponent } from './components/shift-category/update-shift-category/update-shift-category.component';
import { ViewShiftCategoryComponent } from './components/user-shifts/view-shift-category/view-shift-category.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './components/employees/update-employee/update-employee.component';
import {  MyTelInput } from './components/employees/form-field-custom-control-example/form-field-custom-control-example.component';
import { PhoneFormatPipe } from 'src/app/shared/directives/phone-format-pipeipe';
import { PayPeriodComponent } from './components/pay-period/pay-period.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserRoleListComponent,
    AdminNavsComponent,
    PermissionsComponent,
    AddRoleComponent,
    QualificationsComponent,
    FacilityTypeComponent,
    FacilityComponent,
    ShiftCategoryComponent,
    SystemShiftsComponent,
    SystemShiftsViewComponent,
    ManageAreaComponent,
    AddAreaComponent,
    EditAreaComponent,
    UserShiftsComponent,
    AddQualificationComponent,
    AddFacilityTypeComponent,
    AddFacilityComponent,
    AddShiftCategoryComponent,
    AddUserShiftComponent,
    UpdateUserShiftComponent,
    UpdateRoleComponent,
    UpdateQualificationsComponent,
    UpdateFacilityTypeComponent,
    UpdateFacilityComponent,
    UpdateShiftCategoryComponent,
    UpdateUserShiftComponent,
    ViewShiftCategoryComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    UpdateEmployeeComponent,
    MyTelInput,
    PhoneFormatPipe,
    PayPeriodComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
  exports: [SharedModule],
})
export class AdminModule {}
