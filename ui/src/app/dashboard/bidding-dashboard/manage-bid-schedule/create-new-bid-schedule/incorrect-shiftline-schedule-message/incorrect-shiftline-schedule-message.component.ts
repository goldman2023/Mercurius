import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';

@Component({
  selector: 'app-incorrect-shiftline-schedule-message',
  templateUrl: './incorrect-shiftline-schedule-message.component.html',
  styleUrls: ['./incorrect-shiftline-schedule-message.component.scss'],
})
export class IncorrectShiftlineScheduleMessageComponent implements OnInit {
  all_final_data_shiftline_length
  totalEmp
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private headerTitleService: HeaderTitleService,
    private bidShiftLineSer:BidShiftlinesService,
    private scheduleService:GeneratedScheduleService,
    private bidScheduleSer:CreateNewBidScheduleService,
    private getAllEmp:AddNewEmployeeService,
    private bidWindowSer:BidWindowService,
    private emaliNotificationsSer:EmailNotificationsService,
    private fb:FormBuilder
  ) {
    this.totalEmp=navParams.get('totalEmp')
    this.all_final_data_shiftline_length=navParams.get('all_final_data_shiftline_length')
   }

  ngOnInit() {}
  close(){this.modalCtrl.dismiss()}
}
