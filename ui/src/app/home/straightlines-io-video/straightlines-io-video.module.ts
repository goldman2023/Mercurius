import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StraightlinesIoVideoPageRoutingModule } from './straightlines-io-video-routing.module';

import { StraightlinesIoVideoPage } from './straightlines-io-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StraightlinesIoVideoPageRoutingModule
  ],
  declarations: [StraightlinesIoVideoPage]
})
export class StraightlinesIoVideoPageModule {}
