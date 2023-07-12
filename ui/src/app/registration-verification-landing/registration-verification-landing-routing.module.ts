import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationVerificationLandingPage } from './registration-verification-landing.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationVerificationLandingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationVerificationLandingPageRoutingModule {}
