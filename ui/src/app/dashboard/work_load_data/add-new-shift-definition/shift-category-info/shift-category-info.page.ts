import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shift-category-info',
  templateUrl: './shift-category-info.page.html',
  styleUrls: ['./shift-category-info.page.scss'],
})
export class ShiftCategoryInfoPage implements OnInit {

  constructor(public modalCtrl: ModalController,) { }

  ngOnInit() {
  }
close(){
  this.modalCtrl.dismiss();
}
}
