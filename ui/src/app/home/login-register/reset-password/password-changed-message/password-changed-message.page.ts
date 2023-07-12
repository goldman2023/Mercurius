import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-password-changed-message',
  templateUrl: './password-changed-message.page.html',
  styleUrls: ['./password-changed-message.page.scss'],
})
export class PasswordChangedMessagePage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
signIn(){
  this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api)
}
}
