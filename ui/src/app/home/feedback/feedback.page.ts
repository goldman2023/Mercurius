import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(public route:Router,public navCtrl: NavController) {}



  ngOnInit() {
  }
  goBack(){
    this.navCtrl.navigateBack('home')
  }
}
