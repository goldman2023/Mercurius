import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWorkLoadDataPageRoutingModule } from './edit-work-load-data-routing.module';

import { EditWorkLoadDataPage } from './edit-work-load-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditWorkLoadDataPageRoutingModule
  ],
  declarations: [EditWorkLoadDataPage]
})
export class EditWorkLoadDataPageModule {}
