import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import moment from 'moment';
import { AssingscheduleService } from 'src/app/services/assignschedule/assingschedule.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SaveAssignSchedulesModalComponent } from './save-assign-schedules-modal/save-assign-schedules-modal.component';

@Component({
  selector: 'app-assign-schedules',
  templateUrl: './assign-schedules.component.html',
  styleUrls: ['./assign-schedules.component.scss']
})
export class AssignSchedulesComponent implements OnInit {
  schedules = []
  employeers = [];
  spinner = true;

  step = -1;
  panelOpenState = false;
  datepicker = moment(new Date()).format('mm/dd/yyyy');
  from_date = new Date();
  to_date;
  connectTo: any = [];
  range = new FormGroup({
    start: new FormControl(),
    end:new FormControl()
  })

  constructor(
    private headerTitleService: HeaderTitleService,
    private assignScheduleService: AssingscheduleService,
    public modalCtr:ModalController
  ) { 
    for (let week of this.schedules) {
      this.connectTo.push(week);
    };
  }

  ngOnInit(): void {
    this.headerTitleService.setTitle('Assign Shiftline Schedules');
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.dashboard);
    this.headerTitleService.setDefaultHeader(true);
    var user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.assignScheduleService.getEmployeeListByUserId(user_data.id).subscribe(response => {
      this.employeers = response
    },
      error => {

      }
    )
    this.assignScheduleService.getShiftlinesByUserIdAndStatus(user_data.id,1).subscribe(response => {
      this.schedules = response;
      let temp = 0;
      for (let i = 0; i < response.length; i++) {
        const element = response[i].schild;
        var temp_schild = [];
        for (let j = 0; j < element.length; j++) {
          element[j].shiftname = element[j].shiftname +  (element[j].seq_id  + + + 1)
          temp_schild.push([element[j]])
          temp += 1;
        }
        this.schedules[i].schild = temp_schild
      }
      this.spinner = false
    })
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length < 2) {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                           event.previousIndex,
            event.currentIndex);
      }
      this.drop_id = []
    }
  }
  setStep(index) {
    this.step = index
  }

  isEnableSubmit(index) {
    let isChanged = false
    for (let i = 0; i < this.schedules[index].schild.length; i++) {
      const element = this.schedules[index].schild[i];
      if (element.length > 1) {
        isChanged = true
        break;
      }
    }
    return !this.range.value.start || !this.range.value.end || !isChanged
  }
  drop_id:any=[];

  handleEntered(a) {
    this.drop_id = a.container.data[0];
  }

  handleClass(item) {
    if (this.drop_id.sh_line_id == item[0].sh_line_id && item.length < 2 ) {
      return 'entered'
    }
  }
  handleDelete(item, index,index1) {
    this.schedules[index1].schild[index] = this.schedules[index1].schild[index].filter(e => {
      return e.empid != item.empid 
    })
    this.employeers.push(item);
    this.employeers = this.employeers.sort((a, b) => a.empid - b.empid);
  }
  async save(index) {
    let changedSchedule = [];
    for (let i = 0; i < this.schedules[index].schild.length; i++) {
      const element = this.schedules[index].schild[i];
      if (element.length > 1) {
        changedSchedule.push(element)
        // break;
      }
    }
    const modal = await this.modalCtr.create({
      component: SaveAssignSchedulesModalComponent,
      cssClass: 'saveSchedule',
      componentProps: {assignScheduleData:changedSchedule,dateRange:this.range.value,scheduleName:this.schedules[index].schedulename },
      swipeToClose:true
    });
    return await modal.present();
  }
}
