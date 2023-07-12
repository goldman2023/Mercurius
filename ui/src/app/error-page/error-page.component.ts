import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent implements OnInit {

  constructor(public navCtrl: NavController,) { }

  ngOnInit() {
    this.navCtrl.navigateBack([straightlines_io_apis.apis.dashboard])
  }

}
