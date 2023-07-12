import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertController, IonSlides, LoadingController, ModalController, NavController } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';

import straightlines_io_apis from 'src/app/json/apis.json';
import { MyBiddingService } from '../my-bidding.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { IonPullUpFooterState } from 'ionic-pullup';
import { BidSummaryCalendarComponent } from './bid-summary-calendar/bid-summary-calendar.component';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import workloadData from 'src/app/json/work-load-data.json';
import { ShiftAliasInfoComponent } from './shift-alias-info/shift-alias-info.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-my-bidding-step-one-shift-line',
  templateUrl: './my-bidding-step-one-shift-line.component.html',
  styleUrls: ['./my-bidding-step-one-shift-line.component.scss'],
})
export class MyBiddingStepOneShiftLineComponent implements OnInit {
  all_shift_lines = []
  spinner = true
  selectedShiftLines = []
  default_work_load_data = workloadData
  bidRound = 0
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>(); @Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  customPopoverOptions: any = {
    cssClass: 'custom-popover'
  };
  totalVacationHours = 0
  totalRdos = 0
  checkClickForPopup = false
  nextslide = true
  slideOption = {
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    initialSlide: 0,
    slidesPerView: 1.1,
    spaceBetween: 11,
    centeredSlides: true
  }
  openClose = "animate bottom"
  all_SBP_rounds = []
  user_data
  bid_schedule = []
  bid_scheduleName = []
  years = []
  selectShiftLineForm
  schedule_id: number = 0;
  step_form_name
  all_SBP_rounds_length = 0
  def_all_SBP_rounds = []
  selectYearForm: FormGroup;
  selectBidScheduleNameForm: FormGroup;
  start_date: any;
  end_date: any;
  all_bid_schedule: any[];
  currentSelectedRound: any;
  roundStartTime: any;
  roundStartDate: any;
  roundDuration: any;
  roundbidStatus = "Eligible"
  roundStatus: any;
  showPopUp: any;
  bidding_status = 0;
  currentactiveRoundNumber = 0;
  currentBidScheduleId = 0;

