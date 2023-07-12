import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordChangedMessagePageRoutingModule } from './password-changed-message-routing.module';

import { PasswordChangedMessagePage } from './password-changed-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordChangedMessagePageRoutingModule
  ],
  declarations: [PasswordChangedMessagePage]
})
export class PasswordChangedMessagePageModule {}
