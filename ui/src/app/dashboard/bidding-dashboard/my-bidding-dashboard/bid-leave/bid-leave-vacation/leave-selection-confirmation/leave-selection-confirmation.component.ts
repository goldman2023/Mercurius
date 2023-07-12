import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-leave-selection-confirmation',
  templateUrl: './leave-selection-confirmation.component.html',
  styleUrls: ['./leave-selection-confirmation.component.scss'],
})
export class LeaveSelectionConfirmationComponent implements OnInit {
  msg
  checkIos=false
  constructor(private route: ActivatedRoute, public modalCtrl: ModalController,   public navParams: NavParams,) {

        this.msg=navParams.get('confirmation_Msg')
  }

  ngOnInit() {
    if(/iPhone/i.test(navigator.userAgent)){
      this.checkIos=true
    }else{
      this.checkIos=false
    }
  }
  dismiss(value){
    this.modalCtrl.dismiss('',value)
  }

}


