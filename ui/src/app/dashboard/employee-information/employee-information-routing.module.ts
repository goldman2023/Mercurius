import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduledEmployeeWorksheetComponent } from './components/scheduled-employee-worksheet/scheduled-employee-worksheet.component';
import { EmployeeInformationComponent } from './employee-information.component';
import { LeaveComponent } from 'src/app/shared/component/leave/leave.component';
import { OvertimeComponent } from 'src/app/shared/component/overtime/overtime.component';
import { OtherDutiesComponent } from 'src/app/shared/component/other-duties/other-duties.component';

const routes: Routes = [
  {path:'schedule-worksheet', component: ScheduledEmployeeWorksheetComponent},
  {path:'', component: EmployeeInformationComponent, children: [
    {path: '', redirectTo: ':empid/:bischid/schedule', pathMatch: 'full'},
    {path:':empid/:bischid/schedule', component: ScheduleComponent},
    {path:':empid/:bischid/requests', component: LeaveComponent},
    {path:':empid/:bischid/overtime', component: OvertimeComponent},
    {path:':empid/:bischid/other-duties', component: OtherDutiesComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeInformationRoutingModule { }
