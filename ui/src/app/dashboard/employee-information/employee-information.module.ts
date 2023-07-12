import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeInformationRoutingModule } from './employee-information-routing.module';
import { EmployeeInformationComponent } from './employee-information.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { OvertimeComponent } from './components/overtime/overtime.component';
import { OtherDutiesComponent } from './components/other-duties/other-duties.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduledEmployeeWorksheetComponent } from './components/scheduled-employee-worksheet/scheduled-employee-worksheet.component';
import { NavBarPageModule } from '../nav-bar-footer/nav-bar/nav-bar.module';
import { ScheduleParentsComponent } from './components/schedule-parents/schedule-parents.component';

@NgModule({
  declarations: [
    EmployeeInformationComponent,
    NavigationComponent,
    ScheduleComponent,
    EmployeeListComponent,
    OvertimeComponent,
    OtherDutiesComponent,
    ScheduledEmployeeWorksheetComponent,
    ScheduleParentsComponent,
  ],
  imports: [
    CommonModule,
    EmployeeInformationRoutingModule,
    SharedModule,
    NavBarPageModule,
  ],
  exports: [SharedModule],
})
export class EmployeeInformationModule {}
