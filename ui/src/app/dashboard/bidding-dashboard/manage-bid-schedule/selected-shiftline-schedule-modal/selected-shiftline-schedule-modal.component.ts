import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

@Component({
  selector: 'app-selected-shiftline-schedule-modal',
  templateUrl: './selected-shiftline-schedule-modal.component.html',
  styleUrls: ['./selected-shiftline-schedule-modal.component.scss'],
})
export class SelectedShiftlineScheduleModalComponent implements OnInit {
  schedule_list=[]
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private getAllEmp:AddNewEmployeeService,
    private scheduleService:GeneratedScheduleService,
    private headerTitleService: HeaderTitleService,

    private bidScheduleSer:BidScheduleService,
    private fb:FormBuilder
  ) {
    this.schedule_list=navParams.get('scheduleList')
  }

  ngOnInit() {

  }
  dismiss(){
    this.modalCtrl.dismiss()
  }
}
