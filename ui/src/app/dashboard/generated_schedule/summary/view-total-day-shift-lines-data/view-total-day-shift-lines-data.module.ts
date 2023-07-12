import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTotalDayShiftLinesDataPageRoutingModule } from './view-total-day-shift-lines-data-routing.module';

import { ViewTotalDayShiftLinesDataPage } from './view-total-day-shift-lines-data.page';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    NavBarPageModule,
    ViewTotalDayShiftLinesDataPageRoutingModule
  ],
  declarations: [ViewTotalDayShiftLinesDataPage]
})
export class ViewTotalDayShiftLinesDataPageModule {}
