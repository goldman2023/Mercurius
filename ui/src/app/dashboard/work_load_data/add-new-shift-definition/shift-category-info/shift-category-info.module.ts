import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftCategoryInfoPageRoutingModule } from './shift-category-info-routing.module';

import { ShiftCategoryInfoPage } from './shift-category-info.page';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    ShiftCategoryInfoPageRoutingModule
  ],
  declarations: [ShiftCategoryInfoPage],
  schemas:      [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShiftCategoryInfoPageModule {}
