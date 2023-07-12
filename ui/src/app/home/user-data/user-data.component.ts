import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  user_data
  user_data_name
  initials
  fname
  lname
  username
  constructor(public navCtrl: NavController,private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setDefaultHeader(true)
    this.headerTitleService.setBackUrl(null);
this.headerTitleService.setForwardUrl(null);
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    if(this.user_data.empid===undefined){
      this.user_data_name
      this.username=this.user_data.username
    }else{
      this.fname=this.user_data.fname
      this.lname=this.user_data.lname
      this.initials=this.user_data.initials
      this.username=this.user_data.username
    }
  }

}
