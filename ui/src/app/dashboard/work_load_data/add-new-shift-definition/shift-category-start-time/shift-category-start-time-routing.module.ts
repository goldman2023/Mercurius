import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftCategoryStartTimePage } from './shift-category-start-time.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftCategoryStartTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftCategoryStartTimePageRoutingModule {}
