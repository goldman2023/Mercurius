import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTotalMidShiftLinesDataPageRoutingModule } from './view-total-mid-shift-lines-data-routing.module';

import { ViewTotalMidShiftLinesDataPage } from './view-total-mid-shift-lines-data.page';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    NavBarPageModule,
    ViewTotalMidShiftLinesDataPageRoutingModule
  ],
  declarations: [ViewTotalMidShiftLinesDataPage]
})
export class ViewTotalMidShiftLinesDataPageModule {}
