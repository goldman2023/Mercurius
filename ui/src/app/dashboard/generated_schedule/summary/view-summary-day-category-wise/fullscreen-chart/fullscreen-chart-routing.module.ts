import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullscreenChartPage } from './fullscreen-chart.page';

const routes: Routes = [
  {
    path: '',
    component: FullscreenChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullscreenChartPageRoutingModule {}
