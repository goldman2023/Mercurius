import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AlertController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from '@ionic/angular';
import { isEqual, omit } from 'lodash';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';
import { LocalDataService } from './../../../../../services/data/local-data.service';

import moment from 'moment';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { ViewBidWindowComponent } from '../../../my-bidding-dashboard/view-bid-window/view-bid-window.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-select-bid-rounds',
  templateUrl: './select-bid-rounds.component.html',
  styleUrls: ['./select-bid-rounds.component.scss'],
})
export class SelectBidRoundsComponent implements OnInit {
  @Input() isModal: boolean = true;
  @Input() checkValuechanged: boolean = false;
  @Input() editBidSchedule: boolean = false;
  @Input() totalCreatedVacationHours;
  @Input() totalRequiredVacationHours;
  @Input() totalAccumulatedLeaves;
  @Output() roundsSelected = new EventEmitter();
  @Output() dataComputed = new EventEmitter();
  @Output() roundsComputed = new EventEmitter();
  isIntervalValid: boolean = true;
  intervalValidation: string = '';
  displayIntervalAlert: boolean = true;
  isComputingFirstTime: Boolean = true;
  roundsChangeData: Boolean[] = [];
  displayTimeAlert: Boolean = false;
  sameTimeForAll: boolean = true;
  noTimeForAny: boolean = false;
  hasInterval: boolean = false;
  isRangeValid: boolean = true;
  preTimeValue: string;
  preIntervalTime: string = '12:00:00';
  setUpBidParametersForm: any;
  roundStartTime;
  minDate = new Date();
  start_date;
  start_time;
  end_date;
  dateValidation = false;
  defaultMAxLeave = 0;
  end_time;
  finalViewBidWindowData = [];
  tempArr = [];
  all_window_data = [];
  end: string;
  start: string;
  EmpListBasedOnRound = [];
  bid_duration;
  all_bid_round_data = [];
  total_SBP_rounds;
  totalEmp = 31;
  minDateForBidRound = new Date(2021, 10, 4);
  leave_selection_list = [
    '2 weeks NC',
    '2 weeks C',
    '5 days (1 Week) in 7',
    'Up to 10 days NC',
    'Up to 5 days NC',
    '1 week',
    '1 day',
  ];
  all_SBP_rounds = [];
  myToast;
  alertMsg = null;
  expand_id;
  expand_id_validation;
  items = [];
  currentBidScheduleName: string;
  user_data: any;
  setUpBidScheduleOne: any;
  startDateForUpdateBidRound: any;
  allScheduleData: any[];
  all_final_data: any[];
  bidding_start_date: any;
  maxLeave = 0;
  allEmployee = [];
  totalBidRounds = 0;
  checkComputedButton = true;
  roundListForm: FormGroup;
  allRoundInfo: any[];
  totalDefaultEmp: any;
  shiftLinesSchedule: any[];
  bidSchedule: any;
  shiftlineScheduleData;
  all_final_data_for_total_emp: any[];
  bidScheduleId: any;
  totalRequiredROunds: number = 0;
  vacation: any[];
  allTimeZone = [];
  defaultVacation: any[];
  todayDate = new Date().getHours() + ':' + new Date().getMinutes();
  manualRoundState = false;
  manualRoundCount = -1;
  isSaved = false;
  constructor(
    // public navCtrl: NavController,
    public navCtrl: NavController,
    private headerTitleService: HeaderTitleService,
    public navParams: NavParams,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public empSer: EmployeeService,
    private bidWindowSer:BidWindowService,
    private getAllEmp: AddNewEmployeeService,
    public alertController: AlertController,
    private scheduleService: GeneratedScheduleService,
    private timezoneSer: TimezoneService,
    private cdref: ChangeDetectorRef,
    private setUPbidRoundSer: SetupBidRoundService,
    private localData: LocalDataService
  ) {

    if(this.isModal){
      this.editBidSchedule = navParams.get('editBidSchedule');
      if (this.editBidSchedule) {
        this.checkValuechanged = navParams.get('checkValuechanged');
        this.totalCreatedVacationHours = navParams.get(
          'edittotalCreatedVacationHours'
        );
        this.totalRequiredVacationHours = navParams.get(
          'edittotalRequiredVacationHours'
        );
      } else {
        this.checkValuechanged = navParams.get('checkValuechanged');
        this.totalCreatedVacationHours = navParams.get(
          'totalCreatedVacationHours'
        );
        this.totalRequiredVacationHours = navParams.get(
          'totalRequiredVacationHours'
        );
      }
    }
  }

  async ngOnInit() {
    this.getAllEmployee();
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.setUpBidScheduleOne = JSON.parse(
      this.localData.getItem('setUpBidScheduleOne')
    );

    this.setUpBidParametersForm = this.fb.group({
      id: new FormControl('newid'),
      SBP_start_date: new FormControl(
        new Date(),
        Validators.compose([Validators.required])
      ),
      checkIncludeExclude: new FormControl(false),
      checkIncludeIntervals: new FormControl(false),
      intervalDuration: new FormControl('00:00:00'),
      intervalStart: new FormControl('12:00:00'),
      SBP_start_time: new FormControl(
        '08:00:00',
        Validators.compose([Validators.required])
      ),
      SBP_end_time: new FormControl(
        '16:30:00',
        Validators.compose([Validators.required])
      ),
      SBP_bidding_duration: new FormControl(
        '00:30:00',
        Validators.compose([Validators.required])
      ),
      SBP_timeZone: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      SBP_leave_selection_rules: new FormControl(
        this.leave_selection_list[0],
        Validators.compose([Validators.required])
      ),
    });

    this.getTimeZone();
  }

  next() {
    this.totalEmployees();

    this.getAllEmployeeList();

    // this.setUpBidParametersForm.controls.SBP_end_time.setValue('16:30:00');
    this.total_SBP_rounds = this.all_SBP_rounds.length;
    for (var i = 0; i < this.all_SBP_rounds.length; i++) {
      this.items.push({
        expanded: false,
        SBP_start_date: this.all_SBP_rounds[i].SBP_start_date,
        SBP_start_time: this.all_SBP_rounds[i].SBP_start_time,
        SBP_end_date: this.all_SBP_rounds[i].SBP_end_date,
        SBP_end_time: this.all_SBP_rounds[i].SBP_end_time,
        SBP_bidding_duration: this.all_SBP_rounds[i].SBP_bidding_duration,
        SBP_leave_selection_rules:
          this.all_SBP_rounds[i].SBP_leave_selection_rules,
      });
    }
    this.roundListForm = this.fb.group({
      allRoundData: this.fb.array([]),
    });

    if (this.editBidSchedule == true) {
      var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));

      this.bidScheduleId = tempObj.bidschid;
      if (tempObj != null) {
        if (tempObj.roundmap.length > 0) {
          var temp,
            tempArr = [];
          var totalRequiredRounds = tempObj.roundmap.length;
          this.totalBidRounds = totalRequiredRounds;
          this.setUpBidParametersForm.controls.checkIncludeIntervals.setValue(
            tempObj.hasinterval
          );
          this.setUpBidParametersForm.controls.intervalDuration.setValue(
            tempObj.intervalduration ?? '00:00:00'
          );
          this.hasInterval = tempObj.hasinterval;
          this.setUpBidParametersForm.controls.intervalStart.setValue(
            tempObj.intervalstarttime ?? '12:00:00'
          );
          for (var i = 0; i < totalRequiredRounds; i++) {
            this.allRoundData.push(this.newRound());
            if (i == 0 && tempObj.roundmap[i].roundseq_id == 1) {
              var result = tempObj.roundmap[i].roundstartdate.includes('T');
              if (result == true) {
                var t = tempObj.roundmap[i].roundstartdate.split('T');
                var sDate = t[0].split('-');
              } else {
                var sDate = tempObj.roundmap[i].roundstartdate.split('-');
              }
              var startDate = new Date(
                sDate[0],
                Number(sDate[1]) + -+1,
                sDate[2],
                0,
                0,
                0
              );

              this.setUpBidParametersForm.controls.SBP_start_date.setValue(
                startDate
              );
              this.setUpBidParametersForm.controls.SBP_start_time.setValue(
                tempObj.roundmap[i].actual_bidround_start_time
              );
              this.setUpBidParametersForm.controls.SBP_end_time.setValue(
                tempObj.roundmap[i].actual_bidround_end_time
              );
              if (tempObj.weekendstatus == 1 || tempObj.weekendstatus == true) {
                this.setUpBidParametersForm.controls.checkIncludeExclude.setValue(
                  true
                );
              } else {
                this.setUpBidParametersForm.controls.checkIncludeExclude.setValue(
                  false
                );
              }
              if (tempObj.timezone != '') {
                this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                  tempObj.timezone
                );
              } else {
                if (this.allTimeZone.length < 1) {
                  this.allTimeZone.push({
                    location: 'US/Eastern',
                    acronym: 'EST',
                  });
                  this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                    'US/Eastern'
                  );
                } else {
                  this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                    'US/Eastern'
                  );
                }
              }
            }

            var duration = tempObj.roundmap[i].roundduration;

