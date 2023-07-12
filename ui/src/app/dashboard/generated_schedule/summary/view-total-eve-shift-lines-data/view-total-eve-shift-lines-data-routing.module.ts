import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTotalEveShiftLinesDataPage } from './view-total-eve-shift-lines-data.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTotalEveShiftLinesDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTotalEveShiftLinesDataPageRoutingModule {}
