import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

@Component({
  selector: 'app-selected-employee-modal',
  templateUrl: './selected-employee-modal.component.html',
  styleUrls: ['./selected-employee-modal.component.scss'],
})
export class SelectedEmployeeModalComponent implements OnInit {
Emp_list=[]
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
    this.Emp_list=navParams.get('empList')
  }

  ngOnInit() {

  }
  dismiss(){
    this.modalCtrl.dismiss()
  }
}
