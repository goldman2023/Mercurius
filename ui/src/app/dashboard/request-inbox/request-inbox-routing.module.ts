import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestInboxComponent } from './request-inbox.component';

const routes: Routes = [
  {path:'', component: RequestInboxComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestInboxRoutingModule { }
