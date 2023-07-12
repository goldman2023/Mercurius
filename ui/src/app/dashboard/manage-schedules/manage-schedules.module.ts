import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSchedulesRoutingModule } from './manage-schedules-routing.module';
import { ManageSchedulesComponent } from './manage-schedules.component';
import { BasicWatchScheduleComponent } from './basic-watch-schedule/basic-watch-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeeklyScheduleComponent } from './basic-watch-schedule/weekly-schedule/weekly-schedule.component';
import { DailyScheduleComponent } from './basic-watch-schedule/daily-schedule/daily-schedule.component';
import { EmployeeInfoComponent } from './basic-watch-schedule/employee-info/employee-info.component';
import { SubmitRequestModalComponent } from './component/submit-request-modal/submit-request-modal.component';
import { MyInformationModule } from '../my-information/my-information.module';
import { MonthlyScheduleComponent } from './basic-watch-schedule/monthly-schedule/monthly-schedule.component';


@NgModule({
  declarations: [
    ManageSchedulesComponent,
     BasicWatchScheduleComponent,
     WeeklyScheduleComponent,
     MonthlyScheduleComponent,
     DailyScheduleComponent,
     EmployeeInfoComponent,
     SubmitRequestModalComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    ManageSchedulesRoutingModule,
    MyInformationModule
  ],
  exports: [
    MyInformationModule
  ]
})
export class ManageSchedulesModule { }
