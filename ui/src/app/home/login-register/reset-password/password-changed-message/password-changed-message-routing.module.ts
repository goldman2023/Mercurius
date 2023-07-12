import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangedMessagePage } from './password-changed-message.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangedMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordChangedMessagePageRoutingModule {}
