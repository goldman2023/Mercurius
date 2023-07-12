import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StraightlinesIoVideoPage } from './straightlines-io-video.page';

const routes: Routes = [
  {
    path: '',
    component: StraightlinesIoVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StraightlinesIoVideoPageRoutingModule {}
