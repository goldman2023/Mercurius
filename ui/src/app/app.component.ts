import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { WelcomePage } from './welcome/welcome.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './services/config/config.service';
import { HeaderTitleService } from './dashboard/nav-bar-footer/header-title.service';
// import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  ipAddress
  configUrl
  existingScreenOrientation: string;
  constructor(private platform: Platform,
    public navCtrl: NavController,
    private http:HttpClient,
    private headerTitleService: HeaderTitleService,
    private so: ScreenOrientation,
    public modalCtrl: ModalController,
    public router:Router) {
    this.modalCtrl.create({
      component: WelcomePage
    })

    this.headerTitleService.setTitle('Welcome!');
  }
  ngOnInit(){
    // if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
    //   console.log('3.13.254.87')
    // }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
    //   console.log('3.13.254.87')
    // }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
    //   console.log('52.14.8.217')
    // }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
    //   console.log('3.140.109.198')
    // }else{
    //   console.log('18.119.62.157')
    // }

  }
  lockToPortrait(){
    this.so.lock(this.so.ORIENTATIONS.PORTRAIT);
  }
}
