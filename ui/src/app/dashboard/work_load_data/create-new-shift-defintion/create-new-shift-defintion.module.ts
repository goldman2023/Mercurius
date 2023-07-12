import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewShiftDefintionPageRoutingModule } from './create-new-shift-defintion-routing.module';

import { CreateNewShiftDefintionPage } from './create-new-shift-defintion.page';
import { FooterPageModule } from 'src/app/dashboard/nav-bar-footer/footer/footer.module';
import { NavBarPageModule } from 'src/app/dashboard/nav-bar-footer/nav-bar/nav-bar.module';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterPageModule,
    MatDividerModule,
    NavBarPageModule,
    CreateNewShiftDefintionPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateNewShiftDefintionPage],
  schemas:      [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateNewShiftDefintionPageModule {}
