import straightlines_io_apis from 'src/app/json/apis.json';

import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  PopoverController
} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css'],
})
export class PopoverComponent implements OnInit {
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popoverController: PopoverController
  ) {}
  checklogutClickedOrNot = false;
  ngOnInit(): void {}

  async logout() {
    this.popoverController.dismiss();
    this.checklogutClickedOrNot = true;
    const confirm = await this.alertCtrl.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out of the application?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.checklogutClickedOrNot = false;
          },

        },
        {
          text: 'YES',

          role: 'ok',
          handler: () => {
            sessionStorage.clear();
            localStorage.clear()
            this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api);
            this.checklogutClickedOrNot = true;
          },
        },
      ],
    });

    await confirm.present();
  }
}
