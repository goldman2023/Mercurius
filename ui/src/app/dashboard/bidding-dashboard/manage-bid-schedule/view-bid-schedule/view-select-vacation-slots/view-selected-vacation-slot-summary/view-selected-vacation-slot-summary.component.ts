import { Component, OnInit } from '@angular/core';
import {
  NavController,
  ModalController,
  NavParams,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';

@Component({
  selector: 'app-view-selected-vacation-slot-summary',
  templateUrl: './view-selected-vacation-slot-summary.component.html',
  styleUrls: ['./view-selected-vacation-slot-summary.component.scss'],
})
export class ViewSelectedVacationSlotSummaryComponent implements OnInit {
  vacation_slot_id;
  vacation_slot_data;
  temp;
  editHide = true;
  schedule_id;
  all_slots = [];
  user_data;
  vacationSlotForm: any;
  view_bid_schedule_id;
  newBidSchedule;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public alertCtrl: AlertController,
    private bidScheduleSer: CreateNewBidScheduleService
  ) {
    this.view_bid_schedule_id = navParams.get('view_bid_schedule_id');
  }

  ngOnInit() {
    this.viewBidScheduleData();
  }
  viewBidScheduleData() {
    this.bidScheduleSer
      .getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(
        this.view_bid_schedule_id
      )
      .subscribe(
        (res) => {
          this.newBidSchedule = res;
          var temp;
          this.all_slots = [];
          for (var i = 0; i < this.newBidSchedule.leavemap.length; i++) {
            temp = {
              id: i,
              startDate: this.newBidSchedule.leavemap[i].leavestartdate,
              endDate: this.newBidSchedule.leavemap[i].leaveenddate,
              slots: this.newBidSchedule.leavemap[i].leaveslots,
              leaveseq_id: this.newBidSchedule.leavemap[i].leaveseq_id,
            };
            this.all_slots.push(temp);
          }
        },
        (err) => {},
        () => {}
      );
  }
  close() {
    this.modalCtrl.dismiss();
  }
  submit() {}
}
