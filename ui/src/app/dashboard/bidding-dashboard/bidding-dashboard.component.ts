import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-bidding-dashboard',
  templateUrl: './bidding-dashboard.component.html',
  styleUrls: ['./bidding-dashboard.component.scss'],
})
export class BiddingDashboardComponent implements OnInit {
  user_data: any;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private headerTitleService: HeaderTitleService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.headerTitleService.setTitle('Bidding Dashboard');
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.dashboard);
    this.headerTitleService.setForwardUrl(straightlines_io_apis.apis.my_bidding);
    this.headerTitleService.setDefaultHeader(true);
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.platform.resize.subscribe(async () => {
      this.redirectIfXs();
    });
    this.redirectIfXs();
  }
  isXsScreen() {
    return this.platform.width() <= 768;
  }
  redirectIfXs() {
    if (this.isXsScreen()) {
      this.navCtrl.pop();
      this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding]);
    }
  }
  generateSceduleByStraightline() {
    this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding]);
  }
  manageBidSchedule() {
    this.navCtrl.navigateForward([
      straightlines_io_apis.apis.manage_bid_schedule,
    ]);
  }
  assignBidSchedule() {
    this.navCtrl.navigateForward([
      straightlines_io_apis.apis.assign_bid_schedule
    ])
  }
  async bidding() {
    if (this.user_data.role === 'bidmanager' || this.user_data.role == 'emp') {
      this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding]);
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message:
          "Sorry, you don't have access to bidding feature! Please upgrade your plan.",
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
  getPermissionfunctionName(functionName){
    return this.user_data.permissionDetails.some(element => element.functionName === functionName);
  }
}
