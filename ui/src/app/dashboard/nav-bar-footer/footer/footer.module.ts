import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FooterPageRoutingModule } from './footer-routing.module';

import { FooterPage } from './footer.page';
import { FooterComponent } from './footer/footer.component';
import { BlankFooterComponent } from './blank-footer/blank-footer.component';

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [FooterComponent,BlankFooterComponent],
  exports: [FooterComponent,BlankFooterComponent],
})
export class FooterPageModule {}
