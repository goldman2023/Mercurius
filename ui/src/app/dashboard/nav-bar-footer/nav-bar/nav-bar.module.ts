import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NavBarPageRoutingModule } from './nav-bar-routing.module';

import { NavBarPage } from './nav-bar.page';
import { BlankHeaderForModalPageComponent } from './blank-header-for-modal-page/blank-header-for-modal-page.component';
import { BlankHeaderComponent } from './blank-header/blank-header.component';
import { WebHeaderComponent } from './web-header/web-header.component';
import { PopoverComponent } from './web-header/popover/popover.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [
    BlankHeaderForModalPageComponent,
    BlankHeaderComponent,
    WebHeaderComponent,
  ],
  declarations: [
    BlankHeaderForModalPageComponent,
    BlankHeaderComponent,
    WebHeaderComponent,
    PopoverComponent,
  ],
})
export class NavBarPageModule {}
