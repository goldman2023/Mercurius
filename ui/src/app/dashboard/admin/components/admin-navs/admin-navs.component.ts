import { Component } from '@angular/core';


import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-admin-navs',
  templateUrl: './admin-navs.component.html',
  styleUrls: ['./admin-navs.component.scss']
})
export class AdminNavsComponent{
  navs
  constructor(public sharedData: SharedDataService){
    this.navs = sharedData.navs
  }

}

