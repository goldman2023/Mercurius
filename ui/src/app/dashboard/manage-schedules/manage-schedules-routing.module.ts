import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSchedulesComponent } from './manage-schedules.component';

const routes: Routes = [
  {
    path: '',
    component: ManageSchedulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSchedulesRoutingModule { }
