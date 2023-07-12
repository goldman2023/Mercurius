import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWorkLoadDataPage } from './edit-work-load-data.page';

const routes: Routes = [
  {
    path: '',
    component: EditWorkLoadDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWorkLoadDataPageRoutingModule {}
