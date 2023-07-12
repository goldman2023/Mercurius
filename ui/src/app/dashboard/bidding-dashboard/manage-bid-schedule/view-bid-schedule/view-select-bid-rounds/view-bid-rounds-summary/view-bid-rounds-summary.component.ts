import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  NavController,
  ModalController,
  NavParams,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

@Component({
  selector: 'app-view-bid-rounds-summary',
  templateUrl: './view-bid-rounds-summary.component.html',
  styleUrls: ['./view-bid-rounds-summary.component.scss'],
})
export class ViewBidRoundsSummaryComponent implements OnInit {
  // user_data: any;
  all_bid_rounds = [];
  view_bid_schedule_id;
  editBidSchedule = true;
  newBidSchedule;
  bidScheduleTimeZone;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private scheduleService: GeneratedScheduleService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private getAllEmp: AddNewEmployeeService,
    public alertController: AlertController,
    public alertCtrl: AlertController,
    private timezoneSer: TimezoneService,
    private bidScheduleSer: CreateNewBidScheduleService,
    private localData: LocalDataService
  ) {
    this.view_bid_schedule_id = navParams.get('view_bid_schedule_id');
  }

  ngOnInit() {
    this.getTimeZone();
  }
  bidRoundSUmmaryData() {
    var temp;
    this.all_bid_rounds = [];
    if (this.view_bid_schedule_id == undefined) {
      var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
      for (var i = 0; i < tempObj.roundmap.length; i++) {
        var tempTime =
          Number(tempObj.roundmap[i].roundduration.split(':')[1]) +
          +(+Number(tempObj.roundmap[i].roundduration.split(':')[0])) * 60;
        temp = {
          id: i,
          startDate: tempObj.roundmap[i].roundstartdate,
          endDate: tempObj.roundmap[i].roundenddate,
          bidleavereason: tempObj.roundmap[i].bidleavereason,
          leaveseq_id: tempObj.roundmap[i].roundseq_id,
          roundStartTime: this.convertTimeTo24(
            tempObj.roundmap[i].actual_bidround_start_time
          ),
          roundEndTime: this.convertTimeTo24(
            tempObj.roundmap[i].actual_bidround_end_time
          ),
          duration: tempTime,
        };
        this.all_bid_rounds.push(temp);
      }
      for (var i = 0; i < this.allTimeZone.length; i++) {
        if (this.allTimeZone[i].location == tempObj.timezone) {
          this.bidScheduleTimeZone =
            this.allTimeZone[i].acronym + ' - ' + this.allTimeZone[i].location;
        }
      }
    } else {
      if (this.editBidSchedule == true) {
        var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
        for (var i = 0; i < tempObj.roundmap.length; i++) {
          var tempTime =
            Number(tempObj.roundmap[i].roundduration.split(':')[1]) +
            +(+Number(tempObj.roundmap[i].roundduration.split(':')[0])) * 60;
          temp = {
            id: i,
            startDate: tempObj.roundmap[i].roundstartdate,
            endDate: tempObj.roundmap[i].roundenddate,
            bidleavereason: tempObj.roundmap[i].bidleavereason,
            leaveseq_id: tempObj.roundmap[i].roundseq_id,
            roundStartTime: this.convertTimeTo24(
              tempObj.roundmap[i].actual_bidround_start_time
            ),
            roundEndTime: this.convertTimeTo24(
              tempObj.roundmap[i].actual_bidround_end_time
            ),
            duration: tempTime,
          };
          this.all_bid_rounds.push(temp);
        }
        for (var i = 0; i < this.allTimeZone.length; i++) {
          if (this.allTimeZone[i].location == tempObj.timezone) {
            this.bidScheduleTimeZone =
              this.allTimeZone[i].acronym +
              ' - ' +
              this.allTimeZone[i].location;
          }
        }
      } else {
        this.viewBidScheduleData();
      }
    }
  }
  allTimeZone;
  getTimeZone() {
    this.timezoneSer.getAllTimeZone().subscribe(
      (res) => {
        this.allTimeZone = res;
        this.bidRoundSUmmaryData();
      },
      (err) => {
        console.log(err);
        this.allTimeZone = [];
        this.allTimeZone.push({ location: 'US/Eastern', acronym: 'EST' }),
          this.bidRoundSUmmaryData();
      },
      () => {}
    );
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
          for (var i = 0; i < this.newBidSchedule.roundmap.length; i++) {
            var tempTime =
              Number(
                this.newBidSchedule.roundmap[i].roundduration.split(':')[1]
              ) +
              +(+Number(
                this.newBidSchedule.roundmap[i].roundduration.split(':')[0]
              )) *
                60;
            temp = {
              id: i,
              startDate: this.newBidSchedule.roundmap[i].roundstartdate,
              endDate: this.newBidSchedule.roundmap[i].roundenddate,
              bidleavereason: this.newBidSchedule.roundmap[i].bidleavereason,
              roundseq_id: this.newBidSchedule.roundmap[i].roundseq_id,
              roundStartTime: this.convertTimeTo24(
                this.newBidSchedule.roundmap[i].actual_bidround_start_time
              ),
              roundEndTime: this.convertTimeTo24(
                this.newBidSchedule.roundmap[i].actual_bidround_end_time
              ),
              duration: tempTime,
            };
            this.all_bid_rounds.push(temp);
          }
          for (var i = 0; i < this.allTimeZone.length; i++) {
            if (this.allTimeZone[i].location == this.newBidSchedule.timezone) {
              this.bidScheduleTimeZone =
                this.allTimeZone[i].acronym +
                ' - ' +
                this.allTimeZone[i].location;
            }
          }
        },
        (err) => {},
        () => {}
      );
  }
  convertTimeTo24(time) {
    const [hour, minute] = time.split(':').map(Number);
    const isNoonOrMidnight = hour === 0 || hour === 12;

    if (isNoonOrMidnight) {
      const period = hour === 0 ? 'AM' : 'PM';
      return `12:${minute.toString().padStart(2, '0')} ${period}`;
    }

    const period = hour < 12 ? 'AM' : 'PM';
    const convertedHour = hour % 12;
    return `${convertedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }
  close() {
    this.modalCtrl.dismiss();
  }
}
