import { Component} from '@angular/core';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';

@Component({
  selector: 'app-manage-schedules',
  templateUrl: './manage-schedules.component.html',
  styleUrls: ['./manage-schedules.component.scss']
})
export class ManageSchedulesComponent {
  user_data
  constructor( private headerTitleService: HeaderTitleService) {
    this.headerTitleService.setTitle('Welcome!');

    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  }
  getPermissionFunctionName(functionName){
    return this.user_data.permissionDetails.some(element => element.functionName === functionName);
  }
}