  minutes;
  seconds: any;
  distance: number;
  interval; all_window_data = []
  bid_schedule_length = 0
  allBidRoundData = []
  bid_shiftline;
  shiftLinesSchedule: any[];
  all_final_data: any[];
  shiftlineScheduleData: any;
  bid_summary = []
  bidSchedule
  timerOpenInterval
  allTimeZone
  firstEnter = true
  intervalForUpdateStatus;
  hours: any;
  shiftlinebidstatus
  vacationbidstatus
  completed_round_id
  bid_summary_popup = 75
  bid_summary_popup_margin = 250
  skipRoundId
  bidShculeTimeZone = 'US/Eastern'
  vactionExhausted = 0
  managerid
  empID
  userRole = 'bidmanager'
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private cdref: ChangeDetectorRef,
    public alertCtrl: AlertController,
    private scheduleService: GeneratedScheduleService,
    private bidLeaveSer: BidVacationLeaveService,
    public loadingController: LoadingController,
    private bidShiftLineSer: BidShiftlinesService,
    private headerTitleService: HeaderTitleService,
    private newBidScheduleSer: CreateNewBidScheduleService,
    private myBiddingSer: MyBiddingService,
    private bidWindowSer: BidWindowService,
    private timezoneSer: TimezoneService,
    public emailNotify: EmailNotificationsService,
    private getAllEmp: AddNewEmployeeService,
    private route: ActivatedRoute,
    private shiftDefSer: WorkLoadService,
    private fb: FormBuilder,
    private localData: LocalDataService
  ) {

    this.headerTitleService.setForwardUrl(straightlines_io_apis.apis.my_bidding);
    // this.headerTitleService.setBackUrl(straightlines_io_apis.apis.bidding);
    this.route.queryParams.subscribe(params => {
      this.completed_round_id = params.round
      this.skipRoundId = Number(params.skipRoundId)
      this.vactionExhausted = Number(params.vactionExhausted)
    })
    if (this.vactionExhausted != 0 && this.vactionExhausted != 1) {
      this.vactionExhausted = 0
    }
  }
  managerIds = []
  ngOnInit() {

    if (screen.availHeight < 600) {
      this.bid_summary_popup = 60
      this.bid_summary_popup_margin = 30
    } else if (screen.availHeight > 600 && screen.availHeight < 750) {
      this.bid_summary_popup = 60
      this.bid_summary_popup_margin = 100
    } else {
      this.bid_summary_popup_margin = 110
      this.bid_summary_popup = 100
    }

    if (this.completed_round_id == undefined || this.completed_round_id == null) {
      this.completed_round_id = 0
    } else {
      this.completed_round_id = Number(this.completed_round_id)
    }
    this.headerTitleService.setTitle('My Bidding');
    this.headerTitleService.setDefaultHeader(false);
    this.headerTitleService.setForwardUrl(null); this.headerTitleService.checkBiddingTime('')

    this.myBiddingSer.setTitle('step-1')
    this.user_data = JSON.parse(sessionStorage.getItem('userData'))
    this.managerIds.push(this.user_data.id)
    if (this.user_data.empid != undefined) {
      this.empID = this.user_data.empid
      this.userRole = 'emp'
    }
    if (this.user_data.bidmanagerid != null && this.user_data.bidmanagerid != undefined && this.user_data.bidmanagerid !=0) {
      this.managerIds.push(this.user_data.bidmanagerid)
      this.empID = this.user_data.bidmanagerid
      this.userRole = 'empbidManager'
    }
    this.headerTitleService.setBackUrl(this.user_data.role === 'emp' ? null : straightlines_io_apis.apis.bidding);


    this.managerid = this.user_data.id
    if (this.userRole == 'emp') {
      this.checkBidScheduleCompletionForBidManager = false
    } else {
      this.checkBidScheduleCompletionForBidManager = true
    }
    this.firstEnter = true
    this.footerState = IonPullUpFooterState.Collapsed;
    this.getAllNewBidSchedule()
    this.selectShiftLineForm = this.formBuilder.group({
      allShiftLine: this.formBuilder.array([]),
    });

    this.selectYearForm = this.formBuilder.group({
      year: new FormControl('select year'),
    });
    this.selectBidScheduleNameForm = this.formBuilder.group({
      bid_schedule_name: new FormControl('select bid schedule name'),
    });
    this.getTimeZone();
    // if (this.localData.getItem('myBiddingData')) {
    //   this.getCurrentBidSchedule();
    // }
  }

  get allShiftLine(): FormArray {
    return this.selectShiftLineForm.get("allShiftLine") as FormArray
  }
  get year() {
    return this.selectYearForm.get("year")
  }
  get bid_schedule_name() {
    return this.selectBidScheduleNameForm.get("bid_schedule_name")
  }
  
  bidShculeTimeZoneacronym = 'EST'
  currentBidScheduleStartDate = ''
  currentBidScheduleEndDate = ''
  checkBidScheduleCompletionForBidManager = false
  currentBidScheduletotalEmployee = 0
  getTimeZone() {
    this.timezoneSer.getAllTimeZone().subscribe((res) => {

      this.allTimeZone = res
      for (var i = 0; i < this.allTimeZone.length; i++) {
        if (this.bidShculeTimeZone == this.allTimeZone[i].location) {
          this.bidShculeTimeZoneacronym = this.allTimeZone[i].acronym
        }
      }
    }, (err) => {
      console.log(err)
      this.bidShculeTimeZoneacronym = 'EST'
    }, () => { })
  }

  getAllNewBidSchedule() {
    this.bid_schedule = []
    var count = 0
    if (this.userRole == "emp") {
      this.bidWindowSer.getBidscheduleDetailsBasedonEmpid(this.empID).subscribe((res) => {
        this.bid_schedule = res;
        this.getCurrentBidSchedule()
      }, (err) => {
        console.log(err)
        this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
      }, () => { })
    } else {
      
      for (var i = 0; i < this.managerIds.length; i++) {
        this.newBidScheduleSer.getAllBidScheduleData(this.managerIds[i]).subscribe((res) => {
          var temp
          temp = res
          for (var j = 0; j < temp.length; j++) {
            this.bid_schedule.push(temp[j])
          }
          count++
          if (count == this.managerIds.length) {
            this.bid_schedule = this.bid_schedule.filter((value, index, self) => index === self.findIndex((t) => (t.bidschid === value.bidschid)))
            this.getCurrentBidSchedule()
          }
        }, (err) => {
          console.log(err)
          this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
        }, () => { })
      }
    }
  }
  currentBidManagerIdforBidSchadule
  getCurrentBidSchedule() {
    // this.newBidScheduleSer.getAllBidScheduleData(this.user_data.id).subscribe((res)=>{
    //   this.bid_schedule=res
    if (this.bid_schedule?.length < 1) {
      this.spinner = false
      this.dailyEndTIme = undefined
      this.currentBidScheduleName = ''
      this.currentBidScheduletotalEmployee = 0
      this.currentBidScheduleStartDate = ''
      this.currentBidScheduleEndDate = ''
      this.currentBidScheduleRounds = 0
      this.currentBidManagerIdforBidSchadule = 0
    }

    this.all_bid_schedule = []
    for (var i = 0; i < this.bid_schedule.length; i++) {
      if (this.bid_schedule[i].schedulesavestatus == 1 && this.bid_schedule[i].roundsavestatus == 1 && this.bid_schedule[i].leavesavestatus == 1 && this.bid_schedule[i].roundmap.length > 0) {
        this.all_bid_schedule.push(this.bid_schedule[i])
      }
    }
    var checkShiftLineSchedule = JSON.parse(this.localData.getItem('myBiddingData'))
    if (this.all_bid_schedule.length > 0) {
      this.all_bid_schedule.sort((a, b) => { return b.bidschid - a.bidschid });
    }
    this.bid_schedule_length = this.all_bid_schedule.length
    if (this.all_bid_schedule.length > 0) {
      if (checkShiftLineSchedule != null || checkShiftLineSchedule != undefined) {
        this.selectBidScheduleNameForm.controls.bid_schedule_name.setValue(checkShiftLineSchedule.bid_schedule_name.bid_schedule_name)


        this.bid_schedule_length = this.all_bid_schedule.length
        for (var i = 0; i < this.all_bid_schedule.length; i++) {
          if (this.all_bid_schedule[i].bidschename == this.selectBidScheduleNameForm.value.bid_schedule_name) {
            this.bidShculeTimeZone = this.all_bid_schedule[i].timezone
            this.currentBidScheduleId = this.all_bid_schedule[i].bidschid
            this.slideOption.initialSlide = this.bidRound
            this.currentBidManagerIdforBidSchadule = this.all_bid_schedule[i].bidmanagerid
            this.currentBidScheduleName = this.all_bid_schedule[i].bidschename
            this.currentBidScheduletotalEmployee = this.all_bid_schedule[i].employeemap.length
            this.currentBidScheduleRounds = this.all_bid_schedule[i].roundmap.length
            var roundData
            roundData = this.all_bid_schedule[i].roundmap.sort((a, b) => { return Number(a.roundseq_id) - Number(b.roundseq_id) })
            this.currentBidScheduleStartDate = roundData[0].roundstartdate
            this.currentBidScheduleEndDate = roundData[roundData.length + - +1].roundenddate

          }
        }
      } else {
        this.currentBidScheduleId = this.all_bid_schedule[0].bidschid
        this.slideOption.initialSlide = 0
        this.bidShculeTimeZone = this.all_bid_schedule[0].timezone
        this.currentBidScheduleName = this.all_bid_schedule[0].bidschename
        this.currentBidScheduletotalEmployee = this.all_bid_schedule[0].employeemap.length
        var roundData
        this.currentBidManagerIdforBidSchadule = this.all_bid_schedule[0].bidmanagerid
        roundData = this.all_bid_schedule[0].roundmap.sort((a, b) => { return Number(a.roundseq_id) - Number(b.roundseq_id) });

        this.currentBidScheduleStartDate = roundData[0].roundstartdate
        this.currentBidScheduleEndDate = roundData[roundData.length + - +1].roundenddate
        this.currentBidScheduleRounds = this.all_bid_schedule[0].roundmap.length
        this.selectBidScheduleNameForm.controls.bid_schedule_name.setValue(this.all_bid_schedule[0].bidschename)
      }
      this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
      this.spinner = false
      if (this.userRole == 'emp') {
        this.getBidRoundData()

        this.checkBidScheduleStatus()
        this.changeBidScheduleNameForm()
        this.systemAssignShifts()
      } else {
        // this.getBidRoundData()
        this.checkBidScheduleStatus()
        // this.getBidRoundData()
        this.systemAssignShifts()
      }
    } else {
      // this.getBidRoundData()
      this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);

    }
    if (this.all_bid_schedule.length < 1) {
      this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
      this.passroundId.emit(0)
    }
    this.getBidRoundData()
    this.systemAssignShifts()
    this.getTimeZone()
    // },(err)=>{console.log(err)
    // this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
    // this.passroundId.emit(0)},()=>{})
    this.getAllShiftDefintionData()
  }

  allShift = []
  allShiftDef = []
  getAllShiftDefintionData() {
    this.shiftDefSer.getAllShiftDefinition(this.managerid).subscribe(
      (res) => {
        this.allShift = res;
        var user_all_shift = []
        for (var i = 0; i < this.allShift.length; i++) {
          if (Number(this.allShift[i].userid) == Number(this.managerid)) {
            var convertTimetoString: any = Array.from(this.allShift[i].sh_starttime)
            var sh_startTime = convertTimetoString[0] + convertTimetoString[1] + convertTimetoString[3] + convertTimetoString[4]
            var shift_name = this.allShift[i].sh_name
            user_all_shift.push({
              "startTime": sh_startTime,
              "shiftName": shift_name,
              "shift_duration": this.allShift[i].sh_duration,
              "shiftCategory": this.allShift[i].sh_category_id,
              "shift_created_by": this.allShift[i].sh_created_by,
              "sh_include_exclude": this.allShift[i].sh_include_exclude
            })
          }
        }
        for (var i = 0; i < this.default_work_load_data.length; i++) {
          user_all_shift.push({
            "startTime": this.default_work_load_data[i].startTime,
            "shiftName": this.default_work_load_data[i].shiftName,
            "shift_duration": this.default_work_load_data[i].shift_duration,
            "shiftCategory": this.default_work_load_data[i].shiftCategory,
            "shift_created_by": this.default_work_load_data[i].shift_created_by,
            "sh_include_exclude": this.default_work_load_data[i].sh_include_exclude
          })
        }
        this.allShiftDef = user_all_shift
      },

      (error: any) => {
        console.log(error)
        var user_all_shift = []
        for (var i = 0; i < this.default_work_load_data.length; i++) {
          user_all_shift.push({
            "startTime": this.default_work_load_data[i].startTime,
            "shiftName": this.default_work_load_data[i].shiftName,
            "shift_duration": this.default_work_load_data[i].shift_duration,
            "shiftCategory": this.default_work_load_data[i].shiftCategory,
            "shift_created_by": this.default_work_load_data[i].shift_created_by,
            "sh_include_exclude": this.default_work_load_data[i].sh_include_exclude
          })
        }
        this.allShiftDef = user_all_shift
      },
      () => {

      }
    );
  }


  convertNumber(m) {
    return Number(m)
  }

  ngOnDestroy() {
    this.bidSchedule = undefined
    if (this.intervalForUpdateStatus != null) {
      clearInterval(this.intervalForUpdateStatus)// Clear interval on page unmount
    }
    if (this.intervalForIncompleteStatus != null) {
      clearInterval(this.intervalForIncompleteStatus)// Clear interval on page unmount
    }
  }
  async continuet() {
    this.systemAssignShifts()
    var temp = {
      "bid_schedule_name": this.selectBidScheduleNameForm.value,
      "bid_round_data": this.currentSelectedRound,
      "currentBidScheduleId": this.currentBidScheduleId
    }

    // this.currentBidScheduleId=temp.bid_round_data.bidschref
    this.localData.setItem('myBiddingData', JSON.stringify(temp))
    this.localData.setItem('selectShiftLineForBidding', JSON.stringify(0))
    let navigationExtras: NavigationExtras = {
      queryParams: {
        bidId: this.currentBidScheduleId,
        round: this.finalViewBidWindowData.round + - +1,
        i: this.finalViewBidWindowData.empInitial,
        id: this.currentBidManagerIdforBidSchadule,
        eid: this.finalViewBidWindowData.default.empidref
      }
    };
    if (this.finalViewBidWindowData.vacationbidstatus == "Eligible") {
      if ((this.finalViewBidWindowData.round + - +1) > 0) {

        this.navCtrl.navigateForward(straightlines_io_apis.apis.select_bid_leave_option, navigationExtras)

      } else {
        this.bidWindowSer.getBidWindowDataBasedOnempId(this.finalViewBidWindowData.default.empidref).subscribe((res) => {
          var tempObj, tempArr = []
          tempArr = res
          for (var i = 0; i < tempArr.length; i++) {
            if (Number(this.bidSchedule.bidschid) == tempArr[i].bidschidref && tempArr[i].roundseq_id == 1) {
              tempObj = tempArr[i]
            }
          }
          this.bidWindowSer.checkShiflineBidding(this.currentBidScheduleId, this.finalViewBidWindowData.default.empidref, this.finalViewBidWindowData.round, tempObj.shiftlinebidstatus).subscribe((res) => {
            var temp
            temp = res
            if (temp == false) {

              this.navCtrl.navigateForward(straightlines_io_apis.apis.select_bid_leave_option, navigationExtras)
            } else {
              this.navCtrl.navigateForward(straightlines_io_apis.apis.selet_shift_line_bidding_bid_manager, navigationExtras)
            }
          }, (err) => { console.log(err) }, () => { })
        }, (err) => { console.log(err) }, () => { })

      }
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Bidding is already done',
        buttons: [{
          text: 'OK', handler: () => {
            this.ngOnInit()
          }
        }]
      });
      await alert.present();
    }

  }
  async next() {
    this.systemAssignShifts()
    clearInterval(this.intervalForUpdateStatus); clearInterval(this.intervalForIncompleteStatus)
    var temp = {
      "bid_schedule_name": this.selectBidScheduleNameForm.value,
      "bid_round_data": this.currentSelectedRound,
      "currentBidScheduleId": this.currentBidScheduleId
    }
    this.localData.setItem('myBiddingData', JSON.stringify(temp))
    this.localData.setItem('selectShiftLineForBidding', JSON.stringify(0))
  
    let navigationExtras: NavigationExtras = {
      queryParams: {
        bidId: this.currentBidScheduleId,
        id: this.currentBidManagerIdforBidSchadule,
        round: this.currentactiveRoundNumber,
      }
    };
    if (this.getVacationStatus == 'Eligible') {
      if (this.userRole != 'emp') {
        this.continuet()
      } else {
        if (this.currentactiveRoundNumber > 0) {
          this.navCtrl.navigateForward(straightlines_io_apis.apis.employee_bid_leave_option, navigationExtras)

        } else {
          this.bidWindowSer.getBidWindowDataBasedOnempId(this.user_data.empid).subscribe((res) => {
            var tempObj, tempArr = []
            tempArr = res
            for (var i = 0; i < tempArr.length; i++) {
              if (Number(this.bidSchedule.bidschid) == tempArr[i].bidschidref && tempArr[i].roundseq_id == 1 && tempArr[i].empidref == this.empID) {
                tempObj = tempArr[i]
              }
            }

            this.bidWindowSer.checkShiflineBidding(this.currentBidScheduleId, this.user_data.empid, Number(this.currentactiveRoundNumber) + + 1, tempObj.shiftlinebidstatus).subscribe((res) => {
              var temp
              temp = res

              if (temp == false) {

                this.navCtrl.navigateForward(straightlines_io_apis.apis.select_bid_leave_option, navigationExtras)
              } else {
                this.navCtrl.navigateForward(straightlines_io_apis.apis.selet_shift_line_bidding_employee, navigationExtras)
              }
            }, (err) => { console.log(err) }, () => { })
          }, (err) => { console.log(err) }, () => { })

        }
      }
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Bidding is already done',
        buttons: [{
          text: 'OK', handler: () => {
          }
        }]
      });
      await alert.present();
    }

  }
  
  checkActiveRound() {
    if (this.all_SBP_rounds.length > 0) {
      var temp, start, end, count = 0
      var defendDate, defStartDate; var num = 0, date, invdate, diff, updatedTimeZone
      temp = this.all_SBP_rounds
      for (var l = 0; l < temp.length; l++) {

        defStartDate = temp[l].empbid_start_time.split(" ")
        defendDate = temp[l].empbid_end_time.split(" ")
        start = new Date(Number(defStartDate[0].split("-")[0]), Number(defStartDate[0].split("-")[1]) + - +1, Number(defStartDate[0].split("-")[2]), Number(defStartDate[1].split(':')[0]), Number(defStartDate[1].split(':')[1]), 0)
        end = new Date(Number(defendDate[0].split("-")[0]), Number(defendDate[0].split("-")[1]) + - +1, Number(defendDate[0].split("-")[2]), Number(defendDate[1].split(':')[0]), Number(defendDate[1].split(':')[1]), 0)
        date = new Date();
        invdate = new Date(date.toLocaleString('en-US', {
          timeZone: this.bidShculeTimeZone
        }));
        diff = date.getTime() - invdate.getTime();


        updatedTimeZone = new Date(date.getTime() - diff)
        if (updatedTimeZone >= start) {
          if (updatedTimeZone > end) {
          } else {
            count++
            this.slideOption.initialSlide = l
            num = l
            this.bidRound = l
            this.getRoundData(temp[l], l)
          }
        }
      }
      if (count < 1) {
        this.slideOption.initialSlide = Number(this.completed_round_id)
        num = Number(this.completed_round_id)
        this.getRoundData(temp[Number(this.completed_round_id)], Number(this.completed_round_id))
      }

      if (this.firstEnter == false && num != undefined && this.slides != undefined) {
        this.slides.slideTo(num)
      }
    }
    this.firstEnter = false
  }

  checkBidStatus(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].shiftlinebidstatus === "Eligible" || data[i].vacationbidstatus === "Eligible") {
          this.bidding_status = 2; break;
      }
      this.bidding_status = 1
    }
  }

  checkBidScheduleStatus() {

    var sName = this.selectBidScheduleNameForm.value.bid_schedule_name
    var today, biddingStartDate, date, invdate, diff
    var tempArr = [], biddingendDate
    var maxDate
    this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.selectBidScheduleNameForm.value.bid_schedule_name).subscribe((res) => {
      var temp
      temp = res
      clearInterval(this.bidstatustimer)
      for (var i = 0; i < temp.length; i++) {
        if (this.bidSchedule.bidschid === temp[i].bidschidref) {
          tempArr.push(temp[i])
        }
      }

      if (tempArr.length > 0) {
        this.bidstatustimer = setInterval(() => {
          tempArr = tempArr.sort((a, b) => { return a.trans_seq_id - b.trans_seq_id })
          var start, end, s

          start = tempArr[0].empbid_start_time.split(" ")[0].split('-');
          s = tempArr[0].empbid_start_time.split(" ")[1].split(":")
          biddingStartDate = new Date(start[0], Number(start[1]) + - +1, start[2], s[0], s[1], s[2]);

          date = new Date();
          invdate = new Date(date.toLocaleString('en-US', {
            timeZone: this.bidShculeTimeZone
          }));
          diff = date.getTime() - invdate.getTime();
          today = new Date(date.getTime() - diff)
          var e
          end = tempArr[tempArr.length + - +1].empbid_end_time.split(" ")[0].split('-');
          e = tempArr[tempArr.length + - +1].empbid_end_time.split(" ")[1].split(":")
          maxDate = new Date(end[0], Number(end[1]) + - +1, end[2], e[0], e[1], e[2]);
          if (today.getTime() < biddingStartDate.getTime()) {
            this.bidding_status = 0
          } else if (today.getTime() > biddingStartDate.getTime()) {
            if (today.getTime() < maxDate.getTime()) {
              this.checkBidStatus(tempArr);
            } else {
              this.bidding_status = 1
            }
          } else {
            this.checkBidStatus(tempArr);
          }
        }, 1000)

      }
    }, (err) => { console.log(err) }, () => { })

  }
  bidstatustimer
  currentBidScheduleName = ''
  currentBidScheduleRounds = 0
  changeBidScheduleNameForm() {
    this.distance = 0
    clearInterval(this.tinterval);
    clearInterval(this.interval)
    clearInterval(this.tinterval);
    clearInterval(this.interval)
    clearInterval(this.intervalForIncompleteStatus)
    clearInterval(this.intervalForUpdateStatus)
    clearInterval(this.timerOpenInterval)
    clearInterval(this.bidstatustimer)

    this.distance = 0
    this.finalViewBidWindowData = undefined
    if (this.userRole == 'emp') {
      this.all_SBP_rounds = []
      this.def_all_SBP_rounds = []
      if (this.selectBidScheduleNameForm.value.bid_schedule_name === 'select bid schedule name') {
        this.all_SBP_rounds = []
        this.currentBidScheduleName = ''
        this.currentBidScheduleRounds = 0
        this.bid_schedule_length = 0
        this.dailyEndTIme = undefined
        this.currentBidScheduleName = ''
        this.currentBidScheduletotalEmployee = 0
        this.currentBidScheduleStartDate = ''
        this.currentBidScheduleEndDate = ''
        this.currentBidScheduleRounds = 0
      } else {

        this.bid_schedule_length = this.all_bid_schedule.length
        for (var i = 0; i < this.all_bid_schedule.length; i++) {
          if (this.all_bid_schedule[i].bidschename == this.selectBidScheduleNameForm.value.bid_schedule_name) {
            this.currentBidScheduleId = this.all_bid_schedule[i].bidschid
            this.bidShculeTimeZone = this.all_bid_schedule[i].timezone
            this.slideOption.initialSlide = 0
            this.all_SBP_rounds = this.all_bid_schedule[i].roundmap
            this.def_all_SBP_rounds = this.all_bid_schedule[i].roundmap
            this.currentBidScheduleName = this.all_bid_schedule[i].bidschename
            this.currentBidScheduletotalEmployee = this.all_bid_schedule[i].employeemap.length
            this.currentBidManagerIdforBidSchadule = this.all_bid_schedule[i].bidmanagerid

            this.currentBidScheduleRounds = this.all_bid_schedule[i].roundmap.length
            this.dailyEndTIme = this.all_bid_schedule[i].roundmap[0].roundendttime
            this.dailyStartTIme = this.all_bid_schedule[i].roundmap[0].roundstarttime
            var roundData
            roundData = this.all_bid_schedule[i].roundmap.sort((a, b) => { return Number(a.roundseq_id) - Number(b.roundseq_id) })
            this.currentBidScheduleStartDate = roundData[0].roundstartdate
            this.currentBidScheduleEndDate = roundData[roundData.length + - +1].roundenddate

          }
        }

        var temp = {
          "bid_schedule_name": this.selectBidScheduleNameForm.value,
          "bid_round_data": this.currentSelectedRound,
          "currentBidScheduleId": this.currentBidScheduleId
        }
        this.localData.setItem('myBiddingData', JSON.stringify(temp))
        this.localData.setItem('selectShiftLineForBidding', JSON.stringify(0))
        this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);

        if (this.openClose == "animate bottom move") {
          this.openClose = "animate bottom"
        }
        clearInterval(this.tinterval);
        clearInterval(this.interval)
        clearInterval(this.tinterval);
        clearInterval(this.interval)
        this.checkBidScheduleStatus()
        this.getBidRoundData()
        this.bidSummaryData()

        // this.systemAssignShifts()
      }
    } else {
      this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
      if (this.selectBidScheduleNameForm.value.bid_schedule_name === 'select bid schedule name') {
        this.all_SBP_rounds = []
        this.currentBidScheduleName = ''
        this.currentBidScheduleRounds = 0
        this.bid_schedule_length = 0
        this.dailyEndTIme = undefined
        this.currentBidScheduleName = ''
        this.currentBidScheduletotalEmployee = 0
        this.currentBidScheduleStartDate = ''
        this.currentBidScheduleEndDate = ''
        this.currentBidScheduleRounds = 0
      } else {
        this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);
        this.bid_schedule_length = this.all_bid_schedule.length
        for (var i = 0; i < this.all_bid_schedule.length; i++) {
          if (this.all_bid_schedule[i].bidschename == this.selectBidScheduleNameForm.value.bid_schedule_name) {
            this.currentBidScheduleId = this.all_bid_schedule[i].bidschid
            this.bidShculeTimeZone = this.all_bid_schedule[i].timezone
            this.currentBidScheduleName = this.all_bid_schedule[i].bidschename
            this.currentBidScheduletotalEmployee = this.all_bid_schedule[i].employeemap.length
            this.currentBidScheduleRounds = this.all_bid_schedule[i].roundmap.length
            this.currentBidManagerIdforBidSchadule = this.all_bid_schedule[i].bidmanagerid
            var roundData
            roundData = this.all_bid_schedule[i].roundmap.sort((a, b) => { return Number(a.roundseq_id) - Number(b.roundseq_id) })
            this.currentBidScheduleStartDate = roundData[0].roundstartdate
            this.currentBidScheduleEndDate = roundData[roundData.length + - +1].roundenddate

            this.slideOption.initialSlide = 0
            this.all_SBP_rounds = this.all_bid_schedule[i].roundmap
            this.def_all_SBP_rounds = this.all_bid_schedule[i].roundmap
          }
        }
        if (this.bidSchedule != undefined) {
          if (this.bidSchedule.bidschid != undefined) {
            this.checkBidScheduleStatus()
            this.getBidRoundData()
          }
        }

        // this.systemAssignShifts()
        clearInterval(this.tinterval);
        clearInterval(this.interval)
        clearInterval(this.tinterval);
        clearInterval(this.interval)
        clearInterval(this.intervalForUpdateStatus)
      }
    }
    this.systemAssignShifts();
    this.getTimeZone()

  }
  getBidRoundData() {
    if (this.userRole == 'emp') {
      this.bidWindowSer.getBidWindowDataBasedOnempId(this.user_data.empid).subscribe((res) => {
        var temp
        temp = res
        var tempObj
        this.allBidRoundData = []
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].bidschidref === this.currentBidScheduleId) {
            this.allBidRoundData.push(temp[i])
          }
        }
        this.all_SBP_rounds = this.allBidRoundData
        this.all_SBP_rounds_length = this.all_SBP_rounds.length
        if (this.all_SBP_rounds_length > 0) {

          this.checkActiveRound()
        }
      }, (err) => { console.log(err) }, () => { })
    } else {
      this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.selectBidScheduleNameForm.value.bid_schedule_name).subscribe((res) => {
        var temp
        temp = res
        this.all_window_data = []
        for (var i = 0; i < temp.length; i++) {
          if (this.bidSchedule != undefined) {
            if (this.bidSchedule.bidschid != undefined) {
              if (this.bidSchedule.bidschid === temp[i].bidschidref) {
                this.all_window_data.push(temp[i])
              }
            }
          }
        }


        if (this.bidSchedule != undefined) {
          this.getCurrentEmpData(0)
        }

      }, (err) => { console.log(err) }, () => { })
    }
  }
  finalViewBidWindowData = undefined
  startRoundButton = 'Start Round'
  dailyEndTIme = undefined
  dailyStartTIme = undefined
  getCurrentEmpData(i) {
    var temp

    this.dailyEndTIme = this.bidSchedule.roundmap[0].roundendttime
    this.dailyStartTIme = this.bidSchedule.roundmap[0].roundstarttime
    temp = this.all_window_data

    var start, end
    var tempOne = []
    if (this.userRole == 'empbidManager' && this.currentBidManagerIdforBidSchadule != this.user_data.id) {
      var id = this.user_data.empid
      var newArray = temp.filter((el) => {
        return el.empidref == id;
      }
      );

      clearInterval(this.interval)
      clearInterval(this.tinterval);
      temp = newArray
      clearInterval(this.interval)
      clearInterval(this.tinterval);
    }
    this.distance = 0
    clearInterval(this.interval)
    clearInterval(this.tinterval);
    var updatedTimeZone, invdate, diff, date
    for (var l = 0; l < temp.length; l++) {
      // if(temp[l].vacationbidstatus=='Eligible'){
      var defendDate, defStartDate;
      defStartDate = temp[l].empbid_start_time.split(" ")
      defendDate = temp[l].empbid_today_time ? temp[l].empbid_today_time.split(" ") : temp[l].empbid_end_time.split(" ");

      start = new Date(Number(defStartDate[0].split("-")[0]), Number(defStartDate[0].split("-")[1]) + - +1, Number(defStartDate[0].split("-")[2]), Number(defStartDate[1].split(':')[0]), Number(defStartDate[1].split(':')[1]), 0)
      end = new Date(Number(defendDate[0].split("-")[0]), Number(defendDate[0].split("-")[1]) + - +1, Number(defendDate[0].split("-")[2]), Number(defendDate[1].split(':')[0]), Number(defendDate[1].split(':')[1]), 0)
      date = new Date();
      invdate = new Date(date.toLocaleString('en-US', {
        timeZone: this.bidShculeTimeZone
      }));
      diff = date.getTime() - invdate.getTime();
      updatedTimeZone = new Date(date.getTime() - diff)
      if (updatedTimeZone >= start) {
        if (updatedTimeZone > end) {
        } else {
          this.roundStatus = "Open"

          clearInterval(this.interval);
          clearInterval(this.tinterval);
          console.log(this.bidSchedule)
          this.timer(end, this.bidSchedule.roundmap[0].roundendttime)

          this.finalViewBidWindowData = {
            "vacationbidstatus": temp[l].vacationbidstatus, "shiftlinebidstatus": temp[l].shiftlinebidstatus,
            "id": l, "startTime": start, "status": 1, "dailyendTIme": this.bidSchedule.roundmap[0].roundendttime, "endTime": end, "empName": temp[l].fname + ' ' + temp[l].lname, "empInitial": temp[l].initials, "round": temp[l].roundseq_id, "rank": temp[l].rank, "default": temp[l]
          }
        }
      }

    }
    if (this.finalViewBidWindowData != undefined) {
      var ntempObj = this.finalViewBidWindowData.default

      if (ntempObj.roundseq_id == 1) {
        this.bidWindowSer.checkShiflineBidding(ntempObj.bidschidref, ntempObj.empidref, ntempObj.roundseq_id, ntempObj.shiftlinebidstatus).subscribe((res) => {
          var btemp
          btemp = res
          if (btemp == false) {
            this.startRoundButton = 'Continue'
          } else {
            this.startRoundButton = 'Start Round'
          }
        }, (err) => { console.log(err) }, () => { })
      } else {
        this.startRoundButton = 'Start Round'
      }
      // }
    }
    if (this.finalViewBidWindowData == undefined) {
      this.passroundId.emit(0)
    } else {
      this.passroundId.emit(Number(this.finalViewBidWindowData.round) + - +1)
    }
    if (this.loadingfinal != undefined) {
      this.loadingfinal.dismiss()
    }
    this.spinner = false
    this.interval = setInterval(() => {
      for (var l = 0; l < temp.length; l++) {
        // if(temp[l].vacationbidstatus=='Eligible'){
        var defStartDate = temp[l].empbid_start_time.split(" ")
        var defendDate = temp[l].empbid_today_time ? temp[l].empbid_today_time.split(" ") : temp[l].empbid_end_time.split(" ");
        start = new Date(Number(defStartDate[0].split("-")[0]), Number(defStartDate[0].split("-")[1]) + - +1, Number(defStartDate[0].split("-")[2]), Number(defStartDate[1].split(':')[0]), Number(defStartDate[1].split(':')[1]), 0)
        end = new Date(Number(defendDate[0].split("-")[0]), Number(defendDate[0].split("-")[1]) + - +1, Number(defendDate[0].split("-")[2]), Number(defendDate[1].split(':')[0]), Number(defendDate[1].split(':')[1]), 0)
        date = new Date();
        invdate = new Date(date.toLocaleString('en-US', {
          timeZone: this.bidShculeTimeZone
        }));
        diff = date.getTime() - invdate.getTime();
        updatedTimeZone = new Date(date.getTime() - diff)
        if (updatedTimeZone >= start) {
          if (updatedTimeZone > end) {
          } else {

            this.roundStatus = "Open"
            clearInterval(this.interval);
            clearInterval(this.tinterval);

            if (this.bidSchedule != undefined) {
              this.timer(end, this.bidSchedule.roundmap[0].roundendttime)
            }
            if (this.bidSchedule != undefined) {
              this.finalViewBidWindowData = { "id": l, "startTime": start, "status": 1, "dailyendTIme": this.bidSchedule.roundmap[0].roundendttime, "endTime": end, "empName": temp[l].fname + ' ' + temp[l].lname, "empInitial": temp[l].initials, "round": temp[l].roundseq_id, "rank": temp[l].rank, "default": temp[l], "vacationbidstatus": temp[l].vacationbidstatus, "shiftlinebidstatus": temp[l].shiftlinebidstatus }
            }
          }
        }
      }
      if (this.finalViewBidWindowData != undefined) {
        var ntempObj = this.finalViewBidWindowData.default
        if (ntempObj.roundseq_id == 1) {
          this.bidWindowSer.checkShiflineBidding(ntempObj.bidschidref, ntempObj.empidref, ntempObj.roundseq_id, ntempObj.shiftlinebidstatus).subscribe((res) => {
            var btemp
            btemp = res
            if (btemp == false) {
              this.startRoundButton = 'Continue'
            } else {
              this.startRoundButton = 'Start Round'
            }
          }, (err) => { console.log(err) }, () => { })
        } else {
          this.startRoundButton = 'Start Round'
        }
      }
      // }
    }, 5000);


    if (this.finalViewBidWindowData != undefined && this.finalViewBidWindowData != null && this.finalViewBidWindowData != '') {

      this.bidSummaryData()
    }
    console.log('final==', this.finalViewBidWindowData);


  }
  startRoundButtonEmp = 'Start Round'

  getRoundData(all_SBP_rounds, j) {
    clearInterval(this.timerOpenInterval)
    this.passBidScheduleName.emit(this.selectBidScheduleNameForm.value.bid_schedule_name);

    this.currentactiveRoundNumber = j
    this.getVacationStatus = all_SBP_rounds.vacationbidstatus
    this.currentSelectedRound = all_SBP_rounds
    var defStartDate = this.currentSelectedRound.empbid_start_time.split(" ")
    var defendDate = this.currentSelectedRound.empbid_today_time ? this.currentSelectedRound.empbid_today_time.split(" ") :this.currentSelectedRound.empbid_end_time.split(" ");

    this.shiftlinebidstatus = this.currentSelectedRound.shiftlinebidstatus
    this.vacationbidstatus = this.currentSelectedRound.vacationbidstatus
    var start = defStartDate[0].split("-");
    var start_Date = new Date(start[0], Number(start[1]) + - +1, start[2], 0, 0, 0);
    this.roundStartTime = defStartDate[1]
    this.roundStartDate = start_Date
    this.roundDuration = this.currentSelectedRound.empbidduration.split(":")
    this.roundDuration = Number(this.roundDuration[1]) + + + Number(this.roundDuration[0]) * 60
    var roundStartTime = this.roundStartTime.split(":")
    var start = defStartDate[0].split("-");
    var roundstartDate = new Date(start[0], Number(start[1]) + - +1, Number(start[2]), Number(roundStartTime[0]), Number(roundStartTime[1]), 0);
    var end = defendDate[0].split("-");
    var endTIme = defendDate[1].split(":")
    var roundendDate = new Date(end[0], Number(end[1]) + - +1, Number(end[2]), Number(endTIme[0]), Number(endTIme[1]), 0);
    var today, date, invdate, diff
    date = new Date();
    invdate = new Date(date.toLocaleString('en-US', {
      timeZone: this.bidShculeTimeZone
    }));
    diff = date.getTime() - invdate.getTime();
    today = new Date(date.getTime() - diff)
    if (today < roundstartDate) {
      this.roundStatus = "Closed"
      this.passroundId.emit(this.completed_round_id)
      clearInterval(this.interval);
      clearInterval(this.tinterval);

      this.distance = 1

      this.startRoundButtonEmp = 'Start Round'
      clearInterval(this.timerOpenInterval)
      this.checktimer(this.currentSelectedRound, this.currentactiveRoundNumber)
      this.minutes = this.roundDuration
      this.seconds = '00'
    } else {
      if (today < roundendDate) {

        this.roundStatus = "Open"

        clearInterval(this.interval);
        clearInterval(this.tinterval);

        this.passroundId.emit(this.currentactiveRoundNumber)
        this.timer(roundendDate, this.bidSchedule.roundmap[0].roundendttime)
        this.bidWindowSer.getBidWindowDataBasedOnempId(this.user_data.empid).subscribe((res) => {
          var ntempObj, ntempArr = []
          ntempArr = res
          for (var i = 0; i < ntempArr.length; i++) {
            if (Number(this.bidSchedule.bidschid) == ntempArr[i].bidschidref && ntempArr[i].roundseq_id == Number(this.currentactiveRoundNumber) + + +1) {
              ntempObj = ntempArr[i]
            }
          }

          if (ntempObj.roundseq_id == 1) {
            this.bidWindowSer.checkShiflineBidding(ntempObj.bidschidref, ntempObj.empidref, ntempObj.roundseq_id, ntempObj.shiftlinebidstatus).subscribe((res) => {
              var btemp
              btemp = res
              if (btemp == false) {
                this.startRoundButtonEmp = 'Continue'
              } else {
                this.startRoundButtonEmp = 'Start Round'
              }
            }, (err) => { console.log(err) }, () => { })
          } else {
            this.startRoundButtonEmp = 'Start Round'
          }
        }, (err) => { console.log(err) }, () => { })
      } else {

        this.distance = 0
        this.roundStatus = "Closed"
        this.passroundId.emit(this.completed_round_id)
      }
    }
    this.spinner = false
  }
  checktimer(all_SBP_rounds, j) {
    this.timerOpenInterval = setInterval(() => {
      this.getRoundData(all_SBP_rounds, j)
    }, 100)
  }
  tinterval
  timer(roundendDate, dailyendTIme) {
    var countDownDate;
    var today, date, invdate, diff;
    var hours: string | number = '00';
    var minutes: string | number = '00';
    var seconds: string | number = '00';
    var i = 0;
    var self = this;
    this.tinterval = setInterval(function () {
      date = new Date();
      invdate = new Date(date.toLocaleString('en-US', {
        timeZone: self.bidShculeTimeZone
      }));
      diff = date.getTime() - invdate.getTime();
      today = new Date(date.getTime() - diff)
      if (new Date().getDate() != roundendDate.getDate()) {
        if (roundendDate.getTime() < invdate.getTime()) {
          countDownDate = new Date(invdate.getFullYear(), invdate.getMonth(), invdate.getDate(), Number(dailyendTIme.split(':')[0]), Number(dailyendTIme.split(':')[1]), 0).getTime()
         
        } else {
          countDownDate = new Date(invdate.getFullYear(), invdate.getMonth(), invdate.getDate() + + + 1, Number(dailyendTIme.split(':')[0]), Number(dailyendTIme.split(':')[1]), 0).getTime()
        }
      } else {
        var date = new Date();

          // Set the desired time
          date.setHours(dailyendTIme.split(':')[0]);
          date.setMinutes(dailyendTIme.split(':')[1]);
          date.setSeconds(dailyendTIme.split(':')[2]);


        countDownDate = date.getTime();
      }
      var now = today.getTime();
      self.distance = countDownDate - now;
      // self.distance = -1;
      // self.distance = -1;
      if (self.distance < 0) {
        clearInterval(self.tinterval);
        self.minutes = '00';
        self.seconds = '00';
        self.hours = '00';
        self.systemAssignShifts();
        if (self.user_data.empid == undefined) {
          self.getBidRoundData();
        }
        self.roundStatus = "Closed";
        return;
      }
      seconds = Math.floor((self.distance % (1000 * 60)) / 1000);
      if (seconds < 10) {
        self.seconds = '0' + seconds.toString();
      } else {
        self.seconds = seconds.toString();
      }
      
      if (self.distance >= (1000 * 60)) {
        self.hours = "00";
        minutes = Math.floor((self.distance % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes < 10) {
          self.minutes = '0' + minutes.toString();
        } else {
          self.minutes = minutes.toString();
        }
        if (self.distance >= (1000 * 60 * 60)) {
          hours = Math.floor(self.distance / (1000 * 60 * 60));
          if (hours < 10) {
            self.hours = '0' + hours.toString();
          } else {
            self.hours = hours.toString();
          }
        }
      } else {
        self.minutes = '00';
      }
      self.headerTitleService.checkBiddingEndDate(self.hours + ':' + self.minutes + ':' + self.seconds);
    }, 1000);
  }

  formatAMPM(date) {
    var hours = date.split(':')[0];
    var minutes = date.split(':')[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = Number(hours) % 12;
    hours = Number(hours) ? Number(hours) : 12; // the hour '0' should be '12'
    hours = Number(hours) < 10 ? '0' + Number(hours) : Number(hours);
    minutes = Number(minutes) < 10 ? '0' + Number(minutes) : Number(minutes);
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  myFunction() {
    this.showPopUp
    this.checkClickForPopup = true
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    var slide = document.getElementById("ion-slides");
    // if(popup.classList.contains("ion-slides")==false){
    slide.classList.toggle("update-slide");
    // }
    if (this.oldPopupId != undefined) {
      var popupStatus = document.getElementById("popupStatus" + this.oldPopupId);
      if (popupStatus != null) {
        if (popupStatus.classList.contains("showStatus") == true) {
          popupStatus.classList.toggle("showStatus");
        }
      }
      this.oldPopupId = undefined
    }

  }
  oldPopupId
  oldPopupIdForBidSummary
  myFunctionStatus(i) {
    this.showPopUp
    this.checkClickForPopup = true


    var popup = document.getElementById("popupStatus" + i);
    popup.classList.toggle("showStatus");
    if (this.oldPopupId != undefined) {
      var popupOne = document.getElementById("popupStatus" + this.oldPopupId);
      if (popupOne != null) {
        if (popupOne.classList.contains("showStatus") == true) {
          popupOne.classList.toggle("showStatus");
        }
      }
    }
    var popupStatus = document.getElementById("myPopup");
    if (popupStatus != null) {
      if (popupStatus.classList.contains("show") == true) {
        popupStatus.classList.toggle("show");
      }
    }
    var popupBS = document.getElementById("myPopupIndex" + this.oldPopupIdForBidSummary);
    if (popupBS != null) {
      if (popupBS.classList.contains("showIndex") == true) {
        popupBS.classList.toggle("showIndex");
      }
    }
    if (this.oldPopupId == i) {
      this.oldPopupId = undefined
    } else {
      this.oldPopupId = i
    }

  }
  updateCss() {
    if (this.checkClickForPopup == false) {
      var popup = document.getElementById("myPopup");
      if (popup != null) {
        if (popup.classList.contains("show") == true) {
          popup.classList.toggle("show");
        }
      }
      if (this.oldPopupIdForBidSummary != null) {
        var popupBS = document.getElementById("myPopupIndex" + this.oldPopupIdForBidSummary);
        if (popupBS != null) {
          if (popupBS.classList.contains("showIndex") == true) {
            popupBS.classList.toggle("showIndex");
          }
        }
      }
      if (this.oldPopupId != undefined) {
        var popupStatus = document.getElementById("popupStatus" + this.oldPopupId);
        if (popupStatus != null) {
          if (popupStatus.classList.contains("showStatus") == true) {
            popupStatus.classList.toggle("showStatus");
          }
        }
        this.oldPopupId = undefined
      }

      var slide = document.getElementById("ion-slides");
      if (slide != null) {
        if (slide.classList.contains("update-slide") == true) {
          slide.classList.toggle("update-slide");
        }
      }
    }

    this.checkClickForPopup = false
  }
  
  footerState
  footerExpanded() { }
  toggleFooter() {

    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }
  footerCollapsed() { }
 
  schedule(id) {
    if (id == 0) {
      this.slides.slideTo(id)
      this.bidRound = 0
    } else if (id == 1) {
      this.slides.slideTo(id)
      this.bidRound = 1
    } else if (id == 2) {
      this.slides.slideTo(id)
      this.bidRound = 2
    }
  }
  bidSummaryData() {
    if (this.userRole != 'emp') {
      this.currentBidScheduleId = this.finalViewBidWindowData.default.bidschidref
    }
    if (this.selectBidScheduleNameForm.value.bid_schedule_name === 'select bid schedule name') {
      this.all_SBP_rounds = []
      this.bid_schedule_length = 0
    } else {
      this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.currentBidScheduleId).subscribe((res) => {
        var temp = res
        this.bidSchedule = res
        if (this.userRole != 'emp') {
          if (this.finalViewBidWindowData != undefined) {
            this.getAllShiftLineSchedule()
          }
        } else {
          this.getAllShiftLineSchedule()
        }
      }, (err) => { console.log(err) }, () => { })
    }
  }
  getAllShiftLineSchedule() {
    this.shiftLinesSchedule = new Array()
    for (var i = 0; i < this.bidSchedule.shiftdefmap.length; i++) {
      this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res) => {
        this.shiftlineScheduleData = res[0]

        this.shiftLinesSchedule.push(this.shiftlineScheduleData)
        this.convertArrayData()
      }, (err) => { console.log(err) }, () => { })
    }
  }
  convertArrayData() {
    var tempArr = new Array()
    tempArr = this.shiftLinesSchedule
    this.all_final_data = new Array()
    for (var i = 0; i < tempArr.length; i++) {
      for (var j = 0; j < this.bidSchedule.shiftdefmap.length; j++) {
        if (tempArr[i].sh_schedule_id === this.bidSchedule.shiftdefmap[j].shiftdefref) {
          var temp = {
            "schedulename": tempArr[i].schedulename,
            "bidschedulestartdate": this.bidSchedule.shiftdefmap[j].shiftdefstartdate,
            "bidscheduleenddate": this.bidSchedule.shiftdefmap[j].shiftdefenddate,
            "shiftdefref": this.bidSchedule.shiftdefmap[j].shiftdefref,
            "bidschid": this.bidSchedule.bidschid,
          }
          this.all_final_data.push(temp)
        }
      }
    }
    if (this.all_final_data.length === this.bidSchedule.shiftdefmap.length) {
      if (this.bidSchedule != undefined) {
        if (this.bidSchedule.bidschid != undefined) {
          this.getShiftLines()
        }
      }
    }
  }
  getShiftLines() {
    var empID
    if (this.userRole == 'emp') {
      empID = this.user_data.empid
    } else {
      empID = this.finalViewBidWindowData.default.empidref
    }
    this.bidShiftLineSer.getBidShiftlinesDataBasedOnEmpid(empID).subscribe((res) => {
      var temp
      temp = res

      var tempObj, tempArr = []
      this.bid_summary = []
      if (temp.length > 0) {
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].bidschidref === this.currentBidScheduleId) {
            for (var j = 0; j < this.all_final_data.length; j++) {
              if (temp[i].schedulename === this.all_final_data[j].schedulename) {
                this.bid_summary.push({
                  "schedulename": temp[i].schedulename,
                  "startDate": this.all_final_data[j].bidschedulestartdate,
                  "endDate": this.all_final_data[j].bidscheduleenddate,
                  "currentBidManagerIdforBidSchadule": this.currentBidManagerIdforBidSchadule,
                  "shiftline": this.getshiflineName(temp[i].shiftlineidref, temp[i].shiftidref),
                  "shiftlineScheduleID": temp[i].shiftidref,
                  "shiftData": this.getshiflineData(temp[i].shiftlineidref, temp[i].shiftidref),
                  "getSeqId": this.getshiflineSeq(temp[i].shiftlineidref, temp[i].shiftidref) + + +1,
                  "roundseq_id": temp[i].roundseq_id,
                  "shiftlineidref": temp[i].shiftlineidref
                })
              }
            }
          }
        }
      } else {
        for (var j = 0; j < this.all_final_data.length; j++) {
          this.bid_summary.push({
            "schedulename": this.all_final_data[j].schedulename,
            "startDate": this.all_final_data[j].bidschedulestartdate,
            "endDate": this.all_final_data[j].bidscheduleenddate,
            "currentBidManagerIdforBidSchadule": this.currentBidManagerIdforBidSchadule,
            "shiftline": 'Not Selected',
            "shiftData": '--',
            "getSeqId": '',
            "roundseq_id": 1
          })
        }
      }
      if (this.bid_summary.length < 1) {
        for (var j = 0; j < this.all_final_data.length; j++) {
          this.bid_summary.push({
            "schedulename": this.all_final_data[j].schedulename,
            "startDate": this.covertDate(this.all_final_data[j].bidschedulestartdate),
            "endDate": this.covertDate(this.all_final_data[j].bidscheduleenddate),
            "shiftline": 'Not Selected',
            "currentBidManagerIdforBidSchadule": this.currentBidManagerIdforBidSchadule,
            "shiftData": '--',
            "getSeqId": '',
            "roundseq_id": 1
          })
        }
      }
      this.bid_summary = this.bid_summary.sort(function (a, b) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      })
      this.bid_summary = this.bid_summary.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.schedulename === value.schedulename && t.shiftline === value.shiftline && t.shiftData === value.shiftData && t.getSeqId === value.getSeqId
        ))
      )
      if (this.userRole != 'emp') {
        this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.selectBidScheduleNameForm.value.bid_schedule_name).subscribe((res) => {
          var temp
          temp = res
          tempArr = []
          var empID
          if (this.userRole == 'emp') {
            empID = this.user_data.empid
          } else {
            empID = this.finalViewBidWindowData.default.empidref
          }
          for (var i = 0; i < temp.length; i++) {
            if (this.bidSchedule.bidschid === temp[i].bidschidref && empID == temp[i].empidref) {
              tempArr.push(temp[i])
            }
          }
          tempArr = tempArr.sort((a, b) => { return a.trans_seq_id - b.trans_seq_id })
          this.all_SBP_rounds = tempArr
          if (this.bidSchedule != undefined) {
            if (this.bidSchedule.bidschid != undefined) {
              this.getVacationBidSummary()
            }
          }
        }, (err) => { console.log(err) }, () => { })
      } else {
        if (this.bidSchedule != undefined) {
          if (this.bidSchedule.bidschid != undefined) {
            this.getVacationBidSummary()
          }
        }
      }
    }, (err) => { console.log(err) }, () => { })
  }
  vacationBidSummary = []
  getVacationBidSummary() {
    this.vacationBidSummary = []
    for (var i = 0; i < this.all_SBP_rounds.length; i++) {
      // if(this.all_SBP_rounds[i].vacationbidstatus=="Skipped" || this.all_SBP_rounds[i].vacationbidstatus=="Manager Skipped"){
      var tempObj = {
        "bidschename": this.all_SBP_rounds[i].bidschename,
        "bidschidref": this.all_SBP_rounds[i].bidschidref,
        "bidstatus": this.all_SBP_rounds[i].vacationbidstatus,
        "empidref": this.all_SBP_rounds[i].empidref,
        "initials": this.all_SBP_rounds[i].initials,
        "roundseq_id": this.all_SBP_rounds[i].roundseq_id,
        "vacationenddate": '',
        "vacationid": '',
        "vacationstartdate": '',
        "rdos": 0,
        "shift_vacation_hours": 0,
        "vcationhours": 0,
        "windowstatus": ''
      }
      this.vacationBidSummary.push(tempObj)
    }


    this.totalVacationHours = 0
    this.totalRdos = 0
    this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(Number(this.currentBidScheduleId)).subscribe((res) => {
      var temp = [], tempArr = []
      temp = res
      var empID
      if (this.userRole == 'emp') {
        empID = this.user_data.empid
      } else {
        empID = this.finalViewBidWindowData.default.empidref
      }
      var tempArrTwo = []
      for (var v = 0; v < temp.length; v++) {
        if (empID == temp[v].empidref) {
          tempArr.push(temp[v])
        }
      }
      var tempArrValue = []
      var date
      var max, min
      for (var x = 0; x < this.all_SBP_rounds.length; x++) {
        tempArrTwo = [], tempArrValue = []
        for (var w = 0; w < tempArr.length; w++) {
          if (Number(tempArr[w].roundseq_id) == (x + + +1) && tempArr[w].vacationstartdate != null && tempArr[w].vacationenddate != null) {
            date = new Date(Number(tempArr[w].vacationstartdate.split('-')[0]), Number(tempArr[w].vacationstartdate.split('-')[1]) + -+1, Number(tempArr[w].vacationstartdate.split('-')[2]), 0, 0, 0);
            tempArrValue.push(tempArr[w])
            tempArrTwo.push(date)
            date = new Date(Number(tempArr[w].vacationenddate.split('-')[0]), Number(tempArr[w].vacationenddate.split('-')[1]) + -+1, Number(tempArr[w].vacationenddate.split('-')[2]), 0, 0, 0);
            tempArrTwo.push(date)
          }
        }
        max = (new Date(Math.max.apply(null, tempArrTwo)));
        min = (new Date(Math.min.apply(null, tempArrTwo)));

        var tempArray = []
        tempArrValue = tempArrValue.sort(function (a, b) {

          return new Date(a.vacationstartdate).getTime() - new Date(b.vacationstartdate).getTime();
        })
        if (tempArrValue.length > 0) {
          var tempObj, totalVacationBasedOnAround = 0
          for (var l = 0; l < tempArrValue.length; l++) {
            totalVacationBasedOnAround = totalVacationBasedOnAround + + +tempArrValue[l].vcationhours
            tempArray.push({ "vacationstartdate": new Date(Number(tempArrValue[l].vacationstartdate.split('-')[0]), Number(tempArrValue[l].vacationstartdate.split('-')[1]) + -+1, Number(tempArrValue[l].vacationstartdate.split('-')[2]), 0, 0, 0), "vacationenddate": new Date(Number(tempArrValue[l].vacationenddate.split('-')[0]), Number(tempArrValue[l].vacationenddate.split('-')[1]) + -+1, Number(tempArrValue[l].vacationenddate.split('-')[2]), 0, 0, 0) })
            tempObj = {
              "bidschename": tempArrValue[l].bidschename,
              "bidschidref": tempArrValue[l].bidschidref,
              "bidstatus": tempArrValue[l].bidstatus,
              "empidref": tempArrValue[l].empidref,
              "initials": tempArrValue[l].initials,
              "roundseq_id": tempArrValue[l].roundseq_id,
              "date": tempArray,
              "vacationid": tempArrValue[l].vacationid,
              "rdos": tempArrValue[l].rdos,
              "vcationhours": totalVacationBasedOnAround,
              "shift_vacation_hours": tempArrValue[l].shift_vacation_hours,
              "windowstatus": tempArrValue[l].windowstatus
            }

          }
          this.vacationBidSummary.push(tempObj)
        }
      }
      this.vacationBidSummary = this.vacationBidSummary.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.roundseq_id === value.roundseq_id && t.empidref === value.empidref && t.vacationid === value.vacationid && t.vcationhours === value.vcationhours
        ))
      )
      this.totalVacationHours = 0
      for (var v = 0; v < this.vacationBidSummary.length; v++) {
        this.totalVacationHours = this.totalVacationHours + + +this.vacationBidSummary[v].vcationhours
      }

      this.vacationBidSummary = this.vacationBidSummary.filter((item) => item.bidstatus !== "Manager Completed" || item.date)
      // console.log(this.totalVacationHours)
      this.vacationBidSummary = this.vacationBidSummary.sort(function (a, b) {

        return Number(a.roundseq_id) - Number(b.roundseq_id);
      })
    }, (err) => { console.log(err) }, () => { })

    this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(this.currentBidScheduleId).subscribe((res) => {

    }, (err) => { console.log(err) }, () => { })
  }

  getshiflineData(bidScheduleShiftlineSchedulData, shiftidref) {
    for (var i = 0; i < this.shiftLinesSchedule.length; i++) {
      if (this.shiftLinesSchedule[i].sh_schedule_id == shiftidref) {
        for (var j = 0; j < this.shiftLinesSchedule[i].schild.length; j++) {
          if (this.shiftLinesSchedule[i].schild[j].sh_line_id == bidScheduleShiftlineSchedulData) {
            if (this.shiftLinesSchedule[i].schild[j].shiftdurationc == 9) {
              return this.shiftLinesSchedule[i].schild[j].sun.split('-')[0] + this.shiftLinesSchedule[i].schild[j].mon.split('-')[0] + this.shiftLinesSchedule[i].schild[j].tue.split('-')[0] + this.shiftLinesSchedule[i].schild[j].wed.split('-')[0] + this.shiftLinesSchedule[i].schild[j].thu.split('-')[0] + this.shiftLinesSchedule[i].schild[j].fri.split('-')[0] + this.shiftLinesSchedule[i].schild[j].sat.split('-')[0] +
                this.shiftLinesSchedule[i].schild[j].sunshift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].monshift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].tueshift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].wedshift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].thushift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].frishift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].satshift2.split('-')[0]
            } else {
              return this.shiftLinesSchedule[i].schild[j].sun + this.shiftLinesSchedule[i].schild[j].mon + this.shiftLinesSchedule[i].schild[j].tue + this.shiftLinesSchedule[i].schild[j].wed + this.shiftLinesSchedule[i].schild[j].thu + this.shiftLinesSchedule[i].schild[j].fri + this.shiftLinesSchedule[i].schild[j].sat
            }
          }
        }
      }
    }
  }
 
  getshiflineSeq(bidScheduleShiftlineSchedulData, shiftidref) {
    for (var i = 0; i < this.shiftLinesSchedule.length; i++) {
      if (this.shiftLinesSchedule[i].sh_schedule_id == shiftidref) {
        for (var j = 0; j < this.shiftLinesSchedule[i].schild.length; j++) {
          if (this.shiftLinesSchedule[i].schild[j].sh_line_id == bidScheduleShiftlineSchedulData) {
            return this.checkID(this.shiftLinesSchedule[i].schild[j].seq_id, this.shiftLinesSchedule[i].schild[j].shiftname, this.shiftLinesSchedule[i].schild)
          }
        }
      }
    }
  }
  getshiflineName(bidScheduleShiftlineSchedulData, shiftidref) {
    for (var i = 0; i < this.shiftLinesSchedule.length; i++) {
      if (this.shiftLinesSchedule[i].sh_schedule_id == shiftidref) {
        for (var j = 0; j < this.shiftLinesSchedule[i].schild.length; j++) {
          if (this.shiftLinesSchedule[i].schild[j].sh_line_id == bidScheduleShiftlineSchedulData) {
            return this.shiftLinesSchedule[i].schild[j].shiftname
          }
        }
      }
    }
  }
  async viewShiftLineInfo(shiftData) {
    const modal = await this.modalCtrl.create({
      component: ShiftAliasInfoComponent,
      cssClass: 'shiftAliasInfo',
      componentProps: {
        shiftlineData: shiftData,
      },
      swipeToClose: true
    });
    return await modal.present();
  }

  checkSameDate(date1, date2) {
    date1 = new Date(date1)
    date2 = new Date(date2)
    if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
      return true
    } else {
      return false
    }
  }
  onClickBidSummary(index) {
  }
  covertDate(date) {
    if (date != undefined) {
      return new Date(Number(date.split("-")[0]), Number(date.split("-")[1]) + - +1, Number(date.split("-")[2]), 0, 0, 0)
    }
  }
  convertCorrectFormat(shiftline) {
    if (shiftline !== "Not Selected") {
      var num = shiftline.match(/\d+/g);
      var letr = shiftline.match(/[a-zA-Z]+/g);
      return letr + ' - ' + num
    } else {
      return 'Not Selected'
    }
  }
  getVacationStatus
  slideChange() {

    this.slides.getActiveIndex().then(index => {
      this.bidRound = index
      this.cdref.detectChanges()
      //
      for (var i = 0; i < this.all_SBP_rounds.length; i++) {
        if (i == index) {
          this.getVacationStatus = this.all_SBP_rounds[i].vacationbidstatus
          this.getRoundData(this.all_SBP_rounds[i], index)
        }
      }

    })
  }
  getIndicatorClassForCard(id) {
    if (this.bidRound === id) {

      return 'app-border-mercurius-secondary-color';
    } else {
      return '';
    }
  }
  getIndicatorClassForBox(id) {
    if (this.bidRound === id) {

      return 'ion-no-margin ion-no-padding active-box app-border-mercurius-secondary-color';
    } else {
      return '';
    }
  }
  getIndicatorClass(id1) {

    if (this.bidRound === id1) {

      return 'active';
    } else {
      return 'small';
    }
  }


  systemAssignShifts() {
    var currentBidSchedule

    if (this.selectBidScheduleNameForm.value.bid_schedule_name !== 'select bid schedule name') {
      for (var i = 0; i < this.all_bid_schedule.length; i++) {
        if (this.all_bid_schedule[i].bidschename === this.selectBidScheduleNameForm.value.bid_schedule_name) {
          currentBidSchedule = this.all_bid_schedule[i]
        }
      }
    }
    this.bidSchedule = currentBidSchedule
    this.getAllShiftLineScheduleManager()
    // this.checkIncompleteStatus()
  }
  getAllShiftLineScheduleManager() {
    var tempArr = new Array()
    this.all_final_data = new Array()

    if (this.bidSchedule != undefined) {
      this.all_final_data = this.bidSchedule.shiftdefmap
      this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.bidSchedule.bidschename).subscribe((res) => {
        var temp
        temp = res
        if (this.bidSchedule != undefined) {
          for (var i = 0; i < temp.length; i++) {
            if (this.userRole != "emp") {
              
              if (this.bidSchedule.bidschid === temp[i].bidschidref && temp[i].roundseq_id == 1) {
                tempArr.push(temp[i])
              }
            } else {
              if (this.bidSchedule.bidschid === temp[i].bidschidref && temp[i].roundseq_id == 1 && temp[i].empidref == this.empID) {
                tempArr.push(temp[i])
              }
              
            }
          }
        }

        tempArr = tempArr.sort((a, b) => { return b.trans_seq_id - a.trans_seq_id })
        if (tempArr.length > 0) {
           this.getFirstRound(tempArr[0])
        }
      }, (err) => { console.log(err) }, () => { })
    }
  }
  getFirstRound(all_SBP_rounds) {
    var today, date, invdate, diff, roundstartDate, roundendDate
    roundendDate = new Date(all_SBP_rounds.empbid_end_time.split(' ')[0].split('-')[0], Number(all_SBP_rounds.empbid_end_time.split(' ')[0].split('-')[1]) + - +1, all_SBP_rounds.empbid_end_time.split(' ')[0].split('-')[2], all_SBP_rounds.empbid_end_time.split(' ')[1].split(':')[0], all_SBP_rounds.empbid_end_time.split(' ')[1].split(':')[1], all_SBP_rounds.empbid_end_time.split(' ')[1].split(':')[2])

    date = new Date();
    invdate = new Date(date.toLocaleString('en-US', {
      timeZone: this.bidShculeTimeZone
    }));
    diff = date.getTime() - invdate.getTime();
    today = new Date(date.getTime() - diff)
    if (roundendDate < today) {
      if (this.bidSchedule != undefined) {
        if (this.bidSchedule.bidschid != undefined) {
          this.updatebyManager()
        }
      }
    }
    this.spinner = false
  }
  notificationArr = []
  updatebyManager() {
    var currentBidSchedule, tempArr = []
    this.notificationArr = []
    this.sentNotification = []


    this.bidShiftLineSer.getBidShiftlinesData(this.bidSchedule.bidschename).subscribe((res) => {
      var temp
      temp = res
      tempArr = []
      if (this.bidSchedule.bidschid != undefined) {
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].bidschidref == this.bidSchedule.bidschid) {
            tempArr.push(temp[i])
          }
        }
      }
      var arr, count = 0
      for (var i = 0; i < this.all_final_data.length; i++) {
        arr = []

        for (var j = 0; j < tempArr.length; j++) {
          if (tempArr[j].shiftidref === this.all_final_data[i].shiftdefref) {
            arr.push(tempArr[j])
          }
        }
        this.arrOne = arr
        for (var m = 0; m < this.bidSchedule.employeemap.length; m++) {
          arr = this.arrOne
          var tempEmp
          tempEmp = this.bidSchedule.employeemap
          const found = arr.some(el => el.empidref === this.bidSchedule.employeemap[m].empidref);
          if (found == true) {
          } else {
            count = 0
            this.arrOne = []
            for (var k = 0; k < arr.length; k++) {
              if (arr[k].empidref == null) {
                count++
                if (count == 1) {
                  var shiftLineData = arr[k]
                  this.arrOne
                  this.notificationArr.push(this.bidSchedule.employeemap[m].empidref)
                  this.getUpdateEmpWindowData(this.bidSchedule.employeemap[m].empidref)
                  this.getAllEmployeeList(shiftLineData, this.bidSchedule.employeemap[m].empidref)
                } else {
                  this.arrOne.push(arr[k])
                }
              } else {
                this.arrOne.push(arr[k])
              }
            }
          }
        }
      }
    },
      (err) => { console.log(err) }, () => { })
  }
  temp
  arr = []
  arrOne = []
  getUpdateEmpWindowData(empId) {

    this.bidWindowSer.getBidWindowDataBasedOnempId(empId).subscribe((res) => {
      var tempObj, tempArr = []
      tempArr = res
      for (var i = 0; i < tempArr.length; i++) {
        if (Number(this.bidSchedule.bidschid) == tempArr[i].bidschidref && tempArr[i].roundseq_id == 1) {
          tempObj = tempArr[i]
        }
      }
      var tempNewObj
      tempNewObj = {
        "duid": tempObj.duid,
        "bidschidref": tempObj.bidschidref,
        "bidschename": tempObj.bidschename,
        "empidref": tempObj.empidref,
        "initials": tempObj.initials,
        "rank": tempObj.rank,
        "roundseq_id": tempObj.roundseq_id,
        "bidstartdate": tempObj.bidstartdate,
        "bidenddate": tempObj.bidenddate,
        "bidstarttime": tempObj.bidstarttime,
        "bidendtime": tempObj.bidendtime,
        "empbidduration": tempObj.empbidduration,
        "shiftlinebidstatus": "System Completed",
        "vacationbidstatus": tempObj.vacationbidstatus,
        "trans_seq_id": tempObj.trans_seq_id,
        "empbid_end_time": tempObj.empbid_end_time,
        "empbid_start_time": tempObj.empbid_start_time,
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
      }
      this.bidWindowSer.updateBidWindowData(tempObj.duid, tempNewObj).subscribe((res) => {
        var updateBidShiftlineData
        updateBidShiftlineData = res
        this.sendNotification(updateBidShiftlineData)
      }, (err) => { console.log(err) }, () => { })
    }, (err) => { console.log(err) }, () => { })
  }
  getAllEmployeeList(shiftLineData, empId) {
    this.getAllEmp.getEmpDataBasedOnEmpId(empId).subscribe(
      (res) => {
        var temp
        temp = res
        var tempObj
        tempObj = {
          "bidid": shiftLineData.bidid,
          "bidstatus": 'System Completed',
          "windowstatus": '',
          "empwindowduration": null,
          "empwindowstartdateandtime": '',
          "bidschidref": this.bidSchedule.bidschid,
          "bidschename": this.bidSchedule.bidschename,
          "empidref": temp.empid,
          "initials": temp.initials,
          "empbid_end_time": shiftLineData.empbid_end_time,
          "empbid_start_time": shiftLineData.empbid_start_time,
          "roundseq_id": 1,
          "schedulename": shiftLineData.schedulename,
          "shiftseq_id": shiftLineData.shiftseq_id,
          "shiftidref": shiftLineData.shiftidref,
          "shiftlineidref": shiftLineData.shiftlineidref,
          "shiftname": shiftLineData.shiftname,
          "pattern": shiftLineData.pattern
        }
        this.bidShiftLineSer.updateBidShiftlineData(tempObj.bidid, tempObj).subscribe((res) => {
          var updateBidShiftlineData
          updateBidShiftlineData = res

        }, (err) => { console.log(err) }, () => { })
      },
      (err) => { console.log(err) }, () => { })
  }
  sentNotification = []
  sendNotification(updateBidShiftlineData) {
    for (var i = 0; i < this.notificationArr.length; i++) {
      const found = this.sentNotification.some(el => el === updateBidShiftlineData.empidref);
      if (found == false) {
        this.sentNotification.push(updateBidShiftlineData.empidref)
        this.emailNotify.emailNotificationForSystemAssignShiftLines(updateBidShiftlineData.bidschidref, updateBidShiftlineData.empidref).subscribe((res) => { }, (err) => {
        }, () => { this.ngOnInit() })
      }
    }

  }
  async openCalendar(index, data) {
    const modal = await this.modalCtrl.create({
      component: BidSummaryCalendarComponent,
      cssClass: 'BidSummaryCalendar',
      componentProps: {
        round_id: index,
        shiftlineSummary: this.bid_summary,
        vacationSummary: data
      },
      swipeToClose: true
    });
    return await modal.present();
  }
  myFunctionBidSummary(index) {
    this.showPopUp
    this.checkClickForPopup = true
    var popup = document.getElementById("myPopupIndex" + index);
    popup.classList.toggle("showIndex");
    if (this.oldPopupIdForBidSummary != undefined) {
      var popupOne = document.getElementById("myPopupIndex" + this.oldPopupIdForBidSummary);
      if (popupOne != null) {
        if (popupOne.classList.contains("showIndex") == true) {
          popupOne.classList.toggle("showIndex");
        }
      }
    }
    var popupStatus = document.getElementById("myPopup");
    if (popupStatus != null) {
      if (popupStatus.classList.contains("show") == true) {
        popupStatus.classList.toggle("show");
      }
    }
    var popupBS = document.getElementById("popupStatus" + this.oldPopupId);
    if (popupBS != null) {
      if (popupBS.classList.contains("show") == true) {
        popupBS.classList.toggle("show");
      }
    }
    if (this.oldPopupIdForBidSummary == index) {
      this.oldPopupIdForBidSummary = undefined
    } else {
      this.oldPopupIdForBidSummary = index
    }

  }
  intervalForIncompleteStatus
  intervalForUpdateStatusFoCheclEmployeeTIme

  checkID(id, sl, scheduleShift) {
    var tempArr = []
    for (var i = 0; i <= scheduleShift.length; i++) {
      if (scheduleShift[i] != undefined) {
        if (String(scheduleShift[i].shiftname) == String(sl) || String(scheduleShift[i].shiftname) == String((sl + '-A'))) {
          tempArr.push(Number(scheduleShift[i].seq_id))
        }
      }
    }
    tempArr = tempArr.sort((a, b) => { return a - b })
    var newid = tempArr.indexOf(id)
    return newid
  }


  currentempData
  round_id
  empId
  bid_schedule_id
  async done() {

    if (this.finalViewBidWindowData != undefined) {
      this.bid_schedule_id = this.finalViewBidWindowData.default.bidschidref
      this.empId = this.finalViewBidWindowData.default.empidref
      this.round_id = this.finalViewBidWindowData.default.roundseq_id
      this.currentempData = this.finalViewBidWindowData.default
      if (this.userRole != 'emp') {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Done',
          message: 'Please click on next to proceed further!!',
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          }, {
            text: 'Next',
            handler: async () => {
              this.loadingfinal = await this.loadingController.create({
                cssClass: 'custom-loading',
                spinner: 'bubbles',
                message: '',
                duration: 15000,

              });
              await this.loadingfinal.present();
              this.final()
            }
          }]

        });
        await alert.present();
      }

    }
  }
  loadingfinal
  final() {
    this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res) => {
      var temp
      temp = res

      this.allBidRoundData = []
      var tempObj
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].bidschidref === Number(this.bid_schedule_id) && (Number(this.round_id)) === temp[i].roundseq_id) {
          tempObj = temp[i]
        }
      }
      var today, date, invdate, diff
      date = new Date();
      invdate = new Date(date.toLocaleString('en-US', {
        timeZone: this.bidShculeTimeZone
      }));
      diff = date.getTime() - invdate.getTime();
      today = new Date(date.getTime() - diff)
      var currentdate = today;
      var updatedCurrentTime = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate() + ' ' + currentdate.getHours() + ":" + currentdate.getMinutes() + ':00'
      var tempNewObj = {
        "duid": tempObj.duid,
        "bidschidref": tempObj.bidschidref,
        "bidschename": tempObj.bidschename,
        "empidref": tempObj.empidref,
        "initials": tempObj.initials,
        "rank": tempObj.rank,
        "roundseq_id": tempObj.roundseq_id,
        "bidstartdate": tempObj.bidstartdate,
        "bidenddate": tempObj.bidenddate,
        "bidstarttime": tempObj.bidstarttime,
        "bidendtime": tempObj.bidendtime,
        "empbidduration": tempObj.empbidduration,
        "shiftlinebidstatus": tempObj.shiftlinebidstatus,
        "vacationbidstatus": tempObj.vacationbidstatus,
        "empbid_end_time": updatedCurrentTime,
        "trans_seq_id": tempObj.trans_seq_id,
        "empbid_start_time": tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
      }
      this.currentempData = tempNewObj
      this.bidWindowSer.updateBidWindowData(tempObj.duid, tempNewObj).subscribe((res) => {
        var updatedRes
        updatedRes = res
        if (updatedRes.vacationbidstatus == 'Skipped' || updatedRes.vacationbidstatus == 'Manager Skipped') {
          this.skippedNotify(updatedRes.empidref, updatedRes.roundseq_id)
        } else {
          this.sendNotifyAfterCompleteBidding(updatedRes.empidref, updatedRes.roundseq_id)
        }
      }, async (err) => {
        console.log(err)
        this.loadingfinal.dismiss()
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: 'Please try again!',
          buttons: [{
            text: 'OK', handler: () => {

              this.ngOnInit()
            }
          }]
        });
        await alert.present();

      }, () => { })
    }, async (err) => {
      console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{
          text: 'OK', handler: () => {

            this.ngOnInit()
          }
        }]
      });
      await alert.present();
    }, () => { })
  }

  skippedNotify(empId, round_id) {
    if (this.skipRoundId == 0 || this.skipRoundId == 1) {
      if (round_id == 1) {
        this.emailNotify.WhenEmployeeFinishesBiddingForAnyRoundWithSkippedVacation(this.bid_schedule_id, empId, round_id, this.skipRoundId).subscribe((res) => {
          this.ngOnInit()
        },
          (err) => { console.log(err) }, () => { })
      } else {
        this.emailNotify.skipVacationBidding(this.bid_schedule_id, empId, round_id, this.skipRoundId).subscribe((res) => {
          this.ngOnInit()
        },
          (err) => { console.log(err) }, () => { })
      }
    }
  }
  sendNotifyAfterCompleteBidding(empId, round_id) {
    this.emailNotify.whenEmployeeFinishesBiddingForAnyRound(this.bid_schedule_id, empId, round_id, this.vactionExhausted).subscribe((res) => { this.ngOnInit() }, (err) => { console.log(err) }, () => { })
  }
  
}





