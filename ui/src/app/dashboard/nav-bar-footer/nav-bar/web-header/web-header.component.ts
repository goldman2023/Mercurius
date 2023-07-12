import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';

import { PopoverComponent } from './popover/popover.component';
import straightlines_io_apis from 'src/app/json/apis.json';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.scss'],
})
export class WebHeaderComponent implements OnInit {
  user_data;
  user_data2;
  isOnline: boolean;
  initials: string = 'NA';
  constructor(
    public navCtrl: NavController,
    public popoverController: PopoverController,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.user_data2 = JSON.parse(localStorage.getItem('userData'));
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.updateNetworkStatus());
    window.addEventListener('offline',() =>this.updateNetworkStatus())
    if (this.user_data?.initials) {
      this.initials = this.user_data?.initials
    }
    else{
      this.initials = this.user_data?.fname[0] + this.user_data?.lname[0];
    }
  }
  updateNetworkStatus() {
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      this.openSnackBar("You are online")
    } else {
      this.openSnackBar("You are offline")
      
    }

  }
  home() {
    if (this.user_data.role == 'bidmanager') {
      if (this.user_data.role == 'guest') {
        this.navCtrl.navigateBack([straightlines_io_apis.apis.guest_dashboard]);
      } else {
        this.navCtrl.navigateBack([straightlines_io_apis.apis.dashboard]);
      }
    } else {
      this.navCtrl.navigateBack([straightlines_io_apis.apis.dashboard]);
      // this.navCtrl.navigateBack([straightlines_io_apis.apis.employee_home]);
    }
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onClick: () => {
          popover.dismiss();
        },
      },
    });
    return await popover.present();
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  openSnackBar(data) {
    this.snackBar.open(data, 'Undo', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000,
    });

  }
}
