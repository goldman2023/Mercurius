import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftCategoryStartTimePageRoutingModule } from './shift-category-start-time-routing.module';

import { ShiftCategoryStartTimePage } from './shift-category-start-time.page';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    ShiftCategoryStartTimePageRoutingModule
  ],
  declarations: [ShiftCategoryStartTimePage],
  schemas:      [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShiftCategoryStartTimePageModule {}
