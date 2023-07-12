import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavBarPage } from './nav-bar.page';

const routes: Routes = [
  {
    path: '',
    component: NavBarPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavBarPageRoutingModule {}
