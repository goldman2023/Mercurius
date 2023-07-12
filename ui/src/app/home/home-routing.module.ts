import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/auth/auth.guard';
import { HomePage } from './home.page';
import straightlines_io_apis from 'src/app/json/apis.json';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },

  {
    path: 'feedback',
    loadChildren: () => import('../home/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'straightlines-io-video',
    loadChildren: () => import('./straightlines-io-video/straightlines-io-video.module').then( m => m.StraightlinesIoVideoPageModule)
  },
  {
    path: straightlines_io_apis.apis.register_api,
    loadChildren: () => import('./login-register/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./login-register/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'password-changed-message',
    loadChildren: () => import('./login-register/reset-password/password-changed-message/password-changed-message.module').then( m => m.PasswordChangedMessagePageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
