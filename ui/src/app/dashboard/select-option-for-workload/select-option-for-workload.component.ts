import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-select-option-for-workload',
  templateUrl: './select-option-for-workload.component.html',
  styleUrls: ['./select-option-for-workload.component.scss'],
})
export class SelectOptionForWorkloadComponent implements OnInit {

  constructor(public navCtrl: NavController,private headerTitleService: HeaderTitleService,) { }

  ngOnInit() {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setDefaultHeader(true)
    this.headerTitleService.setBackUrl(null);
this.headerTitleService.setForwardUrl(null);
  }
  generateSceduleByStraightline(){
    this.navCtrl.navigateForward([straightlines_io_apis.apis.manage_shift_line_schedule])
  }
  importExcelSheet(){
    this.navCtrl.navigateForward([straightlines_io_apis.apis.import_excel_sheet_schedule])
  }
}
