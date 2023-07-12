import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewShiftLinePage } from './add-new-shift-line.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewShiftLinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewShiftLinePageRoutingModule {}
