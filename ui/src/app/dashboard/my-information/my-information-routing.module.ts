import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInformationComponent } from './my-information.component';
import { EmpScheduleComponent } from './components/schedule/schedule.component';
import { LeaveComponent } from 'src/app/shared/component/leave/leave.component';
import { OvertimeComponent } from 'src/app/shared/component/overtime/overtime.component';
import { OtherDutiesComponent } from 'src/app/shared/component/other-duties/other-duties.component';

const routes: Routes = [
  {path:'', component: MyInformationComponent, children: [
    {path: '', redirectTo: 'schedule', pathMatch: 'full'},
    {path:'schedule', component: EmpScheduleComponent},
    {path:'requests', component: LeaveComponent},
    {path:'overtime', component: OvertimeComponent},
    {path:'other-duties', component: OtherDutiesComponent},
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyInformationRoutingModule { }
