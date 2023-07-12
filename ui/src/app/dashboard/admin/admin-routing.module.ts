import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FacilityTypeComponent } from './components/facility-type/facility-type.component';
import { FacilityComponent } from './components/facility/facility.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { QualificationsComponent } from './components/qualifications/qualifications.component';
import { ShiftCategoryComponent } from './components/shift-category/shift-category.component';
import { SystemShiftsComponent } from './components/system-shifts/system-shifts.component';
import { UserShiftsComponent } from './components/user-shifts/user-shifts.component';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { UserRoleListComponent } from './components/role-user-list/role-user-list.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PayPeriodComponent } from './components/pay-period/pay-period.component';

const routes: Routes = [
  {path: '', component: AdminComponent, children:[
    {path:'', redirectTo:'roles' , pathMatch:'full'},
    {path: 'roles', component:UserRoleListComponent,canActivate:[AuthGuard]},
    {path: 'permissions', component:PermissionsComponent,canActivate:[AuthGuard]},
    {path: 'qualifications', component:QualificationsComponent,canActivate:[AuthGuard]},
    {path: 'facility-type', component:FacilityTypeComponent,canActivate:[AuthGuard]},
    {path: 'facility', component:FacilityComponent,canActivate:[AuthGuard]},
    {path: 'shift-category', component:ShiftCategoryComponent,canActivate:[AuthGuard]},
    {path: 'system-shifts', component:SystemShiftsComponent,canActivate:[AuthGuard]},
    {path: 'user-shifts', component:UserShiftsComponent,canActivate:[AuthGuard]},
    {path: 'employees', component:EmployeesComponent,canActivate:[AuthGuard]},
    {path: 'pay-periods', component:PayPeriodComponent,canActivate:[AuthGuard]},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
