import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessRulesPdfPage } from './business-rules-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessRulesPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRulesPdfPageRoutingModule {}
