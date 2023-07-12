import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  ScheduleModule,
  AgendaService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  MonthAgendaService
} from '@syncfusion/ej2-angular-schedule';

import { defaultsFactory, FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { ScheduleComponent } from './component/schedule/schedule.component';
import { ShiftComponent } from './component/shift/shift.component';
import { LayoutModule } from '@angular/cdk/layout';
import { OvertimeComponent } from './component/overtime/overtime.component';
import { LeaveComponent } from './component/leave/leave.component';
import { OtherDutiesComponent } from './component/other-duties/other-duties.component';
import { ViewSubmitRequestComponent } from './component/view-submit-request/view-submit-request.component';
import { StickyNoteComponent } from './component/sticky-note/sticky-note.component';
@NgModule({
  declarations: [
    ScheduleComponent,
    ShiftComponent,
    OvertimeComponent,
    LeaveComponent,
    OtherDutiesComponent,
    ViewSubmitRequestComponent,
    StickyNoteComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    ScheduleModule,
    LayoutModule,
    IonicModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatTooltipModule,
  ],
  exports: [
    ScheduleComponent,
    MaterialModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleModule,
    NgbModalModule,
    FlatpickrModule,
    CalendarModule,
    IonicModule,
    MatTooltipModule,
    ShiftComponent,
    OvertimeComponent,
    LeaveComponent,
    OtherDutiesComponent,
    ViewSubmitRequestComponent,
    StickyNoteComponent,
  ],
  providers: [
    AgendaService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    MonthAgendaService,
  ],
})
export class SharedModule {}
