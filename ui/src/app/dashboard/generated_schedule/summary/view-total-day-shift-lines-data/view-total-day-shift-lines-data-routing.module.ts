import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTotalDayShiftLinesDataPage } from './view-total-day-shift-lines-data.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTotalDayShiftLinesDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTotalDayShiftLinesDataPageRoutingModule {}
