import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditScheduleDataPageRoutingModule } from './edit-schedule-data-routing.module';

import { EditScheduleDataPage } from './edit-schedule-data.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BusinessRulesPdfPageModule } from '../business-rules-pdf/business-rules-pdf.module';
import { BusinessRulesPdfPage } from '../business-rules-pdf/business-rules-pdf.page';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarPageModule,
    ReactiveFormsModule,
    PdfViewerModule,
    MatDividerModule,
    BusinessRulesPdfPageModule,
    EditScheduleDataPageRoutingModule
  ],
  declarations: [EditScheduleDataPage]
})
export class EditScheduleDataPageModule {}
