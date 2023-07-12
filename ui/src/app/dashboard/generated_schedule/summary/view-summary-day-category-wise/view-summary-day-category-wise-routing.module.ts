import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSummaryDayCategoryWisePage } from './view-summary-day-category-wise.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSummaryDayCategoryWisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSummaryDayCategoryWisePageRoutingModule {}
