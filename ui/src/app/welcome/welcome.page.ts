import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { fadeInAnimation, slideInOutAnimation } from '../animations';
import { enterAnimation } from '../animations/nav-animation';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-welcome',

  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.navCtrl.setDirection('forward', true, 'forward', enterAnimation);
      this.router.navigateByUrl(straightlines_io_apis.apis.login_api);
    }, 3900);
  }
}
