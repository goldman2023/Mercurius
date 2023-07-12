import { Component, OnInit } from '@angular/core';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
@Component({
  selector: 'app-manage-shift-line-schedules',
  templateUrl: './manage-shift-line-schedules.component.html',
  styleUrls: ['./manage-shift-line-schedules.component.scss'],
})
export class ManageShiftLineSchedulesComponent implements OnInit {
  user_data
  constructor(
    private headerTitleService: HeaderTitleService,
  ) { }

  ngOnInit() {
    this.headerTitleService.setTitle('');
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
this.headerTitleService.setDefaultHeader(true)
this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');

      if(this.user_data.role=='bidmanager'){
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.dashboard);
        this.headerTitleService.setForwardUrl(straightlines_io_apis.apis.enter_Work_load_api);
      }else{
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.guest_dashboard);
      this.headerTitleService.setForwardUrl(straightlines_io_apis.apis.guest_enter_Work_load);
      }
  }

}
