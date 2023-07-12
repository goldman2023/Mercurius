import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestInboxRoutingModule } from './request-inbox-routing.module';
import { RequestInboxComponent } from './request-inbox.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { ApprovedRequestsComponent } from './approved-requests/approved-requests.component';
import { DeniedequestsComponent } from './deniedequests/deniedequests.component';


@NgModule({
  declarations: [
    RequestInboxComponent,
    PendingRequestsComponent,
    ApprovedRequestsComponent,
    DeniedequestsComponent,
  ],
  imports: [
    CommonModule,
    RequestInboxRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})
export class RequestInboxModule { }
