import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shift-category-start-time',
  templateUrl: './shift-category-start-time.page.html',
  styleUrls: ['./shift-category-start-time.page.scss'],
})
export class ShiftCategoryStartTimePage implements OnInit {

 constructor(public modalCtrl: ModalController,) { }

  ngOnInit() {
  }
  close(){
    this.modalCtrl.dismiss();
  }
}
