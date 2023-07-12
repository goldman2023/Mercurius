import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessRulesPdfPageRoutingModule } from './business-rules-pdf-routing.module';

import { BusinessRulesPdfPage } from './business-rules-pdf.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    BusinessRulesPdfPageRoutingModule
  ],
  declarations: [BusinessRulesPdfPage]
})
export class BusinessRulesPdfPageModule {}
