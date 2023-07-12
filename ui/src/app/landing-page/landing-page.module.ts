import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPagePageRoutingModule } from './landing-page-routing.module';

import { LandingPagePage } from './landing-page.page';
// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestDemoModelComponent } from './request-demo-model/request-demo-model.component';
import { StartMyFreeTrialComponent } from './start-my-free-trial/start-my-free-trial.component';

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    IonicModule.forRoot(),
    NgbModule,
    LandingPagePageRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    // BrowserAnimationsModule,
    MatSelectModule,
    CommonModule,



  ],
  // providers: [ScreenOrientation,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [LandingPagePage],

  declarations: [LandingPagePage,RequestDemoModelComponent,StartMyFreeTrialComponent]
})
export class LandingPagePageModule {}