            var num = Number(duration);
            var hours = num / 60;
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            var fhours, fminutes;
            if (rhours < 10) {
              fhours = String('0' + rhours);
            } else {
              fhours = String(rhours);
            }
            if (rminutes < 10) {
              fminutes = String('0' + rminutes);
            } else {
              fminutes = String(rminutes);
            }
            temp = {
              id: i,
              roundduration: duration,
              leaveRule: tempObj.roundmap[i].bidleavereason,
              bidroundid: tempObj.roundmap[i].bidroundid,
              bidschref: tempObj.roundmap[i].bidschref,
            };
            const roundstart = tempObj.roundmap[i].actual_bidround_start_time;
            const roundend = tempObj.roundmap[i].actual_bidround_end_time;
            temp = {
              ...temp,
              roundstart: roundstart,
              roundend: roundend,
            };
            tempArr.push(temp);
          }

          var count = 0;
          for (var i = 0; i < tempArr.length; i++) {
            if (tempArr[i].bidschref == undefined) {
              count++;
            }
          }
          this.allRoundData.setValue(tempArr);
          this.totalRequiredROunds =
            this.roundListForm.value.allRoundData.length;
          if (this.totalRequiredROunds > 0) {
            this.bidSchedule = tempObj;
            this.totalEmp = this.bidSchedule.employeemap.length;
            this.createBidROundData(false);
          }
        }
      } else {
        this.checkComputedButton = false;
      }
    } else {
      var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
      if (tempObj != null) {
        if (tempObj.roundmap.length > 0) {
          var temp,
            tempArr = [];

          var totalRequiredRounds = tempObj.roundmap.length;
          this.totalBidRounds = totalRequiredRounds;
          this.setUpBidParametersForm.controls.checkIncludeIntervals.setValue(
            tempObj.hasinterval
          );
          this.setUpBidParametersForm.controls.intervalDuration.setValue(
            tempObj.intervalduration ?? '00:00:00'
          );
          this.hasInterval = tempObj.hasinterval;
          this.setUpBidParametersForm.controls.intervalStart.setValue(
            tempObj.intervalstarttime ?? '12:00:00'
          );
          for (var i = 0; i < totalRequiredRounds; i++) {
            this.allRoundData.push(this.newRound());
            if (i == 0 && tempObj.roundmap[i].roundseq_id == 1) {
              var result = tempObj.roundmap[i].roundstartdate.includes('T');
              if (!result) {
                var sDate = tempObj.roundmap[i].roundstartdate.split('-');
              } else {
                var t = tempObj.roundmap[i].roundstartdate.split('T');
                sDate = t[0].split('-');
              }

              var startDate = new Date(
                sDate[0],
                Number(sDate[1]) + -+1,
                sDate[2],
                0,
                0,
                0
              );
              this.setUpBidParametersForm.controls.SBP_start_date.setValue(
                startDate
              );
              this.setUpBidParametersForm.controls.SBP_start_time.setValue(
                tempObj.roundmap[i].actual_bidround_start_time
              );
              this.setUpBidParametersForm.controls.SBP_end_time.setValue(
                tempObj.roundmap[i].actual_bidround_end_time
              );
              if (tempObj.weekendstatus == 1 || tempObj.weekendstatus == true) {
                this.setUpBidParametersForm.controls.checkIncludeExclude.setValue(
                  true
                );
              } else {
                this.setUpBidParametersForm.controls.checkIncludeExclude.setValue(
                  false
                );
              }
              if (tempObj.timezone != '') {
                this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                  tempObj.timezone
                );
              } else {
                if (this.allTimeZone.length < 1) {
                  this.allTimeZone.push({
                    location: 'US/Eastern',
                    acronym: 'EST',
                  });
                  this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                    'US/Eastern'
                  );
                } else {
                  this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                    'US/Eastern'
                  );
                }
              }
            }
            var duration = tempObj.roundmap[i].roundduration.split(':')[1];
            var num = Number(duration);
            var hours = num / 60;
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            var fhours, fminutes;
            if (rhours < 10) {
              fhours = String('0' + rhours);
            } else {
              fhours = String(rhours);
            }
            if (rminutes < 10) {
              fminutes = String('0' + rminutes);
            } else {
              fminutes = String(rminutes);
            }
            temp = {
              id: i,
              roundduration: fhours + ':' + fminutes + ':00',
              leaveRule: tempObj.roundmap[i].bidleavereason,
              bidroundid: '',
              bidschref: '',
            };
            const roundstart = this.sameTimeForAll
              ? this.setUpBidParametersForm.value.SBP_start_time
              : tempObj.roundmap[i].roundstarttime;
            const roundend = this.sameTimeForAll
              ? this.setUpBidParametersForm.value.SBP_end_time
              : tempObj.roundmap[i].roundendttime;
            temp = {
              ...temp,
              roundstart: roundstart,
              roundend: roundend,
            };
            tempArr.push(temp);
          }
          this.totalEmp = this.bidSchedule.employeemap.length;
          this.allRoundData.setValue(tempArr);
        }

        this.allRoundData.controls.forEach((control, index) => {
          control.patchValue({
            roundstart: tempObj.roundmap[index].actual_bidround_start_time,
            roundend: tempObj.roundmap[index].actual_bidround_end_time,
          });
        });
      } else {
        this.checkComputedButton = false;
      }
      if (this.localData.getItem('roundsChangeData')) {
        let val = JSON.parse(this.localData.getItem('roundsChangeData'));
        this.roundsChangeData = JSON.parse(
          this.localData.getItem('roundsChangeData')
        );
        this.isComputingFirstTime = this.roundsChangeData.reduce(
          (accumulator, currentValue) => {
            return accumulator && !currentValue;
          },
          true
        );
      }
      this.totalRequiredROunds = this.roundListForm.value.allRoundData.length;
      if (this.totalRequiredROunds > 0) {
        this.newOnChange();
      }
    }
    switch (tempObj.bidroundoption) {
      case 'SAME':
        this.setSameForAll(true);
        break;
      case 'DIFFERENT':
        this.setDifferentTimeforAll(true);
        break;
      case 'ANY':
        this.setNoStartEndTime(true);
        break;
    }
    if (this.allTimeZone.length < 1) {
      this.allTimeZone.push({ location: 'US/Eastern', acronym: 'EST' });
      this.setUpBidParametersForm.controls.SBP_timeZone.setValue('US/Eastern');
    }
    this.cdref.detectChanges();
  }
  getTimeZone() {
    this.timezoneSer.getAllTimeZone().subscribe(
      (res) => {
        this.allTimeZone = res;

        if (this.allTimeZone.length < 1) {
          this.allTimeZone.push({ location: 'US/Eastern', acronym: 'EST' });
          this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
            'US/Eastern'
          );
        } else {
          if (this.editBidSchedule == true) {
            var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
            if (tempObj.timezone != '') {
              this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                tempObj.timezone
              );
            } else {
              if (this.allTimeZone.length < 1) {
                this.allTimeZone.push({
                  location: 'US/Eastern',
                  acronym: 'EST',
                });
              }
              this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                'US/Eastern'
              );
            }
          } else {
            var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
            if (tempObj.timezone != '') {
              this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                tempObj.timezone
              );
            } else {
              if (this.allTimeZone.length < 1) {
                this.allTimeZone.push({
                  location: 'US/Eastern',
                  acronym: 'EST',
                });
              }

              this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
                'US/Eastern'
              );
            }
          }
        }
        this.next();
      },
      (err) => {
        console.log(err);
        (this.allTimeZone = []),
          this.allTimeZone.push({ location: 'US/Eastern', acronym: 'EST' });
        this.setUpBidParametersForm.controls.SBP_timeZone.setValue(
          'US/Eastern'
        );
        this.next();
      },
      () => {
        this.compareChange();
      }
    );
  }
  compareChange() {
    const bid_round_data = this.all_bid_round_data;
    var temp;
    var tempArr = [];
    let tempObj;
    if (this.editBidSchedule) {
      let storedData = JSON.parse(
        this.localData.getItem('editBidSchedule')
      ).roundmap;
      let all_bid_round_data = [];
      for (var j = 0; j < storedData.length; j++) {
        all_bid_round_data.push({
          bidroundstartdate: storedData[j].roundstartdate,
          bid_duration: storedData[j].roundduration,
          daily_starttime: storedData[j].roundstarttime,
          daily_endttime: storedData[j].roundendttime,
          bidroundenddate: storedData[j].roundenddate,
          bidleavereason: storedData[j].bidleavereason,
          useridref: this.user_data.id,
          bidschref: storedData[j].bidschref,
          bidroundid: storedData[j].bidroundid,
          startTime: storedData[j].actual_bidround_start_time,
          endTime: storedData[j].actual_bidround_end_time,
          roundsavestatus: 1,
        });
      }
      this.isSaved = isEqual(
        omit(all_bid_round_data, ['bidroundid']),
        omit(this.all_bid_round_data, ['bidroundid'])
      );
    } else {
      tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
      var tempNewObj;
      if (tempObj != null) {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: '',
            bidschref: '',
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endttime,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      } else {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: '',
            bidschref: '',
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endtime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      }
      let prevState = tempObj?.roundmap;
      if (prevState) {
        delete prevState?.bidroundid;
        delete temp.bidroundid;
      }
      if (temp.length && prevState.length) {
        this.isSaved = isEqual(
          omit(temp, ['bidroundid']),
          omit(prevState, ['bidroundid'])
        );
      }
    }
  }
  findMiddle(roundstart, roundend) {
    // Parse the hours and minutes from the time strings

    const startParts = roundstart.split(':');
    const endParts = roundend.split(':');

    const startHours = parseInt(startParts[0], 10);
    const startMinutes = parseInt(startParts[1], 10);
    const endHours = parseInt(endParts[0], 10);
    const endMinutes = parseInt(endParts[1], 10);

    // Calculate the average hours and minutes
    const totalMinutes =
      (startHours * 60 + startMinutes + endHours * 60 + endMinutes) / 2;
    const middleHours = Math.floor(totalMinutes / 60);
    const middleMinutes = totalMinutes % 60;

    // Format the middle time as a string (e.g. "12:30")
    return `${middleHours.toString().padStart(2, '0')}:${middleMinutes
      .toString()
      .padStart(2, '0')}`;
  }
  onChangeTimeZone() {}
  newRound(): FormGroup {
     return this.fb.group({
      id: new FormControl(),
      roundduration: new FormControl(),
      leaveRule: new FormControl(),
      bidroundid: new FormControl(),
      bidschref: new FormControl(),
      roundstart: new FormControl({ disabled: this.sameTimeForAll }),
      roundend: new FormControl({ disabled: this.sameTimeForAll }),
    });
  }

  get allRoundData(): FormArray {
    return this.roundListForm.get('allRoundData') as FormArray;
  }
  get newid() {
    return this.setUpBidParametersForm.get('newid');
  }
  get SBP_start_date() {
    return this.setUpBidParametersForm.get('SBP_start_date');
  }
  get SBP_timeZone() {
    return this.setUpBidParametersForm.get('SBP_timeZone');
  }
  get checkIncludeExclude() {
    return this.setUpBidParametersForm.get('checkIncludeExclude');
  }
  get checkIncludeIntervals() {
    return this.setUpBidParametersForm.get('checkIncludeIntervals');
  }
  get intervalDuration() {
    return this.setUpBidParametersForm.get('intervalDuration');
  }
  get SBP_start_time() {
    return this.setUpBidParametersForm.get('SBP_start_time');
  }

  get SBP_end_time() {
    return this.setUpBidParametersForm.get('SBP_end_time');
  }
  get SBP_bidding_duration() {
    return this.setUpBidParametersForm.get('SBP_bidding_duration');
  }
  get SBP_leave_selection_rules() {
    return this.setUpBidParametersForm.get('SBP_leave_selection_rules');
  }
  get intervalStart() {
    return this.setUpBidParametersForm.get('intervalStart');
  }

  scheduleShiftLine() {}
  async submit(data) {}

  add(data) {
    var startDate, endDate, startTime, endTime, duration, leaveRule;
    startDate = this.setUpBidParametersForm.value.SBP_start_date;
    startTime = this.setUpBidParametersForm.value.SBP_start_time;
    endTime = this.setUpBidParametersForm.value.SBP_end_time;
    duration = this.setUpBidParametersForm.value.SBP_bidding_duration;
    leaveRule = this.setUpBidParametersForm.value.SBP_leave_selection_rules;
    var start = startTime.split(':');
    var end = endTime.split(':');
    var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
    var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = end_Date.getTime() - start_Date.getTime();
    var minutes = Math.floor(diff / 1000 / 60);

    var duration_1 = duration.split(':');
    var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
    var diffDur = duration_1[1];
    minutes = Number(minutes) + Number(diffDur);
    var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
    var totalRequiredDaysForAllEmp =
      Number(totalRequiredMInsForAllEmp) / minutes;
    var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);

    var finalEndDate = new Date(
      new Date(startDate).setDate(
        new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
      )
    );

    var bid_round_data = {
      bidschedulenameref: this.currentBidScheduleName,
      bidroundstartdate: new Date(startDate),
      bid_duration: duration,
      daily_starttime: this.sameTimeForAll
        ? startTime
        : this.allRoundData.at(i).get('roundstart').value,
      daily_endttime: this.sameTimeForAll
        ? endTime
        : this.allRoundData.at(i).get('roundend').value,
      bidroundenddate: finalEndDate,
      bidleavereason: leaveRule,
      useridref: this.user_data.id,
      roundsavestatus: 1,
    };
    var minDate,
      current_start_Date,
      differentTime,
      chc,
      count = 0;
    var maxDate, current_end_Date, differentDays;

    if (this.startDateForUpdateBidRound !== undefined) {
      if (
        startDate.getFullYear() ===
          this.startDateForUpdateBidRound.getFullYear() &&
        startDate.getMonth() === this.startDateForUpdateBidRound.getMonth() &&
        startDate.getDate() === this.startDateForUpdateBidRound.getDate()
      ) {
        this.dateValidation = false;
      }
    } else {
      var sDate, eDate;
      for (var i = 0; i < this.all_SBP_rounds.length; i++) {
        sDate = this.all_SBP_rounds[i].bidroundstartdate.split('-');
        eDate = this.all_SBP_rounds[i].bidroundenddate.split('-');
        minDate = new Date(sDate[0], Number(sDate[1]) + -+1, sDate[2], 0, 0, 0);
        maxDate = new Date(eDate[0], Number(eDate[1]) + -+1, eDate[2], 0, 0, 0);
        differentTime = Math.abs(maxDate - minDate);
        current_start_Date = new Date(bid_round_data.bidroundstartdate);
        current_end_Date = new Date(bid_round_data.bidroundenddate);
        if (current_end_Date >= minDate && current_start_Date <= maxDate) {
          this.dateValidation = true;
        } else if (
          current_end_Date <= minDate &&
          current_start_Date >= maxDate
        ) {
          this.dateValidation = true;
        } else if (
          current_start_Date >= minDate &&
          current_end_Date <= maxDate
        ) {
          this.dateValidation = true;
        } else if (
          current_start_Date <= minDate &&
          current_end_Date >= maxDate
        ) {
          this.dateValidation = true;
        }
      }
    }
    if (!this.dateValidation) {
      this.addBidRound(bid_round_data);

      this.getMaxDate();
      return this.ngOnInit();
    }
  }

  changeIntervalDuration() {
    this.onIntervalTimeChange();
  }

  addBidRound(bid_round_data) {
    var check = true;
    bid_round_data = this.all_bid_round_data;
    var temp;
    var tempArr = [];
    if (this.editBidSchedule) {
      var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
      var tempNewObj;
      if (tempObj != null) {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: bid_round_data[i].bidroundid,
            bidschref: bid_round_data[i].bidschref,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endttime,
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      } else {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: bid_round_data[i].bidroundid,
            bidschref: bid_round_data[i].bidschref,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endttime,
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      }
      check = false;
    } else {
      var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
      var tempNewObj;
      if (tempObj != null) {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: '',
            bidschref: '',
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endttime,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      } else {
        for (var i = 0; i < bid_round_data.length; i++) {
          temp = {
            bidroundid: '',
            bidschref: '',
            actual_bidround_start_time: bid_round_data[i].startTime,
            actual_bidround_end_time: bid_round_data[i].endTime,
            roundduration: bid_round_data[i].bid_duration,
            roundstartdate: String(
              bid_round_data[i].bidroundstartdate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundstartdate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundstartdate.getDate()
            ),
            roundenddate: String(
              bid_round_data[i].bidroundenddate.getFullYear() +
                '-' +
                (bid_round_data[i].bidroundenddate.getMonth() + +(+1)) +
                '-' +
                bid_round_data[i].bidroundenddate.getDate()
            ),
            roundstarttime: bid_round_data[i].daily_starttime,
            roundendttime: bid_round_data[i].daily_endtime,
            bidleavereason: bid_round_data[i].bidleavereason,
            roundseq_id: i + +(+1),
          };
          tempArr.push(temp);
        }
        temp = tempArr;
      }
      check = false;
    }
    var finalArr = [];
    if (this.editBidSchedule) {
      if (tempObj != null) {
        if (tempArr.length > 0) {
          for (var i = 0; i < tempArr.length; i++) {
            if (tempObj.roundmap.length > i) {
              temp = {
                bidroundid: tempObj.roundmap[i].bidroundid,
                bidschref: this.bidScheduleId,
                roundduration: tempArr[i].roundduration,
                roundstartdate: String(tempArr[i].roundstartdate),
                roundenddate: String(tempArr[i].roundenddate),
                hasinterval:
                  this.setUpBidParametersForm.value.checkIncludeIntervals,
                intervalduration: this.setUpBidParametersForm.value
                  .checkIncludeIntervals
                  ? this.setUpBidParametersForm.value.intervalDuration
                  : null,
                intervalstarttime: this.setUpBidParametersForm.value
                  .checkIncludeIntervals
                  ? this.setUpBidParametersForm.value.intervalStart
                  : null,
                bidroundoption: this.sameTimeForAll
                  ? 'SAME'
                  : !this.noTimeForAny
                  ? 'DIFFERENT'
                  : 'ANY',
                bidleavereason: tempArr[i].bidleavereason,
                roundstarttime: tempArr[i].roundstarttime,
                roundendttime: tempArr[i].roundendttime,
                actual_bidround_start_time:
                  tempArr[i].actual_bidround_start_time,
                actual_bidround_end_time: tempArr[i].actual_bidround_end_time,
                roundseq_id: i + 1,
              };
            } else {
              temp = {
                bidroundid: '',
                bidschref: this.bidScheduleId,
                roundduration: tempArr[i].roundduration,
                roundstartdate: String(tempArr[i].roundstartdate),
                roundenddate: String(tempArr[i].roundenddate),
                hasinterval:
                  this.setUpBidParametersForm.value.checkIncludeIntervals,
                intervalduration: this.setUpBidParametersForm.value
                  .checkIncludeIntervals
                  ? this.setUpBidParametersForm.value.intervalDuration
                  : null,
                intervalstarttime: this.setUpBidParametersForm.value
                  .checkIncludeIntervals
                  ? this.setUpBidParametersForm.value.intervalStart
                  : null,
                bidroundoption: this.sameTimeForAll
                  ? 'SAME'
                  : !this.noTimeForAny
                  ? 'DIFFERENT'
                  : 'ANY',
                bidleavereason: tempArr[i].bidleavereason,
                roundstarttime: tempArr[i].roundstarttime,
                roundendttime: tempArr[i].roundendttime,
                actual_bidround_start_time:
                  tempArr[i].actual_bidround_start_time,
                actual_bidround_end_time: tempArr[i].actual_bidround_end_time,
                roundseq_id: i + 1,
              };
            }
            finalArr.push(temp);
          }
        }
      }
      temp = finalArr;
    }
    var tempObj, tempNewObj;
    if (this.editBidSchedule == true) {
      if (tempObj == null) {
        tempNewObj = {
          bidschename: null,
          bidschid: this.bidScheduleId,
          bidmanagerid: this.user_data.id,
          bidschstartdate: null,
          timezone: this.setUpBidParametersForm.value.SBP_timeZone,
          bidschenddate: null,
          weekendstatus: this.setUpBidParametersForm.value.checkIncludeExclude,
          schedulesavestatus: 0,
          leavesavestatus: 0,
          roundsavestatus: 0,
          hasinterval: this.setUpBidParametersForm.value.checkIncludeIntervals,
          intervalduration: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalDuration
            : null,
          intervalstarttime: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalStart
            : null,
          bidroundoption: this.sameTimeForAll
            ? 'SAME'
            : !this.noTimeForAny
            ? 'DIFFERENT'
            : 'ANY',
          shiftdefmap: [],
          employeemap: [],
          leavemap: [],
          roundmap: temp,
        };
      } else {
        tempNewObj = {
          bidschid: this.bidScheduleId,
          bidschename: tempObj.bidschename,
          bidmanagerid: this.user_data.id,
          timezone: this.setUpBidParametersForm.value.SBP_timeZone,
          weekendstatus: this.setUpBidParametersForm.value.checkIncludeExclude,
          hasinterval: this.setUpBidParametersForm.value.checkIncludeIntervals,
          intervalduration: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalDuration
            : null,
          intervalstarttime: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalStart
            : null,
          bidroundoption: this.sameTimeForAll
            ? 'SAME'
            : !this.noTimeForAny
            ? 'DIFFERENT'
            : 'ANY',
          bidschstartdate: tempObj.bidschstartdate,
          bidschenddate: tempObj.bidschenddate,
          schedulesavestatus: tempObj.schedulesavestatus,
          leavesavestatus: tempObj.leavesavestatus,
          roundsavestatus: tempObj.roundsavestatus,
          shiftdefmap: tempObj.shiftdefmap,
          employeemap: tempObj.employeemap,
          leavemap: tempObj.leavemap,
          roundmap: temp,
        };
      }
    } else {
      if (tempObj == null) {
        tempNewObj = {
          bidschename: null,
          bidmanagerid: this.user_data.id,
          bidschstartdate: null,
          timezone: this.setUpBidParametersForm.value.SBP_timeZone,
          bidschenddate: null,
          weekendstatus: this.setUpBidParametersForm.value.checkIncludeExclude,
          hasinterval: this.setUpBidParametersForm.value.checkIncludeIntervals,
          intervalduration: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalDuration
            : null,
          intervalstarttime: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalStart
            : null,
          bidroundoption: this.sameTimeForAll
            ? 'SAME'
            : !this.noTimeForAny
            ? 'DIFFERENT'
            : 'ANY',
          schedulesavestatus: 0,
          leavesavestatus: 0,
          roundsavestatus: 0,
          shiftdefmap: [],
          employeemap: [],
          leavemap: [],
          roundmap: temp,
        };
      } else {
        tempNewObj = {
          bidschename: tempObj.bidschename,
          bidmanagerid: this.user_data.id,
          timezone: this.setUpBidParametersForm.value.SBP_timeZone,
          weekendstatus: this.setUpBidParametersForm.value.checkIncludeExclude,
          hasinterval: this.setUpBidParametersForm.value.checkIncludeIntervals,
          intervalduration: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalDuration
            : null,
          intervalstarttime: this.setUpBidParametersForm.value
            .checkIncludeIntervals
            ? this.setUpBidParametersForm.value.intervalStart
            : null,
          bidroundoption: this.sameTimeForAll
            ? 'SAME'
            : !this.noTimeForAny
            ? 'DIFFERENT'
            : 'ANY',
          bidschstartdate: tempObj.bidschstartdate,
          bidschenddate: tempObj.bidschenddate,
          schedulesavestatus: tempObj.schedulesavestatus,
          leavesavestatus: tempObj.leavesavestatus,
          roundsavestatus: tempObj.roundsavestatus,
          shiftdefmap: tempObj.shiftdefmap,
          employeemap: tempObj.employeemap,
          leavemap: tempObj.leavemap,
          roundmap: temp,
        };
      }
    }
    if (this.editBidSchedule == true) {
      this.localData.setItem('editBidSchedule', JSON.stringify(tempNewObj));
    } else {
      this.localData.setItem('newBidSchedule', JSON.stringify(tempNewObj));
    }
    this.localData.setItem(
      'roundsChangeData',
      JSON.stringify(this.roundsChangeData)
    );
    Swal.fire({
      title: 'Success!',
      html: 'Bid Rounds were saved successfully!',
      icon: 'success',
      showCancelButton: false,
      imageHeight: '250px',
      heightAuto: false,
      confirmButtonColor: '#ff6700',
      timer: 1500,
    }).then(() => {
      if (this.isModal) {
        this.modalCtrl.dismiss({ checkValuechanged: this.checkValuechanged });
      } else {
        this.roundsSelected.emit({ checkValuechanged: this.checkValuechanged });
      }
      this.isSaved = true;
    });
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d?.getMonth() + 1),
      day = '' + d?.getDate(),
      year = d?.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getAllBidRound() {
    this.setUPbidRoundSer.getAllBidRound().subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }
  getAllEmployeeList() {
    if (this.editBidSchedule === true) {
      this.bidSchedule = JSON.parse(this.localData.getItem('editBidSchedule'));
      this.allEmployee = [];
      this.vacation = [];
      this.defaultVacation = [];
      if (this.bidSchedule.employeemap.length > 0) {
        for (var i = 0; i < this.bidSchedule.employeemap.length; i++) {
          this.getEmployeeList(this.bidSchedule.employeemap[i].empidref, i);
        }
      }
    } else {
      this.bidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));

      this.allEmployee = [];
      this.vacation = [];
      this.defaultVacation = [];
      if (this.bidSchedule.employeemap.length > 0) {
        for (var i = 0; i < this.bidSchedule.employeemap.length; i++) {
          this.getEmployeeList(this.bidSchedule.employeemap[i], i);
        }
      }
    }
  }
  change() {
    if (this.defaultMAxLeave > 0) {
      this.dateValidation = false;
      this.checkComputedButton = true;
      this.end = this.end_date + 'T' + this.end_time;
      this.start = this.start_date + 'T' + this.start_time;
      if (
        this.end_date !== '' &&
        this.end_time !== '' &&
        this.start_date !== '' &&
        this.start_time !== ''
      ) {
        this.diff();
        if (this.totalBidRounds > 0) {
          this.onChange();
        }
      }
    }
  }
  startDate(date) {
    this.start_date = date.substring(0, date.indexOf('T'));
  }
  startTime(date) {
    this.start_time = date.substring(date.indexOf('T') + 1);
  }
  endTime(date) {
    this.end_time = date.substring(date.indexOf('T') + 1);
  }
  diff() {
    var fromTime = new Date(this.start);
    var toTime = new Date(this.end);
    var differenceTravel = toTime.getTime() - fromTime.getTime();
    var seconds = Math.floor(differenceTravel / 1000);
    var mins = seconds / 60;
    this.bid_duration = mins;
  }
  expand(index) {
    if (this.expand_id == index) {
      this.expand_id = null;
    } else {
      this.expand_id = index;
    }
  }
  expandlist(i) {
    if (this.expand_id == i) {
      return 'expand';
    } else {
      return 'default-expand';
    }
  }
  getMaxDate() {
    var tempArr = [];
    for (var i = 0; i < this.all_SBP_rounds.length; i++) {
      tempArr.push(
        new Date(
          new Date(this.all_SBP_rounds[i].bidroundstartdate).setDate(
            new Date(this.all_SBP_rounds[i].bidroundstartdate).getDate() + 1
          )
        )
      );
      tempArr.push(
        new Date(
          new Date(this.all_SBP_rounds[i].bidroundenddate).setDate(
            new Date(this.all_SBP_rounds[i].bidroundenddate).getDate() + 1
          )
        )
      );
    }
    var maxDate = new Date(Math.max.apply(null, tempArr));
    this.minDateForBidRound = new Date(
      new Date(maxDate).setDate(new Date(maxDate).getDate() + 1)
    );
  }
  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    var updatedtime = hours + ':' + minutes + ':00';
    return updatedtime;
  }

  totalEmployees() {
    this.allShceduleBasedOnBidScheduleName();
  }
  allShceduleBasedOnBidScheduleName() {}
  convertArrayData() {
    var tempArr = new Array();
    tempArr = this.shiftLinesSchedule;

    for (var i = 0; i < tempArr.length; i++) {
      for (var j = 0; j < this.bidSchedule.shiftdefmap.length; j++) {
        if (
          tempArr[i].sh_schedule_id ===
          this.bidSchedule.shiftdefmap[j].shiftdefref
        ) {
          // this.largestNumber(tempArr[i].schild.length)
        }
      }
    }
  }
  largestNumber(arr) {
    this.all_final_data_for_total_emp.push(arr);
    return (this.totalEmp = Math.max(...this.all_final_data_for_total_emp));
  }
  close() {
    this.modalCtrl.dismiss({ checkValuechanged: this.checkValuechanged });
  }
  tConvert(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
  changeDuration() {
    this.checkComputedButton = false;
    this.onChange();
  }

  computeRoundData(){
    this.getAllEmployee(()=>{
      this.checkNewCompute();
    })
  }

  async checkNewCompute() {
    if (this.totalCreatedVacationHours < this.totalRequiredVacationHours) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message:
          'Total vacation opportunities hours are less than total leave accrued hours. Would you still want to compute the bid rounds?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {},
          },
          {
            text: 'Yes',
            handler: () => {
              this.checkValuechanged = false;
              var startDate = this.setUpBidParametersForm.value.SBP_start_date;
              var startTimme = this.setUpBidParametersForm.value.SBP_start_time;
              if (
                new Date(
                  startDate.getFullYear(),
                  startDate.getMonth(),
                  startDate.getDate(),
                  Number(startTimme.split(':')[0]),
                  Number(startTimme.split(':')[1]),
                  0
                ).getTime() < new Date().getTime()
              ) {
                if (
                  new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate(),
                    0,
                    0,
                    0
                  ).getTime() <
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    0,
                    0,
                    0
                  ).getTime()
                ) {
                  this.checkPastTimeOrDateOne = 'date';
                  this.checkPastTimeOrDateTwo = 'date';
                } else {
                  this.checkPastTimeOrDateOne = 'start time';
                  this.checkPastTimeOrDateTwo = 'time';
                }
                this.checkPastTimeAndDate = true;
              } else {
                this.checkPastTimeAndDate = false;
              }
              this.newCompute();
              this.compareChange();
              this.checkValuechanged = false;
              this.dataComputed.emit();
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.checkValuechanged = false;
      var startDate = this.setUpBidParametersForm.value.SBP_start_date;
      var startTimme = this.setUpBidParametersForm.value.SBP_start_time;
      if (
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          Number(startTimme.split(':')[0]),
          Number(startTimme.split(':')[1]),
          0
        ).getTime() < new Date().getTime()
      ) {
        if (
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0,
            0,
            0
          ).getTime() <
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          ).getTime()
        ) {
          this.checkPastTimeOrDateOne = 'date';
          this.checkPastTimeOrDateTwo = 'date';
        } else {
          this.checkPastTimeOrDateOne = 'start time';
          this.checkPastTimeOrDateTwo = 'time';
        }
        this.checkPastTimeAndDate = true;
      } else {
        this.checkPastTimeAndDate = false;
      }
      this.newCompute();
      this.compareChange();
      this.checkValuechanged = false;
      this.dataComputed.emit();
    }
  }

  newCompute() {
    var startDate, startTime, endTime;
    startDate = this.setUpBidParametersForm.value.SBP_start_date;

    startTime = this.setUpBidParametersForm.value.SBP_start_time;
    endTime = this.setUpBidParametersForm.value.SBP_end_time;
    this.totalEmp = this.bidSchedule.employeemap.length;
    var one, two;

    // var one=0,two=0
    one = this.totalCreatedVacationHours;
    two = this.totalRequiredVacationHours;
    this.totalRequiredROunds = 0;

    this.toalt(one, two);
  }
  getEmployeeList(empId, i) {
    this.getAllEmp.getEmpDataBasedOnEmpId(empId).subscribe(
      (res) => {
        this.allEmployee.push({...res});
        var temp;
        temp = res;
        this.allEmployee = this.allEmployee.sort((a, b) => a.rank - b.rank);
        this.vacation.push(temp.vacation);
        this.defaultVacation.push(temp.vacation);
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  toalt(one, two) {
    var r,
      v,
      re = 0;
    var checkZero = 0;
    r = this.totalCreatedVacationHours;
    v = this.totalRequiredVacationHours;
    if (two < one) {
      re = 0;

      this.totalRequiredROunds++;
      var tempArr = [],
        temp = 0;
      for (var i = 0; i < this.vacation.length; i++) {
        if (this.vacation[i] < 80) {
          temp = this.vacation[i] + -+this.vacation[i];
          one = one + -+this.vacation[i];
          two = two + -+this.vacation[i];
        } else {
          temp = this.vacation[i] + -+80;
          if (temp > 0) {
            temp = temp;
            one = one + -+80;
            two = two + -+80;
          } else {
            temp = 0;
          }
        }

        if (temp > 0 && this.vacation[i] >= 0) {
          if (temp > 0) {
            checkZero++;
          }
          tempArr.push(temp);
        } else {
          tempArr.push(0);
        }
      }

      this.vacation = tempArr;

      this.second(one, two, checkZero);
    } else {
      re = 0;

      this.totalRequiredROunds++;
      var updatedtotalCreatedVacationHours = 0,
        updatedtotalRequiredVacationHours = 0;
      (updatedtotalCreatedVacationHours = one),
        (updatedtotalRequiredVacationHours = two);
      var tempArr = [],
        temp = 0,
        checkZero = 0;
      for (var i = 0; i < this.vacation.length; i++) {
        if (this.vacation[i] < 80) {
          temp = this.vacation[i] + -+this.vacation[i];
          one = one + -+this.vacation[i];
          two = two + -+this.vacation[i];
        } else {
          temp = this.vacation[i] + -+80;
          if (temp > 0) {
            temp = temp;
            one = one + -+80;
            two = two + -+80;
          } else {
            temp = 0;
          }
        }

        if (temp > 0 && this.vacation[i] >= 0) {
          if (temp > 0) {
            checkZero++;
          }
          tempArr.push(temp);
        } else {
          tempArr.push(0);
        }
      }

      this.vacation = tempArr;

      updatedtotalCreatedVacationHours = one;
      updatedtotalRequiredVacationHours = two;

      if (
        80 * this.totalEmp < this.totalCreatedVacationHours ||
        checkZero > 0
      ) {
        this.second(one, two, checkZero);
      } else {
        if (this.totalCreatedVacationHours > 0) {
          // this.totalRequiredROunds++
          this.roundForm();
        }
      }
    }
  }
  changeDateF(event) {
    const eventTarget = event.target;
  }
  second(one, two, oldValue) {
    // let i = 0;
    var checkZero = 0;
    var updatedtotalCreatedVacationHours = 0,
      updatedtotalRequiredVacationHours = 0;
    (updatedtotalCreatedVacationHours = one),
      (updatedtotalRequiredVacationHours = two);
    // this.totalRequiredROunds++

    var totalRequiredHours = 0;
    checkZero = oldValue;
    var remainghours = 0;

    do {
      totalRequiredHours = 40 * this.totalEmp;
      var tempArr = [],
        temp = 0;
      if (totalRequiredHours < one && checkZero > 0) {
        remainghours = one;
        checkZero = 0;
        if (totalRequiredHours < one) {
          for (var i = 0; i < this.vacation.length; i++) {
            if (this.vacation[i] < 40) {
              temp = this.vacation[i] + -+this.vacation[i];
              one = one + -+this.vacation[i];
              two = two + -+this.vacation[i];
            } else {
              temp = this.vacation[i] + -+40;
              if (this.vacation[i] > 0) {
                temp = temp;
                one = one + -+40;
                two = two + -+40;
              } else {
                temp = 0;
              }
            }
            if (temp > 0 && this.vacation[i] >= 0) {
              if (temp > 0) {
                checkZero++;
              }
              tempArr.push(temp);
            } else {
              tempArr.push(0);
            }
          }
          this.vacation = tempArr;

          this.vacation = tempArr;
          this.totalRequiredROunds++;

          if (remainghours > 0 && one < 0) {
            this.alertMsg =
              'Round ' +
              this.totalRequiredROunds +
              ' requires ' +
              totalRequiredHours +
              ' hours and available total vacation opportunities are ' +
              remainghours +
              ' hours.';
          }
        }
      } else {
        if (one > 0 && two > 0 && (totalRequiredHours < one || checkZero > 0)) {
          remainghours = one;
          checkZero = 0;
          for (var i = 0; i < this.vacation.length; i++) {
            if (this.vacation[i] < 40) {
              temp = this.vacation[i] + -+this.vacation[i];
              one = one + -+this.vacation[i];
              two = two + -+this.vacation[i];
            } else {
              temp = this.vacation[i] + -+40;
              if (this.vacation[i] > 0) {
                temp = temp;
                one = one + -+40;
                two = two + -+40;
              } else {
                temp = 0;
              }
            }
            if (temp > 0 && this.vacation[i] >= 0) {
              if (temp > 0) {
                checkZero++;
              }
              tempArr.push(temp);
            } else {
              tempArr.push(0);
            }
          }
          this.vacation = tempArr;

          this.vacation = tempArr;
          this.totalRequiredROunds++;

          if (remainghours > 0 && one < 0) {
            this.alertMsg =
              'Round ' +
              this.totalRequiredROunds +
              ' requires ' +
              totalRequiredHours +
              ' hours and available total vacation opportunities are ' +
              remainghours +
              ' hours.';
          }
        } else {
          if (one > 0) {
            this.totalRequiredROunds++;
          }
          checkZero = 0;
        }
      }
    } while (checkZero > 0);
    this.totalRequiredROunds+=this.getAccumulatedRounds();
    this.roundForm();
  }
  newOnChangeLeaveRule() {
    var one, two;
    one = this.totalCreatedVacationHours;
    two = this.totalRequiredVacationHours;
    this.totalRequiredROunds = 0;
    this.newUpdatedTotalRound();
  }
  getHoursBasedOnALeave(lsl) {
    if (lsl == '2 weeks NC') {
      return '80 Hours';
    } else if (lsl == '2 weeks C') {
      return '80 Hours';
    } else if (lsl == '5 days (1 Week) in 7') {
      return '40 Hours';
    } else if (lsl == 'Up to 10 days NC') {
      return '80 Hours';
    } else if (lsl == 'Up to 5 days NC') {
      return '40 Hours';
    } else if (lsl == '1 week') {
      return '40 Hours';
    } else if (lsl == '1 day') {
      return '8 Hours';
    }
  }
  newArray = [];
  newUpdatedTotalRound() {
    var checkZero = 0;
    var tempRoundData = [],
      tempObj;
    tempRoundData = this.roundListForm.value.allRoundData;

    var tempArr = [],
      temp = 0;
    var tempArrVacation = [],
      tempVacation = 0;
    checkZero = 1;
    this.vacation = this.defaultVacation;
    this.totalRequiredROunds = 0;

    var one = 0,
      two = 0,
      totalRequiredHours = 0;
    one = this.totalCreatedVacationHours;
    two = this.totalRequiredVacationHours;

    var t = 0;
    var newArray = [];

    var updatedRoundData = [];

    this.newArray = [];
    this.newArray = new Array(0);

    do {
      if (t < tempRoundData.length) {
        if (
          tempRoundData[t].leaveRule == '1 week' ||
          tempRoundData[t].leaveRule == '5 days (1 Week) in 7' ||
          tempRoundData[t].leaveRule == 'Up to 5 days NC'
        ) {
          totalRequiredHours = 40 * this.totalEmp;
        } else if (
          tempRoundData[t].leaveRule == '2 weeks NC' ||
          tempRoundData[t].leaveRule == '2 weeks C' ||
          tempRoundData[t].leaveRule == 'Up to 10 days NC'
        ) {
          totalRequiredHours = 80 * this.totalEmp;
        } else {
          totalRequiredHours = 8 * this.totalEmp;
        }

        var tempArr = [],
          temp = 0,
          remainghours = 0;
        if (totalRequiredHours < one && checkZero > 0) {
          checkZero = 0;
          if (totalRequiredHours < one) {
            remainghours = one;
            for (var i = 0; i < this.vacation.length; i++) {
              if (
                tempRoundData[t].leaveRule == '1 week' ||
                tempRoundData[t].leaveRule == '5 days (1 Week) in 7' ||
                tempRoundData[t].leaveRule == 'Up to 5 days NC'
              ) {
                if (this.vacation[i] < 40) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+40;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+40;
                    two = two + -+40;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              } else if (
                tempRoundData[t].leaveRule == '2 weeks NC' ||
                tempRoundData[t].leaveRule == '2 weeks C' ||
                tempRoundData[t].leaveRule == 'Up to 10 days NC'
              ) {
                if (this.vacation[i] < 80) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+80;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+80;
                    two = two + -+80;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              } else {
                if (this.vacation[i] < 8) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+8;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+8;
                    two = two + -+8;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              }
            }
            this.vacation = tempArr;

            this.vacation = tempArr;
            this.totalRequiredROunds++;
            if (remainghours > 0 && one < 0) {
              this.alertMsg =
                'Round ' +
                this.totalRequiredROunds +
                ' requires ' +
                totalRequiredHours +
                ' hours and available total vacation opportunities are ' +
                remainghours +
                ' hours.';
            }
          }
        } else {
          if (
            one > 0 &&
            two > 0 &&
            (totalRequiredHours < one || checkZero > 0)
          ) {
            checkZero = 0;
            remainghours = one;
            for (var i = 0; i < this.vacation.length; i++) {
              if (
                tempRoundData[t].leaveRule == '1 week' ||
                tempRoundData[t].leaveRule == '5 days (1 Week) in 7' ||
                tempRoundData[t].leaveRule == 'Up to 5 days NC'
              ) {
                if (this.vacation[i] < 40) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+40;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+40;
                    two = two + -+40;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              } else if (
                tempRoundData[t].leaveRule == '2 weeks NC' ||
                tempRoundData[t].leaveRule == '2 weeks C' ||
                tempRoundData[t].leaveRule == 'Up to 10 days NC'
              ) {
                if (this.vacation[i] < 80) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+80;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+80;
                    two = two + -+80;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              } else {
                if (this.vacation[i] < 8) {
                  temp = this.vacation[i] + -+this.vacation[i];
                  one = one + -+this.vacation[i];
                  two = two + -+this.vacation[i];
                } else {
                  temp = this.vacation[i] + -+8;
                  if (this.vacation[i] > 0) {
                    temp = temp;
                    one = one + -+8;
                    two = two + -+8;
                  } else {
                    temp = 0;
                  }
                }
                if (temp > 0 && this.vacation[i] >= 0) {
                  if (temp > 0) {
                    checkZero++;
                  }
                  tempArr.push(temp);
                } else {
                  tempArr.push(0);
                }
              }
            }
            this.vacation = tempArr;

            this.vacation = tempArr;
            this.totalRequiredROunds++;
            if (remainghours > 0 && one < 0) {
              this.alertMsg =
                'Round ' +
                this.totalRequiredROunds +
                ' requires ' +
                totalRequiredHours +
                ' hours and available total vacation opportunities are ' +
                remainghours +
                ' hours.';
            }
          } else {
            if (one > 0) {
              this.totalRequiredROunds++;
            }
            checkZero = 0;
          }
        }
      } else {
        totalRequiredHours = 40 * this.totalEmp;
        var tempArr = [],
          temp = 0;
        if (totalRequiredHours < one && checkZero > 0) {
          checkZero = 0;
          if (totalRequiredHours < one) {
            for (var i = 0; i < this.vacation.length; i++) {
              if (this.vacation[i] < 40) {
                temp = this.vacation[i] + -+this.vacation[i];
                one = one + -+this.vacation[i];
                two = two + -+this.vacation[i];
              } else {
                temp = this.vacation[i] + -+40;
                if (this.vacation[i] > 0) {
                  temp = temp;
                  one = one + -+40;
                  two = two + -+40;
                } else {
                  temp = 0;
                }
              }
              if (temp > 0 && this.vacation[i] >= 0) {
                if (temp > 0) {
                  checkZero++;
                }
                tempArr.push(temp);
              } else {
                tempArr.push(0);
              }
            }
            this.vacation = tempArr;

            this.vacation = tempArr;
            this.totalRequiredROunds++;
          }
        } else {
          if (
            one > 0 &&
            two > 0 &&
            (totalRequiredHours < one || checkZero > 0)
          ) {
            checkZero = 0;
            for (var i = 0; i < this.vacation.length; i++) {
              if (this.vacation[i] < 40) {
                temp = this.vacation[i] + -+this.vacation[i];
                one = one + -+this.vacation[i];
                two = two + -+this.vacation[i];
              } else {
                temp = this.vacation[i] + -+40;
                if (this.vacation[i] > 0) {
                  temp = temp;
                  one = one + -+40;
                  two = two + -+40;
                } else {
                  temp = 0;
                }
              }
              if (temp > 0 && this.vacation[i] >= 0) {
                if (temp > 0) {
                  checkZero++;
                }
                tempArr.push(temp);
              } else {
                tempArr.push(0);
              }
            }
            this.vacation = tempArr;

            this.vacation = tempArr;
            this.totalRequiredROunds++;
            if (remainghours > 0 && one < 0) {
              this.alertMsg =
                'Round ' +
                this.totalRequiredROunds +
                ' requires ' +
                totalRequiredHours +
                ' hours and available total vacation opportunities are ' +
                remainghours +
                ' hours.';
            }
          } else {
            if (one > 0) {
              this.totalRequiredROunds++;

              // if(remainghours>0  && one<0){

              this.alertMsg =
                'Round ' +
                this.totalRequiredROunds +
                ' requires ' +
                totalRequiredHours +
                ' hours and available total vacation opportunities are ' +
                remainghours +
                ' hours.';
              // }
            }
            checkZero = 0;
          }
        }
      }
      t++;
    } while (checkZero > 0);

    this.newArray = [];
    this.totalRequiredROunds += this.getAccumulatedRounds();
    for (var i = 0; i < this.totalRequiredROunds ; i++) {
      let roundstart, roundend;
      if (i < tempRoundData.length) {
        roundstart =
          !this.isModal && this.sameTimeForAll
            ? this.setUpBidParametersForm.value.SBP_start_time
            : tempRoundData[i].roundstart;
        roundend =
          !this.isModal && this.sameTimeForAll
            ? this.setUpBidParametersForm.value.SBP_end_time
            : tempRoundData[i].roundend;
        tempObj = {
          id: i,
          roundduration: tempRoundData[i].roundduration,
          leaveRule: tempRoundData[i].leaveRule,
          bidroundid: '',
          bidschref: '',
          roundstart: roundstart,
          roundend: roundend,
        };
      } else {
        roundstart =
          !this.isModal && this.sameTimeForAll
            ? this.setUpBidParametersForm.value.SBP_start_time
            : tempRoundData[i].roundstart;
        roundend =
          !this.isModal && this.sameTimeForAll
            ? this.setUpBidParametersForm.value.SBP_end_time
            : tempRoundData[i].roundend;
        tempObj = {
          id: i,
          roundduration: '00:15:00',
          leaveRule: '1 week',
          bidroundid: '',
          bidschref: '',
          roundstart: roundstart,
          roundend: roundend,
        };
      }
      this.newArray.push(tempObj);
    }
    this.totalRequiredROunds++;
    const roundstart =
      !this.isModal && this.sameTimeForAll
        ? this.setUpBidParametersForm.value.SBP_start_time
        : tempRoundData[i].roundstart;
    const roundend =
      !this.isModal && this.sameTimeForAll
        ? this.setUpBidParametersForm.value.SBP_end_time
        : tempRoundData[i].roundend;
    tempObj = {
      id: this.newArray.length,
      roundduration: '00:15:00',
      leaveRule: '1 week',
      bidroundid: '',
      bidschref: '',
      roundstart: roundstart,
      roundend: roundend,
    };
    this.newArray.push(tempObj);

    this.roundListForm = this.fb.group({
      allRoundData: this.fb.array([]),
    });
    //
    for (var i = 0; i < this.newArray.length; i++) {
      this.allRoundData.push(this.newRound());
    }
    this.allRoundData.setValue(this.newArray);
    this.newArray = [];

    this.createBidROundData();
    this.toastAutoCompute();
  }
  updatedroundForm() {
    var tempRoundData = [],
      updatedRoundData = [],
      tempObj;
    tempRoundData = this.roundListForm.value.allRoundData;
  }

  roundForm() {
    var temp,
      tempArr = [];
    this.totalRequiredROunds++;

    this.roundListForm = this.fb.group({
      allRoundData: this.fb.array([]),
    });
    for (
      var i = 0;
      i < this.totalRequiredROunds;
      i++
    ) {
      this.allRoundData.push(this.newRound());
      if (i == 0) {
        temp = {
          id: i,
          roundduration: '00:30:00',
          leaveRule: '2 weeks NC',
          bidroundid: '',
          bidschref: '',
        };
      } else {
        temp = {
          id: i,
          roundduration: '00:15:00',
          leaveRule: '1 week',
          bidroundid: '',
          bidschref: '',
        };
      }
      const roundstart = this.sameTimeForAll
        ? this.setUpBidParametersForm.value.SBP_start_time
        : this.noTimeForAny
        ? '00:00:00'
        : '08:00:00';
      const roundend = this.sameTimeForAll
        ? this.setUpBidParametersForm.value.SBP_end_time
        : this.noTimeForAny
        ? '00:00:00'
        : '08:00:00';
      temp = {
        ...temp,
        roundstart: roundstart,
        roundend: roundend,
      };
      tempArr.push(temp);
    }

    this.totalBidRounds = this.totalRequiredROunds;
    this.allRoundData.setValue(tempArr);

    this.createBidROundData();
  }
  deleteManaualRound(index: number) {
    this.allRoundData.controls.splice(index, 1);
    this.totalRequiredROunds--;
    this.newOnChange();
  }
  checkPastTimeAndDate = false;
  checkPastTimeOrDateOne = 'date or start time';
  checkPastTimeOrDateTwo = 'date or time';
  bidShculeTimeZone = 'US/Eastern';

  isValidInterval(
    intervalTime: string,
    roundStartWindow: string,
    roundEndWindow: string,
    intervalDuration: number
  ): [boolean, string] {
    const intervalStart = moment(intervalTime, 'H:mm');
    const roundStart = moment(roundStartWindow, 'H:mm');
    const roundEnd = moment(roundEndWindow, 'H:mm');

    // Check if interval start time is before round start time
    if (intervalStart.isBefore(roundStart)) {
      return [false, 'Interval start time cannot be before round start time'];
    }

    // Check if interval start time is after round end time
    if (intervalStart.isAfter(roundEnd)) {
      return [false, 'Interval start time cannot be after round end time'];
    }

    // Check if interval start time is at the boundary of round start or end time
    if (intervalStart.isSame(roundStart) || intervalStart.isSame(roundEnd)) {
      return [
        false,
        'Interval start time cannot be at the boundary of round start or end time',
      ];
    }

    // Check if interval start time is between round start and end time
    if (!intervalStart.isBetween(roundStart, roundEnd, 'minute', '[)')) {
      return [
        false,
        'Interval start time should be between round start and end time',
      ];
    }

    // Check if the interval end time is valid as well
    const intervalEnd = intervalStart.clone().add(intervalDuration, 'minutes');
    if (intervalEnd.isAfter(roundEnd)) {
      return [false, 'Interval end time cannot be after round end time'];
    }
    return [true, ''];
  }
  validateIntervalStartTime(): [boolean, string] {
    const intervalTime = this.intervalStart.value;
    const intervalDuration = Number(this.intervalDuration.value);
    if (this.sameTimeForAll) {
      const roundStartWindow = this.setUpBidParametersForm.value.SBP_start_time;
      const roundEndWindow = this.setUpBidParametersForm.value.SBP_end_time;
      return this.isValidInterval(
        intervalTime,
        roundStartWindow,
        roundEndWindow,
        intervalDuration
      );
    } else if (!this.noTimeForAny) {
      for (let i = 0; this.allRoundData.length; i++) {
        const roundStartWindow = this.allRoundData
          .at(i)
          .get('roundstart').value;
        const roundEndWindow = this.allRoundData.at(i).get('roundend').value;
        if (roundStartWindow !== roundEndWindow && this.roundsChangeData[i]) {
          const isValid = this.isValidInterval(
            intervalTime,
            roundStartWindow,
            roundEndWindow,
            intervalDuration
          );
          if (!isValid[0]) {
            isValid[1] += ` of any round.`;
            return isValid;
          }
        }
      }
    }
    return [true, ''];
  }

  onIntervalFocus() {
    this.preIntervalTime = this.intervalStart.value ?? '12:00:00';
  }
  async onIntervalTimeChange() {
    const [isValid, errorMessage] = this.validateIntervalStartTime();
    this.isIntervalValid = isValid;
    this.intervalValidation = errorMessage;
    if (!isValid && this.displayIntervalAlert) {
      this.displayIntervalAlert = false;
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: errorMessage,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.displayIntervalAlert = true;
            },
          },
        ],
      });
      await alert.present();

      this.intervalStart.setValue(this.preIntervalTime);
    } else {
      this.newOnChange();
    }
  }
  async onTimeChange(i: number, type: string) {
    if (!this.sameTimeForAll && !this.noTimeForAny) {
      if (this.displayTimeAlert) {
        this.displayTimeAlert = false;
        const alert = await this.alertController.create({
          header: 'Confirm',
          message: `Updating the ${type} time may affect the start and end dates of the current and subsequent rounds. Are you sure you want to continue?`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                if (type === 'start') {
                  this.allRoundData.controls[i].patchValue({
                    roundstart: this.preTimeValue,
                  });
                } else if (type === 'end') {
                  this.allRoundData.controls[i].patchValue({
                    roundend: this.preTimeValue,
                  });
                }
                this.displayTimeAlert = true;
                return false;
              },
            },
            {
              text: 'Yes',
              handler: () => {
                this.displayTimeAlert = true;
                this.isComputingFirstTime = false;
                this.roundsChangeData[i] = true;
                this.newOnChange();
              },
            },
          ],
        });
        await alert.present();
      } else {
        this.newOnChange();
      }
    } else {
      this.newOnChange();
    }
  }
  getRoundLimit(type: string): string {
    if (!this.sameTimeForAll && !this.noTimeForAny) {
      return this.allRoundData.at(0)?.get(type)?.value
        ? this.allRoundData.at(0).get(type).value
        : '08:00:00';
    } else {
      return this.allRoundData.at(0)?.get(type)?.value
        ? this.allRoundData.at(0).get(type).value
        : '00:00:00';
    }
  }
  newOnChange() {
    const startDate = this.setUpBidParametersForm.value.SBP_start_date;
    const startTimme = this.sameTimeForAll
      ? this.setUpBidParametersForm.value.SBP_start_time
      : this.getRoundLimit('roundstart');
    const endTime = this.sameTimeForAll
      ? this.setUpBidParametersForm.value.SBP_end_time
      : this.getRoundLimit('roundend');
    const startDateTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(startTimme.split(':')[0]),
      Number(startTimme.split(':')[1]),
      0
    );

    const endDateTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(endTime.split(':')[0]),
      Number(endTime.split(':')[1]),
      0
    );

    let today, date, invdate, diff;
    date = new Date();
    invdate = new Date(
      date.toLocaleString('en-US', {
        timeZone: this.setUpBidParametersForm.value.SBP_timeZone,
      })
    );
    diff = date.getTime() - invdate.getTime();
    today = new Date(date.getTime() - diff);
    if (startDateTime.getTime() < today.getTime()) {
      if (
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          0,
          0,
          0
        ).getTime() <
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ).getTime()
      ) {
        this.checkPastTimeOrDateOne = 'date';
        this.checkPastTimeOrDateTwo = 'date';
      } else {
        this.checkPastTimeOrDateOne = 'start time';
        this.checkPastTimeOrDateTwo = 'time';
      }
      this.checkPastTimeAndDate = true;
    } else {
      this.checkPastTimeAndDate = false;
    }
    if (startDateTime.getTime() > endDateTime.getTime()) {
      this.isRangeValid = false;
    } else {
      this.isRangeValid = true;
    }

    if (!this.isModal && this.sameTimeForAll) {
      const roundstart = this.setUpBidParametersForm.value.SBP_start_time;
      const roundend = this.setUpBidParametersForm.value.SBP_end_time;
      this.updateRoundData(roundstart, roundend, false);
    }
    if (this.totalRequiredROunds > 0) {
      this.createBidROundData();
      const [isValid, errorMessage] = this.validateIntervalStartTime();
      this.isIntervalValid = isValid;
      this.intervalValidation = errorMessage;
      this.toastAutoCompute();
      this.compareChange();
    }
  }
  setSameForAll(hasSavedData: Boolean = false) {
    this.sameTimeForAll = true;
    this.noTimeForAny = false;
    this.displayTimeAlert = false;
    if (!hasSavedData) {
      const roundstart = this.setUpBidParametersForm.value.SBP_start_time;
      const roundend = this.setUpBidParametersForm.value.SBP_end_time;
      this.updateRoundData(roundstart, roundend, !this.checkComputedButton);
    }
  }
  setDifferentTimeforAll(hasSavedData: Boolean = false) {
    this.sameTimeForAll = false;
    this.noTimeForAny = false;
    if (!this.isModal && !hasSavedData) {
      const roundstart = '08:00:00';
      const roundend = '08:00:00';
      this.updateRoundData(roundstart, roundend, !this.checkComputedButton);
      this.displayTimeAlert = true;
    }
  }
  setNoStartEndTime(hasSavedData: Boolean = false) {
    this.noTimeForAny = true;
    this.sameTimeForAll = false;
    if (!this.isModal && !hasSavedData) {
      this.displayTimeAlert = false;
      const roundstart = '00:00:00';
      const roundend = '00:00:00';
      this.updateRoundData(roundstart, roundend, !this.checkComputedButton);
    }
  }
  updateRoundData(
    roundstart: string,
    roundend: string,
    recompute: boolean = true
  ) {
    this.allRoundData.controls.forEach((control, index) => {
      control.patchValue({
        roundstart: roundstart,
        roundend: roundend,
      });
    });
    recompute && this.newOnChange();
    this.compareChange();
  }

  async toastAutoCompute() {
    const toast = await this.toastCtrl.create({
      header: 'Auto computed successfully.',
      position: 'top',
      cssClass: 'toast-scheme ',
      duration: 2000,
    });
    await toast.present();
  }
  minTime = '';
  maxTime = '23:59:00';
  hourValues = [];
  oldDate;
  checkExcludeWeekend = true;
  checkOldDate = false;
  async chageInclueExclude() {
    if (this.setUpBidParametersForm.value.checkIncludeExclude == true) {
      var startDate;
      startDate = this.setUpBidParametersForm.value.SBP_start_date;
      this.oldDate = startDate;
      this.checkOldDate = true;
      if (startDate.getDay() == 0) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message:
            'Your bidding start date has changed because you excluded weekends.',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {},
            },
          ],
        });

        await alert.present();
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + +(+1),
          0,
          0,
          0
        );
      }
      if (startDate.getDay() == 6) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message:
            'Your bidding start date has changed because you excluded weekends.',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {},
            },
          ],
        });

        await alert.present();
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + +(+2),
          0,
          0,
          0
        );
      }
      this.setUpBidParametersForm.controls.SBP_start_date.setValue(startDate);

      this.checkExcludeWeekend =
        this.setUpBidParametersForm.value.checkIncludeExclude;
      this.newOnChange();
    } else {
      this.checkExcludeWeekend =
        this.setUpBidParametersForm.value.checkIncludeExclude;

      if (this.checkOldDate == true) {
        this.setUpBidParametersForm.get('SBP_start_date').clearValidators();
        this.setUpBidParametersForm
          .get('SBP_start_date')
          .setValue(this.oldDate);
        this.checkOldDate = false;
      }
      this.newOnChange();
    }
  }
  includeIntervals() {
    this.hasInterval = this.setUpBidParametersForm.value.checkIncludeIntervals;
    if (!this.hasInterval) {
      this.setUpBidParametersForm.controls.intervalDuration.setValue(
        '00:00:00'
      );
    }
    this.newOnChange();
  }
  weekendsDatesFilter = (d: Date): boolean => {
    if (d && !this.checkExcludeWeekend) {
      const day = d.getDay();
      return day !== 0 && day !== 6;
    } else {
      return true;
    }
  };
  createBidROundData(reCalculate = true) {
    this.checkExcludeWeekend =
      !this.setUpBidParametersForm.value.checkIncludeExclude;
    this.allRoundInfo = this.roundListForm.value.allRoundData;
    const startDate: string = this.setUpBidParametersForm.value.SBP_start_date;
    const startTime: string = this.sameTimeForAll
      ? this.setUpBidParametersForm.value.SBP_start_time
      : this.allRoundData.at(0).get('roundstart').value;
    const startT: string[] = startTime.split(':');
    let start: any, end: any, endD: any;
    start = this.formatDate(startDate);
    end = this.formatDate(startDate);
    start = start.split('-');
    end = end.split('-');
    endD = new Date(
      Number(start[0]),
      Number(start[1]) + -+1,
      start[2],
      Number(startT[0]),
      Number(startT[1]),
      0
    );
    this.all_window_data = [];
    if (this.isComputingFirstTime) {
      this.allRoundData.controls.forEach((_, idx) =>
        idx >= this.roundsChangeData.length
          ? this.roundsChangeData.push(false)
          : (this.roundsChangeData[idx] = false)
      );
    }
    let all_bid_round_data = [];

    if (reCalculate) {
      const tempArr = this.calculateEmployeeRoundsData(start, end, endD);

      this.all_bid_WindoRound_data = tempArr;
      for (var j = 0; j < this.all_bid_WindoRound_data.length; j++) {
        let finalstartTime: Date, finalendTime: Date;
        finalstartTime = new Date(
          this.all_bid_WindoRound_data[j].data[0].startDate
        );
        finalendTime = new Date(
          this.all_bid_WindoRound_data[j].data[
            this.all_bid_WindoRound_data[j].data.length + -+1
          ].endDate
        );
        const dailyStart =
          this.checkSingleDigit(finalstartTime.getHours()) +
          ':' +
          this.checkSingleDigit(finalstartTime.getMinutes()) +
          ':' +
          this.checkSingleDigit(finalstartTime.getSeconds());
        const dailyEnd =
          this.checkSingleDigit(finalendTime.getHours()) +
          ':' +
          this.checkSingleDigit(finalendTime.getMinutes()) +
          ':' +
          this.checkSingleDigit(finalendTime.getSeconds());

        all_bid_round_data.push({
          bidroundstartdate: new Date(
            finalstartTime.getFullYear(),
            Number(finalstartTime.getMonth()),
            finalstartTime.getDate(),
            0,
            0,
            0
          ),
          bid_duration:
            '00:' +
            this.all_bid_WindoRound_data[j].data[0].bid_duration +
            ':00',
          daily_starttime: dailyStart,
          daily_endttime: dailyEnd,
          bidroundenddate: new Date(
            finalendTime.getFullYear(),
            Number(finalendTime.getMonth()),
            finalendTime.getDate(),
            0,
            0,
            0
          ),
          bidleavereason: this.allRoundInfo[j].leaveRule,
          useridref: this.user_data.id,
          bidschref: this.allRoundInfo[j].bidschref,
          bidroundid: this.all_bid_WindoRound_data[j].round_id,
          startTime: this.allRoundData.at(j).get('roundstart').value,
          endTime: this.allRoundData.at(j).get('roundend').value,
          roundsavestatus: 1,
        });
      }
    } else {
      let storedData = JSON.parse(
        this.localData.getItem('editBidSchedule')
      ).roundmap;
      all_bid_round_data = [];
      for (var j = 0; j < storedData.length; j++) {
        all_bid_round_data.push({
          bidroundstartdate: storedData[j].roundstartdate,
          bid_duration: storedData[j].roundduration,
          daily_starttime: storedData[j].roundstarttime,
          daily_endttime: storedData[j].roundendttime,
          bidroundenddate: storedData[j].roundenddate,
          bidleavereason: storedData[j].bidleavereason,
          useridref: this.user_data.id,
          bidschref: storedData[j].bidschref,
          bidroundid: storedData[j].bidroundid,
          startTime: storedData[j].actual_bidround_start_time,
          endTime: storedData[j].actual_bidround_end_time,
          roundsavestatus: 1,
        });
      }
    }
    this.all_bid_round_data = [...all_bid_round_data];
    this.totalRequiredROunds = this.all_bid_round_data.length;
  }
  onDateTimeFocus(event: any) {
    if (this.displayTimeAlert) {
      this.preTimeValue = event.target.value;
    }
  }
  willTimeIntervalsOverlap(
    roundStarttime: string,
    roundDuration: string
  ): boolean {
    // Parse the input strings as Date objects
    const intervalStartTime = this.parseTime(this.intervalStart.value);
    const intervalEndTime = new Date(intervalStartTime);
    intervalEndTime.setMinutes(
      intervalEndTime.getMinutes() + Number(this.intervalDuration.value)
    );
    const roundStartTime = this.parseTime(roundStarttime);
    const roundEndTime = new Date(roundStartTime);
    roundEndTime.setMinutes(roundEndTime.getMinutes() + Number(roundDuration));

    // Check if the time intervals overlap
    return (
      (intervalStartTime >= roundStartTime &&
        intervalStartTime < roundEndTime) ||
      (intervalEndTime > roundStartTime && intervalEndTime <= roundEndTime) ||
      (roundStartTime >= intervalStartTime &&
        roundStartTime < intervalEndTime) ||
      (roundEndTime > intervalStartTime && roundEndTime <= intervalEndTime)
    );
  }

  // Helper function to parse a time string into a Date object
  parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map((str) => parseInt(str));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Helper function to add minutes to a Date object and return a new Date object
  addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() + minutes);
    return newDate;
  }
  async copyRoundTimeBelow(idx: number) {
    this.displayTimeAlert = false;
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: `Copying the time will affect the start and end dates of the current and subsequent rounds. Are you sure you want to continue?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Yes',
          handler: () => {
            let start, end;
            this.allRoundData.controls.forEach((control, index) => {
              if (index === idx) {
                start = control.get('roundstart').value;
                end = control.get('roundend').value;
              } else if (index > idx) {
                control.patchValue({
                  roundstart: start,
                  roundend: end,
                });
              }
              this.roundsChangeData[index] = true;
            });
          },
        },
      ],
    });
    await alert.present();
    this.displayTimeAlert = true;
  }
  convertToMinutes(timeString) {
    var time = moment.duration(timeString);
    var totalMinutes = time.asMinutes();
    return totalMinutes;
  }
  calculateEmployeeRoundsData(start, end, employeeEndDate) {
    let roundsData = [];
    for (var i = 0; i < this.allRoundInfo.length; i++) {
      let roundData = [];
      let duration = this.allRoundInfo[i].roundduration.split(':');
      duration = Number(duration[1]) + Number(duration[0]) * 60;
      let startTime, endTime;
      let interval;
      if (this.hasInterval) {
        interval = this.intervalStart?.value.split(':');
      }
      employeeEndDate = new Date(employeeEndDate);
      startTime = (
        this.sameTimeForAll
          ? this.setUpBidParametersForm.value.SBP_start_time
          : this.allRoundData.at(i).get('roundstart').value
      ).split(':');
      endTime = (
        this.sameTimeForAll
          ? this.setUpBidParametersForm.value.SBP_end_time
          : this.allRoundData.at(i).get('roundend').value
      ).split(':');

      let startDate = new Date(
        Number(start[0]),
        Number(start[1] - 1),
        Number(start[2]),
        Number(startTime[0]),
        Number(startTime[1])
      );
      let endDate = new Date(
        Number(end[0]),
        Number(end[1] - 1),
        Number(end[2]),
        Number(endTime[0]),
        Number(endTime[1])
      );

      if (!this.checkExcludeWeekend && endDate.getDay() === 6) {
        endDate = new Date(
          Number(end[0]),
          Number(end[1]) - 1,
          Number(end[2]) + 2,
          Number(endTime[0]),
          Number(endTime[1]),
          0
        );
      }
      if (
        !this.sameTimeForAll &&
        !this.noTimeForAny &&
        (this.roundsChangeData[i] ?? false)
      ) {
        let computedStartHour = employeeEndDate.getHours();
        let computedStartMin = employeeEndDate.getMinutes();
        let actualStartHour = Number(startTime[0]);
        let actualStartMin = Number(startTime[1]);
        if (
          computedStartHour !== actualStartHour ||
          computedStartMin !== actualStartMin
        ) {
          employeeEndDate.setHours(actualStartHour);
          employeeEndDate.setMinutes(actualStartMin);
          if (
            computedStartHour > actualStartHour ||
            (computedStartHour === actualStartHour &&
              computedStartMin > actualStartMin)
          ) {
            employeeEndDate.setDate(employeeEndDate.getDate() + 1);
          }
        }
      }
      let employeeStartDate = new Date(employeeEndDate);
      for (var j = 0; j < this.totalEmp; j++) {
        let comparableDate = new Date(employeeEndDate);
        if (
          this.hasInterval &&
          this.convertToMinutes(this.intervalDuration.value) &&
          this.willTimeIntervalsOverlap(
            `${comparableDate.getHours()}:${comparableDate.getMinutes()}`,
            duration
          )
        ) {
          employeeEndDate.setHours(Number(interval[0]));
          employeeEndDate.setMinutes(Number(interval[1]));
          employeeEndDate.setMinutes(
            employeeEndDate.getMinutes() +
              this.convertToMinutes(this.intervalDuration.value)
          );
          comparableDate = new Date(employeeEndDate);
        }
        comparableDate.setMinutes(employeeEndDate.getMinutes() + duration);
        // Calculate total minutes for start and end times
        const startTotalMinutes =
          employeeEndDate.getHours() * 60 + employeeEndDate.getMinutes();
        const endTotalMinutes = endDate.getHours() * 60 + endDate.getMinutes();
        if (
          startDate.getHours() > endDate.getHours() ||
          (startDate.getHours() == endDate.getHours() &&
            startDate.getMinutes() >= endDate.getMinutes())
        ) {
          if (
            (employeeEndDate.getHours() < startDate.getHours() ||
              (employeeEndDate.getHours() == startDate.getHours() &&
                employeeEndDate.getMinutes() < startDate.getMinutes())) &&
            (comparableDate.getHours() > endDate.getHours() ||
              (comparableDate.getHours() == endDate.getHours() &&
                comparableDate.getMinutes() > endDate.getMinutes()))
          ) {
            employeeEndDate = new Date(
              employeeEndDate.getFullYear(),
              employeeEndDate.getMonth(),
              employeeEndDate.getDate(),
              Number(startTime[0]),
              Number(startTime[1])
            );
          }
        } else {
          if (
            employeeEndDate.getHours() < startDate.getHours() ||
            (employeeEndDate.getHours() == startDate.getHours() &&
              employeeEndDate.getMinutes() < startDate.getMinutes())
          ) {
            employeeEndDate = new Date(
              employeeEndDate.getFullYear(),
              employeeEndDate.getMonth(),
              employeeEndDate.getDate(),
              Number(startTime[0]),
              Number(startTime[1])
            );
          } else if (
            comparableDate.getHours() > endDate.getHours() ||
            (comparableDate.getHours() == endDate.getHours() &&
              comparableDate.getMinutes() > endDate.getMinutes()) ||
            (employeeEndDate.getHours() == endDate.getHours() &&
              employeeEndDate.getMinutes() == endDate.getMinutes()) ||
            endTotalMinutes - startTotalMinutes < duration
          ) {
            employeeEndDate = new Date(
              employeeEndDate.getFullYear(),
              employeeEndDate.getMonth(),
              employeeEndDate.getDate(),
              Number(startTime[0]),
              Number(startTime[1])
            );
            employeeEndDate.setDate(employeeEndDate.getDate() + 1);
          }
          if (employeeStartDate.getDay() === 6 && !this.checkExcludeWeekend) {
            employeeStartDate = new Date(
              Number(start[0]),
              Number(start[1]) + -+1,
              Number(start[2]) + +(+3),
              Number(startTime[0]),
              Number(startTime[1]),
              0
            );
            employeeEndDate = new Date(
              Number(end[0]),
              Number(end[1]) + -+1,
              Number(end[2]) + +(+3),
              Number(endTime[0]),
              Number(endTime[1]),
              0
            );
            employeeEndDate = new Date(
              Number(start[0]),
              Number(start[1]) + -+1,
              Number(start[2]) + +(+3),
              Number(startTime[1]),
              Number(startTime[0]),
              0
            );
          }
        }
        if (
          this.hasInterval &&
          this.convertToMinutes(this.intervalDuration.value) &&
          this.willTimeIntervalsOverlap(
            `${employeeEndDate.getHours()}:${employeeEndDate.getMinutes()}`,
            duration
          )
        ) {
          employeeEndDate.setHours(Number(interval[0]));
          employeeEndDate.setMinutes(Number(interval[1]));
          employeeEndDate.setMinutes(
            employeeEndDate.getMinutes() +
              this.convertToMinutes(this.intervalDuration.value)
          );
        }
        employeeStartDate = new Date(employeeEndDate);
        employeeEndDate.setMinutes(employeeEndDate.getMinutes() + duration);
        let employeeRoundData = {
          round: i + 1,
          empName: '',
          empInitial: '',
          status: 0,
          bid_duration: duration,
          startDate: String(employeeStartDate),
          endDate: String(employeeEndDate),
          id: j + 1,
        };
        roundData.push(employeeRoundData);
        this.all_window_data.push(employeeRoundData);
      }
      roundsData.push({ round_id: i + 1, data: roundData });
    }
    roundsData.length > 0 && this.roundsComputed.emit();
    return roundsData;
  }

  getActualTime(index, data) {
    if (data == 'start') {
      return this.all_bid_round_data[index].bidroundstartdate;
    } else if (data == 'end') {
      return this.all_bid_round_data[index].bidroundenddate;
    }
    if (data == 'startTime') {
      return this.convert24to12(this.all_bid_round_data[index].daily_starttime);
    } else if (data == 'endTime') {
      return this.convert24to12(this.all_bid_round_data[index].daily_endttime);
    }
  }
  convert24to12(time) {
    var hh, mm, newhh;
    hh = time.split(':')[0];
    mm = time.split(':')[1];
    newhh = Number(hh) + -+12;
    if (newhh < 10) {
      newhh = '0' + newhh;
    }
    if (Number(hh) == 24 || Number(hh) == 0) {
      return 12 + ':' + mm + ' AM';
    } else if (Number(hh) == 12) {
      return hh + ':' + mm + ' PM';
    } else if (Number(hh) > 12) {
      return newhh + ':' + mm + ' PM';
    } else {
      return hh + ':' + mm + ' AM';
    }
  }

  onChangel() {
    this.checkComputedButton = true;
    var startDate, endDate, startTime, endTime, duration, leaveRule;
    startDate = this.setUpBidParametersForm.value.SBP_start_date;
    startTime = this.setUpBidParametersForm.value.SBP_start_time;
    endTime = this.setUpBidParametersForm.value.SBP_end_time;
    // duration=this.setUpBidParametersForm.value.SBP_bidding_duration
    // leaveRule=this.setUpBidParametersForm.value.SBP_leave_selection_rules
    var totalRequiredRounds = 0;
    this.maxLeave = this.defaultMAxLeave;
    for (var i = 0; i < this.maxLeave; i++) {
      if (i == 0) {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+80;
      } else {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+40;
      }
    }
    totalRequiredRounds++;
    var temp,
      tempArr = [];
    this.totalBidRounds = totalRequiredRounds;
    this.allRoundInfo = [];

    // this.totalEmp=33
    this.totalEmp = this.allEmployee.length;
    this.totalDefaultEmp = this.totalEmp;

    this.allRoundInfo = this.roundListForm.value.allRoundData;
    var sDate,
      finalArr = [],
      remaining_mins = 0;
    for (var i = 0; i < this.allRoundInfo.length; i++) {
      this.totalEmp = this.totalDefaultEmp;
      if (i == 0) {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);

        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        minutes = Number(minutes);

        var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
        var totalRequiredDaysForAllEmp =
          Number(totalRequiredMInsForAllEmp) / minutes;
        var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
        var tEmp = this.totalEmp;
        var EmpListBasedOnRound = [],
          temp;
        for (var j = 1; j < finalEndDateCount + +(+1); j++) {
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(j) - 1)
            )
          );
          temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

          if (tEmp > 0) {
            if (tEmp > temp) {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': temp,
                round: i + +(+1),
              });
              tEmp = tEmp + -+temp;
            } else {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': tEmp,
                round: i + +(+1),
              });
            }
          }
        }
        var finalEndDate = new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
          )
        );

        var bid_round_data = {
          bidroundstartdate: new Date(startDate),
          bid_duration: this.allRoundInfo[i].roundduration,
          daily_starttime: this.allRoundInfo[i].roundstarttime,
          daily_endttime: this.allRoundInfo[i].roundendtime,
          bidroundenddate: finalEndDate,
          bidschref: this.allRoundInfo[i].bidschref,
          bidroundid: this.allRoundInfo[i].bidroundid,
          bidleavereason: this.allRoundInfo[i].leaveRule,
          useridref: this.user_data.id,
          roundsavestatus: 1,
        };
        remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);
        if (remaining_mins < 0) {
          remaining_mins = remaining_mins * -1;
        }
        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }

        finalArr.push(bid_round_data);
      } else {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);

        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        var dayCount = 0;

        var tEmp = this.totalEmp;
        var EmpListBasedOnRound = [],
          temp;
        if (remaining_mins > 0) {
          if (remaining_mins < minutes) {
            this.totalEmp =
              this.totalEmp + -+(remaining_mins / Number(diffDur));
            EmpListBasedOnRound.push({
              Date: startDate,
              'total EMp': remaining_mins / Number(diffDur),
              round: i + +(+1),
            });
            dayCount++;
          }
          remaining_mins = 0;
          tEmp = this.totalEmp;
          minutes = Number(minutes);
          var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
          var totalRequiredDaysForAllEmp =
            Number(totalRequiredMInsForAllEmp) / minutes;
          var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
          finalEndDateCount = finalEndDateCount + +(+dayCount);

          for (var j = 2; j < finalEndDateCount + +(+1); j++) {
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(j) - 1)
              )
            );
            temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

            if (tEmp > 0) {
              if (tEmp > temp) {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': temp,
                  round: i + +(+1),
                });
                tEmp = tEmp + -+temp;
              } else {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': tEmp,
                  round: i + +(+1),
                });
              }
            }
          }
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
            )
          );
        } else {
          tEmp = this.totalEmp;
          minutes = Number(minutes);
          var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
          var totalRequiredDaysForAllEmp =
            Number(totalRequiredMInsForAllEmp) / minutes;
          var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
          finalEndDateCount = finalEndDateCount + +(+dayCount);

          for (var j = 1; j < finalEndDateCount + +(+1); j++) {
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(j) - 1)
              )
            );
            temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

            if (tEmp > 0) {
              if (tEmp > temp) {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': temp,
                  round: i + +(+1),
                });
                tEmp = tEmp + -+temp;
              } else {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': tEmp,
                  round: i + +(+1),
                });
              }
            }
          }
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
            )
          );
        }
        var bid_round_data = {
          bidroundstartdate: new Date(startDate),
          bid_duration: this.allRoundInfo[i].roundduration,
          daily_starttime: this.allRoundInfo[i].roundstarttime,
          daily_endttime: this.allRoundInfo[i].roundendtime,
          bidroundenddate: finalEndDate,
          bidschref: this.allRoundInfo[i].bidschref,
          bidroundid: this.allRoundInfo[i].bidroundid,
          bidleavereason: this.allRoundInfo[i].leaveRule,
          useridref: this.user_data.id,
          roundsavestatus: 1,
        };

        finalArr.push(bid_round_data);
        remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);
        if (remaining_mins < 0) {
          remaining_mins = remaining_mins * -1;
        }

        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }
      }
    }
    this.all_bid_round_data = finalArr;
    this.totalEmp = this.totalDefaultEmp;
  }
  compute() {
    this.checkComputedButton = true;
    var startDate, endDate, startTime, endTime, duration, leaveRule;
    startDate = this.setUpBidParametersForm.value.SBP_start_date;
    startTime = this.setUpBidParametersForm.value.SBP_start_time;
    endTime = this.setUpBidParametersForm.value.SBP_end_time;
    // duration=this.setUpBidParametersForm.value.SBP_bidding_duration
    // leaveRule=this.setUpBidParametersForm.value.SBP_leave_selection_rules
    var totalRequiredRounds = 0;

    this.maxLeave = this.defaultMAxLeave;
    for (var i = 0; i < this.maxLeave; i++) {
      if (i == 0) {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+80;
      } else {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+40;
      }
    }
    totalRequiredRounds++;
    var temp,
      tempArr = [];

    this.totalBidRounds = totalRequiredRounds;
    for (var i = 0; i < totalRequiredRounds; i++) {
      this.allRoundData.push(this.newRound());
      if (i == 0) {
        temp = {
          id: i,
          roundduration: '00:30:00',
          leaveRule: '2 weeks NC',
          bidroundid: '',
          bidschref: '',
        };
      } else {
        temp = {
          id: i,
          roundduration: '00:15:00',
          leaveRule: '1 week',
          bidroundid: '',
          bidschref: '',
        };
      }
      temp = {
        ...temp,
        roundstart: this.setUpBidParametersForm.value.SBP_start_time,
        roundend: this.setUpBidParametersForm.value.SBP_end_time,
      };
      tempArr.push(temp);
    }

    this.allRoundData.setValue(tempArr);
    this.allRoundInfo = [];

    // this.totalEmp=33
    this.totalEmp = this.allEmployee.length;
    this.totalDefaultEmp = this.totalEmp;

    this.allRoundInfo = this.roundListForm.value.allRoundData;
    this.all_SBP_rounds = this.roundListForm.value.allRoundData;
    var sDate,
      finalArr = [],
      remaining_mins = 0;
    tempArr = [];
    for (var i = 0; i < this.allRoundInfo.length; i++) {
      this.totalEmp = this.totalDefaultEmp;
      if (i == 0) {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);
        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        minutes = Number(minutes);
        var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
        var totalRequiredDaysForAllEmp =
          Number(totalRequiredMInsForAllEmp) / minutes;
        var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);

        var tEmp = this.totalEmp;
        var EmpListBasedOnRound = [],
          temp;
        for (var j = 1; j < finalEndDateCount + +(+1); j++) {
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(j) - 1)
            )
          );
          temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);
          if (tEmp > 0) {
            if (tEmp > temp) {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': temp,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: temp,
                round: i + +(+1),
                duration: duration_1,
              });
              tEmp = tEmp + -+temp;
            } else {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': tEmp,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: tEmp,
                round: i + +(+1),
                duration: duration_1,
              });
            }
          }
        }

        var finalEndDate = new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + (Number(finalEndDateCount) + -+1)
          )
        );
        remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);
        if (remaining_mins < 0) {
          remaining_mins = remaining_mins * -1;
        }
        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }
      } else {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);

        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        var dayCount = 0;
        var tEmp = this.totalEmp;

        var EmpListBasedOnRound = [],
          temp,
          updatedEmpNum = 0;
        if (remaining_mins > 0) {
          if (remaining_mins < minutes) {
            if (remaining_mins / Number(diffDur) > this.totalEmp) {
              updatedEmpNum = this.totalEmp;
              var t;
              t = remaining_mins / Number(diffDur) + -+this.totalEmp;
              if (t > 0) {
                this.totalEmp = 0;
              }
              remaining_mins =
                Number(remaining_mins) +
                -+Number(diffDur) * Number(updatedEmpNum);
              EmpListBasedOnRound.push({
                Date: startDate,
                total_EMp: updatedEmpNum,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: updatedEmpNum,
                round: i + +(+1),
                duration: duration_1,
              });
            } else {
              this.totalEmp =
                this.totalEmp + -+(remaining_mins / Number(diffDur));
              EmpListBasedOnRound.push({
                Date: startDate,
                total_EMp: remaining_mins / Number(diffDur),
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: remaining_mins / Number(diffDur),
                round: i + +(+1),
                duration: duration_1,
              });
              remaining_mins =
                remaining_mins / Number(diffDur) + -+this.totalEmp;
              dayCount++;
            }
          }

          if (remaining_mins < Number(diffDur)) {
            remaining_mins = 0;
            tEmp = this.totalEmp;
            minutes = Number(minutes);
            var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
            var totalRequiredDaysForAllEmp =
              Number(totalRequiredMInsForAllEmp) / minutes;
            var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
            finalEndDateCount = finalEndDateCount + +(+dayCount);
            for (var j = 2; j < finalEndDateCount + +(+1); j++) {
              var finalEndDate = new Date(
                new Date(startDate).setDate(
                  new Date(startDate).getDate() + (Number(j) - 1)
                )
              );
              temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

              if (tEmp > 0) {
                if (tEmp > temp) {
                  EmpListBasedOnRound.push({
                    Date: finalEndDate,
                    'total EMp': temp,
                    round: i + +(+1),
                  });
                  tempArr.push({
                    Date: finalEndDate,
                    total_EMp: temp,
                    round: i + +(+1),
                    duration: duration_1,
                  });
                  tEmp = tEmp + -+temp;
                } else {
                  EmpListBasedOnRound.push({
                    Date: finalEndDate,
                    'total EMp': tEmp,
                    round: i + +(+1),
                  });
                  tempArr.push({
                    Date: finalEndDate,
                    total_EMp: tEmp,
                    round: i + +(+1),
                    duration: duration_1,
                  });
                }
              }
            }
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
              )
            );
          }
        } else {
          tEmp = this.totalEmp;
          minutes = Number(minutes);
          var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
          var totalRequiredDaysForAllEmp =
            Number(totalRequiredMInsForAllEmp) / minutes;
          var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
          finalEndDateCount = finalEndDateCount;
          for (var j = 1; j < finalEndDateCount + +(+1); j++) {
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(j) - 1)
              )
            );
            temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

            if (tEmp > 0) {
              if (tEmp > temp) {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': temp,
                  round: i + +(+1),
                });
                tempArr.push({
                  Date: finalEndDate,
                  total_EMp: temp,
                  round: i + +(+1),
                  duration: duration_1,
                });
                tEmp = tEmp + -+temp;
              } else {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': tEmp,
                  round: i + +(+1),
                });
                tempArr.push({
                  Date: finalEndDate,
                  total_EMp: tEmp,
                  round: i + +(+1),
                  duration: duration_1,
                });
              }
            }
          }
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
            )
          );
        }

        sDate = this.formatDate(finalEndDate);
        sDate = sDate.split('-');
        sDate = new Date(
          sDate[0],
          Number(sDate[1]) + -+1,
          Number(sDate[2]),
          0,
          0,
          0
        );
        startDate = sDate;

        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          if (remaining_mins < Number(diffDur)) {
            remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);
            if (remaining_mins < 0) {
              remaining_mins = remaining_mins * -1;
            }
          }
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }
      }
    }

    this.all_bid_round_data = finalArr;
    this.totalEmp = this.totalDefaultEmp;

    this.roundStartTime = startTime;
    var startT = this.tConvert(this.roundStartTime).split(':');
    var start_Date = new Date(0, 0, 0, Number(startT[0]), Number(startT[1]), 0);
    var minutesDifference = Math.floor(diff / 1000 / 60);
    var totalEmpPerDay;
    // =(minutesDifference / Number(this.roundDuration))+ + +1
    var roundOfTheDay;
    var d = 0;
    this.finalViewBidWindowData = [];
    var tempArrTwo = [],
      tempAr = [];

    for (var i = 0; i < tempArr.length; i++) {
      if (i == 0) {
        start = this.formatDate(tempArr[i].Date);
        start = start.split('-');
        var s = new Date(
          Number(start[0]),
          Number(start[1]) + -+1,
          start[2],
          Number(startT[0]),
          Number(startT[1]),
          0
        );
        totalEmpPerDay = tempArr[i].total_EMp;
        for (var j = 0; j < totalEmpPerDay; j++) {
          tempArrTwo.push({
            startTime: new Date(
              s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
            ),
            endTime: new Date(
              s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
            ),
            duration: tempArr[i].duration,
            round: tempArr[i].round,
          });
        }
      } else {
        if (
          tempArr[i].Date.getDate() === tempArr[i - 1].Date.getDate() &&
          tempArr[i].Date.getMonth() === tempArr[i - 1].Date.getMonth() &&
          tempArr[i].Date.getFullYear() === tempArr[i - 1].Date.getFullYear()
        ) {
          start = tempArrTwo[tempArrTwo.length + -+1].endTime;
          s = start;
          totalEmpPerDay = tempArr[i].total_EMp;
          for (var j = 0; j < totalEmpPerDay; j++) {
            tempArrTwo.push({
              startTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
              ),
              endTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
              ),
              duration: tempArr[i].duration,
              round: tempArr[i].round,
            });
          }
        } else {
          start = this.formatDate(tempArr[i].Date);
          start = start.split('-');
          var s = new Date(
            Number(start[0]),
            Number(start[1]) + -+1,
            start[2],
            Number(startT[0]),
            Number(startT[1]),
            0
          );
          totalEmpPerDay = tempArr[i].total_EMp;
          for (var j = 0; j < totalEmpPerDay; j++) {
            tempArrTwo.push({
              startTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
              ),
              endTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
              ),
              duration: tempArr[i].duration,
              round: tempArr[i].round,
            });
          }
        }
      }
    }
    this.all_window_data = [];
    this.all_window_data = tempArrTwo;

    this.displayRoundData(0);
  }

  onChange() {
    var newBidSchedule;
    if (!this.editBidSchedule) {
      newBidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));
    } else {
      newBidSchedule = JSON.parse(this.localData.getItem('editBidSchedule'));
    }
    this.all_SBP_rounds = this.roundListForm.value.allRoundData;
    var startDate,
      endDate,
      startTime,
      endTime,
      duration,
      leaveRule,
      tempArr = [];
    startDate = this.setUpBidParametersForm.value.SBP_start_date;
    startTime = this.setUpBidParametersForm.value.SBP_start_time;
    endTime = this.setUpBidParametersForm.value.SBP_end_time;

    var totalRequiredRounds = 0;
    this.maxLeave = this.defaultMAxLeave = 208;
    for (var i = 0; i < this.maxLeave; i++) {
      if (i == 0) {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+80;
      } else {
        totalRequiredRounds++;
        this.maxLeave = this.maxLeave + -+40;
      }
    }
    totalRequiredRounds = this.all_SBP_rounds.length;
    var temp,
      tempArr = [];

    // this.totalEmp=5
    this.totalEmp = newBidSchedule.employeemap.length;

    this.totalBidRounds = totalRequiredRounds;
    this.allRoundInfo = [];
    // this.totalEmp=31
    this.totalDefaultEmp = this.totalEmp;

    this.allRoundInfo = this.roundListForm.value.allRoundData;

    var sDate,
      finalArr = [],
      remaining_mins = 0;
    for (var i = 0; i < this.allRoundInfo.length; i++) {
      this.totalEmp = this.totalDefaultEmp;

      if (i == 0) {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);
        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        minutes = Number(minutes);
        var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
        var totalRequiredDaysForAllEmp =
          Number(totalRequiredMInsForAllEmp) / minutes;
        var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);

        var tEmp = this.totalEmp;
        var EmpListBasedOnRound = [],
          temp;
        for (var j = 1; j < finalEndDateCount + +(+1); j++) {
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(j) - 1)
            )
          );
          temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);
          if (tEmp > 0) {
            if (tEmp > temp) {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': temp,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: temp,
                round: i + +(+1),
                duration: duration_1,
              });
              tEmp = tEmp + -+temp;
            } else {
              EmpListBasedOnRound.push({
                Date: finalEndDate,
                'total EMp': tEmp,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: tEmp,
                round: i + +(+1),
                duration: duration_1,
              });
            }
          }
        }

        var finalEndDate = new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + (Number(finalEndDateCount) + -+1)
          )
        );
        remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);
        if (remaining_mins < 0) {
          remaining_mins = remaining_mins * -1;
        }
        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }
      } else {
        var start = startTime.split(':');
        var end = endTime.split(':');
        var start_Date = new Date(0, 0, 0, start[0], start[1], 0);
        var end_Date = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = end_Date.getTime() - start_Date.getTime();
        var minutes = Math.floor(diff / 1000 / 60);

        var duration_1 = this.allRoundInfo[i].roundduration.split(':');
        var timeDuration = new Date(0, 0, 0, 0, duration_1[1], 0);
        var diffDur = duration_1[1];
        var dayCount = 0;
        var tEmp = this.totalEmp;

        var EmpListBasedOnRound = [],
          temp,
          updatedEmpNum = 0;

        if (remaining_mins > 0) {
          if (remaining_mins < minutes) {
            if (remaining_mins / Number(diffDur) > this.totalEmp) {
              updatedEmpNum = this.totalEmp;
              var t;
              t = remaining_mins / Number(diffDur) + -+this.totalEmp;
              if (t > 0) {
                this.totalEmp = 0;
              }
              remaining_mins =
                Number(remaining_mins) +
                -+Number(diffDur) * Number(updatedEmpNum);
              EmpListBasedOnRound.push({
                Date: startDate,
                total_EMp: updatedEmpNum,
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: updatedEmpNum,
                round: i + +(+1),
                duration: duration_1,
              });
            } else {
              this.totalEmp =
                this.totalEmp + -+(remaining_mins / Number(diffDur));
              EmpListBasedOnRound.push({
                Date: startDate,
                total_EMp: remaining_mins / Number(diffDur),
                round: i + +(+1),
              });
              tempArr.push({
                Date: finalEndDate,
                total_EMp: remaining_mins / Number(diffDur),
                round: i + +(+1),
                duration: duration_1,
              });
              remaining_mins =
                remaining_mins / Number(diffDur) + -+this.totalEmp;
              dayCount++;
            }
          }

          if (remaining_mins < Number(diffDur)) {
            remaining_mins = 0;
            tEmp = this.totalEmp;
            minutes = Number(minutes);
            var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
            var totalRequiredDaysForAllEmp =
              Number(totalRequiredMInsForAllEmp) / minutes;
            var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
            finalEndDateCount = finalEndDateCount + +(+dayCount);
            for (var j = 2; j < finalEndDateCount + +(+1); j++) {
              var finalEndDate = new Date(
                new Date(startDate).setDate(
                  new Date(startDate).getDate() + (Number(j) - 1)
                )
              );
              temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

              if (tEmp > 0) {
                if (tEmp > temp) {
                  EmpListBasedOnRound.push({
                    Date: finalEndDate,
                    'total EMp': temp,
                    round: i + +(+1),
                  });
                  tempArr.push({
                    Date: finalEndDate,
                    total_EMp: temp,
                    round: i + +(+1),
                    duration: duration_1,
                  });
                  tEmp = tEmp + -+temp;
                } else {
                  EmpListBasedOnRound.push({
                    Date: finalEndDate,
                    'total EMp': tEmp,
                    round: i + +(+1),
                  });
                  tempArr.push({
                    Date: finalEndDate,
                    total_EMp: tEmp,
                    round: i + +(+1),
                    duration: duration_1,
                  });
                }
              }
            }
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
              )
            );
          }
        } else {
          tEmp = this.totalEmp;
          minutes = Number(minutes);
          var totalRequiredMInsForAllEmp = this.totalEmp * Number(diffDur);
          var totalRequiredDaysForAllEmp =
            Number(totalRequiredMInsForAllEmp) / minutes;
          var finalEndDateCount = Math.ceil(totalRequiredDaysForAllEmp);
          finalEndDateCount = finalEndDateCount;
          for (var j = 1; j < finalEndDateCount + +(+1); j++) {
            var finalEndDate = new Date(
              new Date(startDate).setDate(
                new Date(startDate).getDate() + (Number(j) - 1)
              )
            );
            temp = Math.floor(this.totalEmp / totalRequiredDaysForAllEmp);

            if (tEmp > 0) {
              if (tEmp > temp) {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': temp,
                  round: i + +(+1),
                });
                tempArr.push({
                  Date: finalEndDate,
                  total_EMp: temp,
                  round: i + +(+1),
                  duration: duration_1,
                });
                tEmp = tEmp + -+temp;
              } else {
                EmpListBasedOnRound.push({
                  Date: finalEndDate,
                  'total EMp': tEmp,
                  round: i + +(+1),
                });
                tempArr.push({
                  Date: finalEndDate,
                  total_EMp: tEmp,
                  round: i + +(+1),
                  duration: duration_1,
                });
              }
            }
          }
          var finalEndDate = new Date(
            new Date(startDate).setDate(
              new Date(startDate).getDate() + (Number(finalEndDateCount) - 1)
            )
          );
        }

        sDate = this.formatDate(finalEndDate);
        sDate = sDate.split('-');
        sDate = new Date(
          sDate[0],
          Number(sDate[1]) + -+1,
          Number(sDate[2]),
          0,
          0,
          0
        );
        startDate = sDate;

        if (remaining_mins == 0) {
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]) + +(+1),
            0,
            0,
            0
          );
          startDate = sDate;
        } else {
          if (remaining_mins < Number(diffDur)) {
            remaining_mins = Number(minutes) + -+Number(diffDur) * Number(tEmp);

            if (remaining_mins < 0) {
              remaining_mins = remaining_mins * -1;
            }
          }
          sDate = this.formatDate(finalEndDate);
          sDate = sDate.split('-');
          sDate = new Date(
            sDate[0],
            Number(sDate[1]) + -+1,
            Number(sDate[2]),
            0,
            0,
            0
          );
          startDate = sDate;
        }
      }
    }

    this.all_bid_round_data = finalArr;
    this.totalEmp = this.totalDefaultEmp;

    this.roundStartTime = startTime;
    var startT = this.tConvert(this.roundStartTime).split(':');
    var start_Date = new Date(0, 0, 0, Number(startT[0]), Number(startT[1]), 0);
    var minutesDifference = Math.floor(diff / 1000 / 60);
    var totalEmpPerDay;
    // =(minutesDifference / Number(this.roundDuration))+ + +1
    var roundOfTheDay;
    var d = 0;
    this.finalViewBidWindowData = [];
    var tempArrTwo = [],
      tempAr = [];

    for (var i = 0; i < tempArr.length; i++) {
      if (i == 0) {
        start = this.formatDate(tempArr[i].Date);
        start = start.split('-');
        var s = new Date(
          Number(start[0]),
          Number(start[1]) + -+1,
          start[2],
          Number(startT[0]),
          Number(startT[1]),
          0
        );
        totalEmpPerDay = tempArr[i].total_EMp;
        for (var j = 0; j < totalEmpPerDay; j++) {
          tempArrTwo.push({
            startTime: new Date(
              s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
            ),
            endTime: new Date(
              s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
            ),
            duration: tempArr[i].duration,
            round: tempArr[i].round,
          });
        }
      } else {
        if (
          tempArr[i].Date.getDate() === tempArr[i - 1].Date.getDate() &&
          tempArr[i].Date.getMonth() === tempArr[i - 1].Date.getMonth() &&
          tempArr[i].Date.getFullYear() === tempArr[i - 1].Date.getFullYear()
        ) {
          start = tempArrTwo[tempArrTwo.length + -+1].endTime;
          s = start;
          totalEmpPerDay = tempArr[i].total_EMp;
          for (var j = 0; j < totalEmpPerDay; j++) {
            tempArrTwo.push({
              startTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
              ),
              endTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
              ),
              duration: tempArr[i].duration,
              round: tempArr[i].round,
            });
          }
        } else {
          start = this.formatDate(tempArr[i].Date);
          start = start.split('-');
          var s = new Date(
            Number(start[0]),
            Number(start[1]) + -+1,
            start[2],
            Number(startT[0]),
            Number(startT[1]),
            0
          );
          totalEmpPerDay = tempArr[i].total_EMp;
          for (var j = 0; j < totalEmpPerDay; j++) {
            tempArrTwo.push({
              startTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * j
              ),
              endTime: new Date(
                s.getTime() + Number(tempArr[i].duration[1]) * 60000 * (j + 1)
              ),
              duration: tempArr[i].duration,
              round: tempArr[i].round,
            });
          }
        }
      }
    }
    this.all_window_data = [];
    this.all_window_data = tempArrTwo;

    this.displayRoundData(0);
  }

  currentactiveRoundNumber = 0;
  all_bid_WindoRound_data = [];
  displayRoundData(i) {
    this.currentactiveRoundNumber = i;
    var temp;
    temp = this.all_window_data;

    this.all_bid_WindoRound_data = [];

    if (this.currentactiveRoundNumber == i) {
      for (var j = 0; j < this.all_SBP_rounds.length; j++) {
        i = j;
        this.finalViewBidWindowData = [];
        for (var l = 0; l < temp.length; l++) {
          if (i + +(+1) == temp[l].round) {
            this.finalViewBidWindowData.push({
              id: l + 1,
              startTime: temp[l].startTime,
              status: 0,
              endTime: temp[l].endTime,
              empName: '',
              empInitial: '',
              round: temp[l].round,
              duration: temp[l].duration,
            });
          }
        }
        this.all_bid_WindoRound_data.push({
          Round: i + +(+1),
          RoundData: this.finalViewBidWindowData,
        });
      }
    }
    var all_bid_round_data = [];

    for (var j = 0; j < this.all_bid_WindoRound_data.length; j++) {
      var finalstartTime, finalstartDate, finalendDate, finalendTime;
      finalstartTime = this.all_bid_WindoRound_data[j].RoundData[0].startTime;
      finalendTime =
        this.all_bid_WindoRound_data[j].RoundData[
          this.all_bid_WindoRound_data[j].RoundData.length + -+1
        ].endTime;
      all_bid_round_data.push({
        bidroundstartdate: new Date(
          finalstartTime.getFullYear(),
          Number(finalstartTime.getMonth()),
          finalstartTime.getDate(),
          0,
          0,
          0
        ),
        bid_duration:
          this.all_bid_WindoRound_data[j].RoundData[0].duration[0] +
          ':' +
          this.all_bid_WindoRound_data[j].RoundData[0].duration[1] +
          ':' +
          this.all_bid_WindoRound_data[j].RoundData[0].duration[2],
        daily_starttime:
          this.checkSingleDigit(finalstartTime.getHours()) +
          ':' +
          this.checkSingleDigit(finalstartTime.getMinutes()) +
          ':' +
          this.checkSingleDigit(finalstartTime.getSeconds()),
        daily_endttime:
          this.checkSingleDigit(finalendTime.getHours()) +
          ':' +
          this.checkSingleDigit(finalendTime.getMinutes()) +
          ':' +
          this.checkSingleDigit(finalendTime.getSeconds()),
        bidroundenddate: new Date(
          finalendTime.getFullYear(),
          Number(finalendTime.getMonth()),
          finalendTime.getDate(),
          0,
          0,
          0
        ),
        bidleavereason: this.allRoundInfo[j].leaveRule,
        useridref: this.user_data.id,
        bidschref: this.allRoundInfo[j].bidschref,
        bidroundid: this.all_bid_WindoRound_data[j].Round,
        startTime: this.setUpBidParametersForm.value.SBP_start_time,
        endTime: this.setUpBidParametersForm.value.SBP_end_time,
        roundsavestatus: 1,
      });
    }
    return (this.all_bid_round_data = all_bid_round_data);
  }
  checkSingleDigit(number) {
    if (Number(number) < 10) {
      return '0' + number;
    } else {
      return number;
    }
  }

  PopUpId;
  checkClickForPopup = false;
  oldPopUpId;
  myFunction(i) {
    this.PopUpId = i;
    this.checkClickForPopup = true;
    var popupOne = document.getElementById('myPopup' + this.PopUpId);
    popupOne.style.visibility = 'visible';
    if (this.oldPopUpId == this.PopUpId) {
      if (this.oldPopUpId != undefined) {
        var popup = document.getElementById('myPopup' + this.oldPopUpId);
        popup.style.visibility = 'hidden';
      }
      this.oldPopUpId = undefined;
    } else {
      if (this.oldPopUpId != undefined && this.PopUpId != this.oldPopUpId) {
        var oldPopup = document.getElementById('myPopup' + this.oldPopUpId);
        oldPopup.style.visibility = 'hidden';
      }
      this.oldPopUpId = this.PopUpId;
    }
  }
  disablePopup() {
    if (!this.checkClickForPopup) {
      if (this.oldPopUpId != undefined) {
        var popupTwo = document.getElementById('myPopup' + this.oldPopUpId);
        popupTwo.style.visibility = 'hidden';
      }
    }
    this.checkClickForPopup = false;
  }
  async viewBidWindows() {
    const modal = await this.modalCtrl.create({
      component: ViewBidWindowComponent,
      cssClass: 'addNewShiftLine bidWindows',
      componentProps: {
        round_id: 0,
        isModal: true,
        isEditBidSchedule: this.editBidSchedule,
        windowsData: this.allBidWindoRoundData(),
        bid_schedule_name: this.bidSchedule.bidschename
      },
      swipeToClose: true,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  async getAllEmployee(callback = null) {
    this.bidSchedule = JSON.parse(this.localData.getItem(this.editBidSchedule ? 'editBidSchedule' : 'newBidSchedule'));
    try {
      const res = await this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).toPromise();
      this.vacation = [];
      this.allEmployee = []
      res.map((e) => {
        this.bidSchedule.employeemap.map((employee) => {
          if (
            (!this.editBidSchedule && e.empid === employee) ||
            (this.editBidSchedule && e.empid === employee.empidref)
          ) {
            this.allEmployee.push(e);
            this.vacation.push(e.vacation);
          }
        });
      });
      this.allEmployee.sort((a, b) => a.rank - b.rank)
    } catch (err) {
      console.log(err);
    } finally{
      callback && callback();
    }
  }

  addNewRound() {
    if (!this.manualRoundState) {
      this.manualRoundCount = this.totalRequiredROunds;
      this.manualRoundState = true;
    }
    this.roundForm();
  }
  allBidWindoRoundData() {
    var totalEmp = this.allEmployee.length;
    var tempObj,
      tempArr = [];
    var count = 0;
    for (var j = 0; j < this.all_bid_WindoRound_data.length; j++) {
      // tempArr=[]
      for (var i = 0; i < this.all_bid_WindoRound_data[j].data.length; i++) {
        count++;
        if (i < totalEmp) {
          tempObj = {
            initials: this.allEmployee[i].initials,
            rank: this.allEmployee[i].rank,
            trans_seq_id: count,
            empidref: this.allEmployee[i].empid,
            roundseq_id: this.all_bid_WindoRound_data[j].round_id,
            bidstartdate: this.formatDate(
              this.all_bid_WindoRound_data[j].data[i].startDate
            ),
            bidenddate: this.formatDate(
              this.all_bid_WindoRound_data[j].data[i].endDate
            ),
            bidstarttime: this.convertTime(
              this.all_bid_WindoRound_data[j].data[i].startDate
            ),
            bidendtime: this.convertTime(
              this.all_bid_WindoRound_data[j].data[i].endDate
            ),
            empbidduration:
              '00:' +
              this.all_bid_WindoRound_data[j].data[i].bid_duration +
              ':00',
            shiftlinebidstatus: 'Eligible',
            vacationbidstatus: 'Eligible',
            fname: this.allEmployee[i].fname,
            lname: this.allEmployee[i].lname,
            empseq_id: i + +(+1),
            empbid_start_time:
              this.formatDate(
                this.all_bid_WindoRound_data[j].data[i].startDate
              ) +
              ' ' +
              this.convertTime(
                this.all_bid_WindoRound_data[j].data[i].startDate
              ),
            empbid_end_time:
              this.formatDate(this.all_bid_WindoRound_data[j].data[i].endDate) +
              ' ' +
              this.convertTime(this.all_bid_WindoRound_data[j].data[i].endDate),
          };
        } else {
          tempObj = {
            initials: '',
            rank: '',
            empidref: '',
            trans_seq_id: count,
            roundseq_id: this.all_bid_WindoRound_data[j].round_id,
            bidstartdate: this.formatDate(
              this.all_bid_WindoRound_data[j].data[i].startDate
            ),
            bidenddate: this.formatDate(
              this.all_bid_WindoRound_data[j].data[i].endDate
            ),
            bidstarttime: this.convertTime(
              this.all_bid_WindoRound_data[j].data[i].startDate
            ),
            bidendtime: this.convertTime(
              this.all_bid_WindoRound_data[j].data[i].endDate
            ),
            empbidduration:
              '00:' +
              this.all_bid_WindoRound_data[j].data[i].bid_duration +
              ':00',
            shiftlinebidstatus: 'Eligible',
            vacationbidstatus: 'Eligible',
            fname: '',
            lname: '',
            empseq_id: i + +(+1),
            empbid_start_time:
              this.formatDate(
                this.all_bid_WindoRound_data[j].data[i].startDate
              ) +
              ' ' +
              this.convertTime(
                this.all_bid_WindoRound_data[j].data[i].startDate
              ),
            empbid_end_time:
              this.formatDate(this.all_bid_WindoRound_data[j].data[i].endDate) +
              ' ' +
              this.convertTime(this.all_bid_WindoRound_data[j].data[i].endDate),
          };
        }
        tempArr.push(tempObj);
      }
    }
    return tempArr;
  }

  convertTime(time) {
    time = new Date(time);
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    if (h < 10) {
      h = '0' + h;
    }
    if (m < 10) {
      m = '0' + m;
    }
    return h + ':' + m + ':00';
  }

  getMaxAccumulatedLeave(): number {
    return this.allEmployee.reduce(
      (max, employee) => {
        return max < Number(employee.accumulatedleave)
          ? Number(employee.accumulatedleave || 0)
          : max;
      },
      0
    );
  }

  getAccumulatedRounds(): number {
    return Math.ceil(this.getMaxAccumulatedLeave() / 40);
  }
}
