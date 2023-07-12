import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditScheduleDataPage } from './edit-schedule-data.page';

const routes: Routes = [
  {
    path: '',
    component: EditScheduleDataPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditScheduleDataPageRoutingModule {}
