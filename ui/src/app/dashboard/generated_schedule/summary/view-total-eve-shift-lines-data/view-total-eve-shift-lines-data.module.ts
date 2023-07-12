import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTotalEveShiftLinesDataPageRoutingModule } from './view-total-eve-shift-lines-data-routing.module';

import { ViewTotalEveShiftLinesDataPage } from './view-total-eve-shift-lines-data.page';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { BrowserModule } from '@angular/platform-browser';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserModule,
    NavBarPageModule,
    MatDividerModule,
    ViewTotalEveShiftLinesDataPageRoutingModule
  ],
  declarations: [ViewTotalEveShiftLinesDataPage]
})
export class ViewTotalEveShiftLinesDataPageModule {}
