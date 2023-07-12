import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HeaderTitleForModalPageService } from '../../header-title-for-modal-page.service';
import { HeaderTitleService } from '../../header-title.service';

@Component({
  selector: 'app-blank-header-for-modal-page',
  templateUrl: './blank-header-for-modal-page.component.html',
  styleUrls: ['./blank-header-for-modal-page.component.scss'],
})
export class BlankHeaderForModalPageComponent implements OnInit {
  title
  constructor(public modalCtrl: ModalController,
    private headerTitleService: HeaderTitleForModalPageService) { }

  ngOnInit() {
    this.headerTitleService.title.subscribe(title => {
      this.title = title;
    });
  }
  dismiss(){
    this.modalCtrl.dismiss();
  }

}
