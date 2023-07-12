import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationVerificationLandingPageRoutingModule } from './registration-verification-landing-routing.module';

import { RegistrationVerificationLandingPage } from './registration-verification-landing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationVerificationLandingPageRoutingModule
  ],
  declarations: [RegistrationVerificationLandingPage]
})
export class RegistrationVerificationLandingPageModule {}
