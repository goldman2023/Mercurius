import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSummaryDayCategoryWisePageRoutingModule } from './view-summary-day-category-wise-routing.module';

import { ViewSummaryDayCategoryWisePage } from './view-summary-day-category-wise.page';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { ChartsModule } from 'ng2-charts';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDividerModule,
    IonicModule,
    ChartsModule,
    PinchZoomModule,
    NavBarPageModule,
    ViewSummaryDayCategoryWisePageRoutingModule
  ],
  declarations: [ViewSummaryDayCategoryWisePage]
})
export class ViewSummaryDayCategoryWisePageModule {}
