import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyInformationRoutingModule } from './my-information-routing.module';
import { MyInformationComponent } from './my-information.component';
import { MyWorksheetComponent } from './my-worksheet/my-worksheet.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavBarPageModule } from '../nav-bar-footer/nav-bar/nav-bar.module';
import { EmpScheduleComponent } from './components/schedule/schedule.component';
@NgModule({
  declarations: [
    MyWorksheetComponent,
    MyInformationComponent,
    NavigationComponent,
    EmpScheduleComponent,
    
  ],
  imports: [
    CommonModule,
    MyInformationRoutingModule,

    SharedModule,
    NavBarPageModule
  ],
  exports: [SharedModule,MyWorksheetComponent],
})
export class MyInformationModule { }
