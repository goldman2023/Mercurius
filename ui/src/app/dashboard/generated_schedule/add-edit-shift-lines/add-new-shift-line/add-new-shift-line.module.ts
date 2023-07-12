import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewShiftLinePageRoutingModule } from './add-new-shift-line-routing.module';

import { AddNewShiftLinePage } from './add-new-shift-line.page';
import { MatDividerModule } from '@angular/material/divider';
import { FooterPageModule } from 'src/app/dashboard/nav-bar-footer/footer/footer.module';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    ReactiveFormsModule,
    NavBarPageModule,
    FooterPageModule,
    AddNewShiftLinePageRoutingModule
  ],
  declarations: [AddNewShiftLinePage]
})
export class AddNewShiftLinePageModule {}
