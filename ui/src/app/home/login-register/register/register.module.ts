import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { NavBarPageModule } from "../../../dashboard/nav-bar-footer/nav-bar/nav-bar.module";

@NgModule({
    declarations: [RegisterPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RegisterPageRoutingModule,
        IonicModule.forRoot({ scrollAssist: false }),
        NavBarPageModule
    ]
})
export class RegisterPageModule {}
