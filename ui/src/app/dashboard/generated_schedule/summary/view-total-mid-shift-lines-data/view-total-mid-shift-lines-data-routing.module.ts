import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTotalMidShiftLinesDataPage } from './view-total-mid-shift-lines-data.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTotalMidShiftLinesDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTotalMidShiftLinesDataPageRoutingModule {}
