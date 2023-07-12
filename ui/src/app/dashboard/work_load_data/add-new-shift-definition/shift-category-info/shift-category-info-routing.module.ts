import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftCategoryInfoPage } from './shift-category-info.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftCategoryInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftCategoryInfoPageRoutingModule {}
