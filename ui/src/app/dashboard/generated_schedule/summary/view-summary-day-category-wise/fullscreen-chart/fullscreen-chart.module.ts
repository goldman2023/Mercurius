import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullscreenChartPageRoutingModule } from './fullscreen-chart-routing.module';
import {MatIconModule} from '@angular/material/icon'
import { FullscreenChartPage } from './fullscreen-chart.page';
import { ChartsModule } from 'ng2-charts';
import {PinchZoomModule} from 'ngx-pinch-zoom';
// import 'chartjs-plugin-zoom';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    PinchZoomModule,
    MatIconModule,
    FullscreenChartPageRoutingModule
  ],
  declarations: [FullscreenChartPage]
})
export class FullscreenChartPageModule {}
