import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder, FormGroup
} from '@angular/forms';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { PassBidScheduleNameService } from 'src/app/services/manage-bid-schedule/pass-bid-schedule-name.service';
import { QualificationService } from 'src/app/services/manage-bid-schedule/qualification/qualification.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { ChangeDetectorRef } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { IncorrectShiftlineScheduleMessageComponent } from './incorrect-shiftline-schedule-message/incorrect-shiftline-schedule-message.component';
import { SaveNewBidScheduleComponent } from './save-new-bid-schedule/save-new-bid-schedule.component';
import { BidRoundSummaryComponent } from './select-bid-rounds/bid-round-summary/bid-round-summary.component';
import { SelectBidRoundsComponent } from './select-bid-rounds/select-bid-rounds.component';
import { SelectEmployeeComponent } from './select-employee/select-employee.component';
import { SelectedEmployeeSummaryComponent } from './select-employee/selected-employee-summary/selected-employee-summary.component';
import { SelectShiftlineScheduleSummaryComponent } from './select-shiftline/select-shiftline-schedule-summary/select-shiftline-schedule-summary.component';
import { SelectShiftlineComponent } from './select-shiftline/select-shiftline.component';
import { SelectVacationSlotSummaryComponent } from './select-vacation-slots/select-vacation-slot-summary/select-vacation-slot-summary.component';
import { SelectVacationSlotsComponent } from './select-vacation-slots/select-vacation-slots.component';

@Component({
  selector: 'app-create-new-bid-schedule',
  templateUrl: './create-new-bid-schedule.component.html',
  styleUrls: ['./create-new-bid-schedule.component.scss'],
})
export class CreateNewBidScheduleComponent implements OnInit {
  @ViewChild('bidRoundPanel') bidRoundPanel: MatExpansionPanel;
  @ViewChild('vacationSlotsPanel') vacationSlotsPanel: MatExpansionPanel;
  @ViewChild('employeePanel') employeePanel: MatExpansionPanel;
  @ViewChild('shiflinePanel') shiflinePanel: MatExpansionPanel;
  @ViewChild('bidRoundPanel', { read: ElementRef }) bidRoundPanelElement: ElementRef;
  @ViewChild('vacationSlotsPanel', { read: ElementRef }) vacationSlotsPanelElement: ElementRef;
  slotsValid: boolean = true;
  roundsComputed: Boolean = false;
  view_bid_schedule_id;
  setUpBidParametersForm: FormGroup;
  select_shiftline_schedule;
  totalHours = 0;
  message: string = 'secondChild';
  checkShiftLineSchedule = false;
  checkShiftLineQualification = false;
  checkShiftLineBidSchedule = false;
  checkShiftLineStartDate = false;
  totalRequiredHours = 0;
  getAllScheduleName: any[];
  schedulename = '';
  user_data: any;
  all_final_data: any;
  all_qualification = [];
  checkBidSchedule_Name = false;
  allEmployee = [];
  setUpBidScheduleOne;
  disableSelectEmpOtion = true;
  maxDate;
  minDate;
  all_Bid_schedule_list;
  check_bidScheduleName = false;
  checkShiftLineScheduleForEdit = false;
  allScheduleData: any[];
  checkForEditSchedule = false;
  allBidScheduleNumbers = 1;
  disableSelectEmpOption = false;
  newBidSchedule;
  empHide = false;
  checkCreatenewSchedule = false;
  checkClickForPopup = false;
  currentPopupId: any;
  popUpId: any;
  oldPopUpId: any;
  checkBidScheduleData = false;
  checkForViewBidSchedule;
  totalCreatedVacationHours: any;
  totalRequiredVacationHours: any;
  totalAccumulatedLeaves: any;
  totalEmp = 0;
  check_correct_shitline_schedule = false;
  checkPastTimeOrDateOne = 'date or start time';
  checkPastTimeOrDateTwo = 'date or time';
  isDesktop: boolean = false;
  updatedValue = false;
  checkValuechanged = false;
  steps = {
    shiftlinesSelected: false,
    employeeSelected: false,
    slotsSelected: false,
    bidRoundsSelected: false,
  };
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public modalCtrl: ModalController,
    private headerTitleService: HeaderTitleService,
    public actionSheetController: ActionSheetController,
    private scheduleService: GeneratedScheduleService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private curBidScheduleNameSer: PassBidScheduleNameService,
    private getAllEmp: AddNewEmployeeService,
    public alertController: AlertController,
    private qualifiaction_name: QualificationService,
    private bidService: BidScheduleService,
    public alertCtrl: AlertController,
    private activaRouter: ActivatedRoute,
    private bidScheduleSer: CreateNewBidScheduleService,
    private localData: LocalDataService
  ) {
    this.activaRouter.params.subscribe((params) => {
      this.view_bid_schedule_id = params['_id'];
    });
  }
  bidShculeTimeZone = 'US/Eastern';
  ngOnInit() {
    this.checkIsDesktop();
    this.platform.resize.subscribe(() => this.checkIsDesktop());
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.minDate = String(yyyy + '-' + mm + '-' + dd);
    this.maxDate = String(yyyy + +(+3) + '-' + mm + '-' + dd);
    this.totalRequiredVacationHours = JSON.parse(
      this.localData.getItem('totalRequiredVacationHours')
    );
    this.totalAccumulatedLeaves = JSON.parse(
      this.localData.getItem('totalAccumulatedLeaves')
    ) || 0;
    if (this.totalRequiredVacationHours == undefined) {
      this.totalRequiredVacationHours = 0;
    }
    this.totalRequiredHours = this.totalRequiredVacationHours;
    this.totalCreatedVacationHours = JSON.parse(
      this.localData.getItem('totalCreatedVacationHours')
    );
    if (this.totalCreatedVacationHours == undefined) {
      this.totalCreatedVacationHours = 0;
    }
    this.totalHours = this.totalCreatedVacationHours;

    this.all_final_data = [];
    if (this.view_bid_schedule_id == undefined) {
      if (this.checkCreatenewSchedule == false) {
        this.headerTitleService.setTitle('New Bid Schedule');
      }

      this.headerTitleService.setDefaultHeader(false);
      this.headerTitleService.setBackUrl(
        straightlines_io_apis.apis.manage_bid_schedule
      );
      this.headerTitleService.setForwardUrl(null);
      this.headerTitleService.checkBiddingTime('');
      this.headerTitleService.checkBiddingEndDate('');

      this.checkForViewBidSchedule = 'new';
      var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
      var tempNewObj;
      if (tempObj == null) {
        this.checkBidScheduleData = false;
      } else {
        if (
          tempObj.shiftdefmap.length > 0 &&
          tempObj.employeemap.length > 0 &&
          tempObj.leavemap.length > 0 &&
          tempObj.roundmap.length > 0
        ) {
          this.checkBidScheduleData = true;
        } else {
          this.checkBidScheduleData = false;
        }
      }
      // this.getAllEmployeeList()

      if (tempObj == null) {
        this.newBidSchedule = null;
      } else {
        this.newBidSchedule = {
          bidschename: tempObj.bidschename,
          bidmanagerid: this.user_data.id,
          intervalstarttime: tempObj.intervalstarttime,
          intervalduration: tempObj.intervalduration,
          hasinterval: tempObj.hasinterval,
          bidroundoption: tempObj.bidroundoption,
          timezone: tempObj.timezone,
          weekendstatus: tempObj.weekendstatus,
          bidschstartdate: tempObj.bidschstartdate,
          bidschenddate: tempObj.bidschenddate,
          schedulesavestatus: tempObj.schedulesavestatus,
          leavesavestatus: tempObj.leavesavestatus,
          roundsavestatus: tempObj.roundsavestatus,
          shiftdefmap: tempObj.shiftdefmap,
          employeemap: tempObj.employeemap,
          leavemap: tempObj.leavemap,
          roundmap: tempObj.roundmap,
        };
        this.totalEmp = this.newBidSchedule.employeemap.length;
        this.allEmployee = [];
        // for(var i=0;i<this.newBidSchedule.employeemap.length;i++){
        //   this.getEmployeeList(this.newBidSchedule.employeemap[i],i)
        // }
        // this.totalSlots()
        this.getAllShiftLineSchedule();
      }
    } else {
      this.headerTitleService.setTitle('View Bid Schedule');
      this.headerTitleService.setDefaultHeader(false);
      this.headerTitleService.setBackUrl(
        straightlines_io_apis.apis.manage_bid_schedule
      );
      this.headerTitleService.setForwardUrl(null);
      this.headerTitleService.checkBiddingTime('');
      this.headerTitleService.checkBiddingEndDate('');

      this.checkForViewBidSchedule = 'view';
      this.viewBidScheduleData();
      this.steps = {
        shiftlinesSelected: true,
        employeeSelected: true,
        slotsSelected: true,
        bidRoundsSelected: true,
      };
    }
    if (this.newBidSchedule != undefined) {
      if (this.newBidSchedule.roundmap != undefined) {
        if (this.newBidSchedule.roundmap.length > 0) {
          var rmap = this.newBidSchedule.roundmap;
          rmap = rmap.sort((a, b) => {
            return Number(a.roundseq_id) - Number(b.roundseq_id);
          });
          var startDate = rmap[0].roundstartdate.split('T')[0];
          var startTimme = rmap[0].roundstarttime;

          if (
            this.bidShculeTimeZone == undefined ||
            this.bidShculeTimeZone == null ||
            this.bidShculeTimeZone == ''
          ) {
            this.bidShculeTimeZone = 'US/Eastern';
          } else {
            this.bidShculeTimeZone = this.newBidSchedule.timezone;
          }
          var todayCheck, date, invdate, diff;
          date = new Date();
          invdate = new Date(
            date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone,
            })
          );
          diff = date.getTime() - invdate.getTime();
          todayCheck = new Date(date.getTime() - diff);

          if (
            new Date(
              Number(startDate.split('-')[0]),
              Number(startDate.split('-')[1]) + -+1,
              Number(startDate.split('-')[2]),
              Number(startTimme.split(':')[0]),
              Number(startTimme.split(':')[1]),
              0
            ).getTime() < todayCheck.getTime()
          ) {
            if (
              new Date(
                Number(startDate.split('-')[0]),
                Number(startDate.split('-')[1]) + -+1,
                Number(startDate.split('-')[2]),
                0,
                0,
                0
              ).getTime() <
              new Date(
                todayCheck.getFullYear(),
                todayCheck.getMonth(),
                todayCheck.getDate(),
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
        }
      }
      this.slotsValid = true;
      this.steps = {
        shiftlinesSelected:
          this.newBidSchedule && this.newBidSchedule.shiftdefmap.length > 0,
        employeeSelected:
          this.newBidSchedule && this.newBidSchedule.employeemap.length > 0,
        slotsSelected:
          this.newBidSchedule && this.newBidSchedule.leavemap.length > 0,
        bidRoundsSelected:
          this.newBidSchedule && this.newBidSchedule.roundmap.length > 0,
      };
    }
  }
  checkIsDesktop() {
    this.isDesktop = this.platform.width() > 992;
  }
  checkPastTimeAndDate = false;
  shiftLinesSchedule = [];
  shiftlineScheduleData;
  getAllShiftLineSchedule() {
    this.shiftLinesSchedule = new Array();
    for (var i = 0; i < this.newBidSchedule.shiftdefmap.length; i++) {
      this.scheduleService
        .newgetAllShiftLinesBasedOnScheduleId(
          this.newBidSchedule.shiftdefmap[i].shiftdefref
        )
        .subscribe(
          (res) => {
            this.shiftlineScheduleData = res[0];

            this.shiftLinesSchedule.push(this.shiftlineScheduleData);
            this.convertArrayData();
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
    }

    this.convertArrayData();
    // this.currentShiftLineSchedule(this.all_final_data[this.checkShiftLineScheduleId])
  }

  all_final_data_shiftline_length = [];
  convertArrayData() {
    var tempArr = new Array();
    tempArr = this.shiftLinesSchedule;
    this.all_final_data_shiftline_length = new Array();
    for (var i = 0; i < tempArr.length; i++) {
      for (var j = 0; j < this.newBidSchedule.shiftdefmap.length; j++) {
        if (
          tempArr[i].sh_schedule_id ==
          this.newBidSchedule.shiftdefmap[j].shiftdefref
        ) {
          this.all_final_data_shiftline_length.push({
            scheduleName: tempArr[i].schedulename,
            totalShiftlines: tempArr[i].schild.length,
          });
        }
      }
    }
    var tempArr = [];
    tempArr = this.all_final_data_shiftline_length;
    this.all_final_data_shiftline_length = [];
    if (this.totalEmp > 0) {
      this.check_correct_shitline_schedule = false;
      for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i].totalShiftlines < this.totalEmp) {
          this.all_final_data_shiftline_length.push(tempArr[i]);
          this.check_correct_shitline_schedule = true;
        }
      }
    }
  }
  async viewIncorrectShiftlineScheduleData() {
    const modal = await this.modalCtrl.create({
      component: IncorrectShiftlineScheduleMessageComponent,
      cssClass: 'saveBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps: {
        all_final_data_shiftline_length: this.all_final_data_shiftline_length,
        totalEmp: this.totalEmp,
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
  getEmployeeList(empId, i) {
    this.getAllEmp.getEmpDataBasedOnEmpId(empId).subscribe(
      (res) => {
        this.allEmployee.push(res);
        this.allEmployee = this.allEmployee.sort((a, b) => a.rank - b.rank);
        if (this.newBidSchedule.employeemap.length === i + +(+1)) {
          this.totalLeaveAccured();
        }
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }
  totalLeaveAccured() {
    this.totalRequiredHours = 0;
    for (var i = 0; i < this.allEmployee.length; i++) {
      this.totalRequiredHours =
        this.totalRequiredHours + +(+this.allEmployee[i].vacation);
    }
    this.totalRequiredVacationHours = JSON.parse(
      this.localData.getItem('totalRequiredVacationHours')
    );
    if (this.totalRequiredVacationHours == undefined) {
      this.totalCreatedVacationHours = 0;
    }
  }
  getTotalDays() {}

  totalSlots() {
    this.totalHours = 0;
    for (var i = 0; i < this.newBidSchedule.leavemap.length; i++) {
      var date1 = new Date(this.newBidSchedule.leavemap[i].leavestartdate);
      var date2 = new Date(this.newBidSchedule.leavemap[i].leaveenddate);
      date2.setDate(date2.getDate() + 1);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.totalHours =
        this.totalHours +
        +(+(
          Difference_In_Days *
          this.newBidSchedule.leavemap[i].leaveslots *
          8
        ));
    }
  }
  viewBidScheduleData() {
    this.bidScheduleSer
      .getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(
        this.view_bid_schedule_id
      )
      .subscribe(
        (res) => {
          this.newBidSchedule = res;
        },
        (err) => {},
        () => {}
      );
  }
  async selectShiftlineSchedule() {
    const modal = await this.modalCtrl.create({
      component: SelectShiftlineComponent,
      cssClass: 'bidShiftLineSchedule',
      componentProps: { editBidSchedule: false },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.checkCreatenewSchedule = true;
      this.ngOnInit();
    });

    return await modal.present();
  }

  shiftlineSelected() {
    this.checkCreatenewSchedule = true;
    this.steps = { ...this.steps, shiftlinesSelected: true };
    this.ngOnInit();
  }

  updateSelectedEmp(data) {
    if (data.updatedValue) {
      this.totalRequiredVacationHours = data.totalRequired;
      this.totalAccumulatedLeaves = data.totalAccumulatedLeaves;
      this.localData.setItem(
        'totalRequiredVacationHours',
        this.totalRequiredVacationHours
      );
      this.localData.setItem(
        'totalAccumulatedLeaves',
        this.totalAccumulatedLeaves
      )
      this.updatedValue = data.updatedValue;
      this.steps = { ...this.steps, employeeSelected: true };
    }
    this.checkValuechanged = true;
    this.newBidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));
    if (
      (this.isDesktop && this.roundsComputed) ||
      this.newBidSchedule?.roundmap.length > 0
    ) {
      this.addNewBidRound();
    } else {
      this.ngOnInit();
    }
  }
  selectVacationSlots(data) {
    if (data.totalHours) {
      this.slotsValid = true;
      this.totalCreatedVacationHours = data.totalHours;
      this.localData.setItem(
        'totalCreatedVacationHours',
        this.totalCreatedVacationHours
      );
    }
    if (data.updatedValue) {
      this.updatedValue = data.updatedValue;
    }
    this.steps = { ...this.steps, slotsSelected: true };
    this.newBidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));
    this.slotsValid = true;
    if (this.newBidSchedule?.roundmap.length > 0) {
      this.checkValuechanged = this.updatedValue;
      if (this.checkValuechanged) {
        this.addNewBidRound();
      } else {
        this.ngOnInit();
      }
    } else {
      this.ngOnInit();
    }
  }
  async selectEmp() {
    const modal = await this.modalCtrl.create({
      component: SelectEmployeeComponent,
      cssClass: 'bidVacation',
      componentProps: { editBidSchedule: false },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.updateSelectedEmp(data.data);
    });

    return await modal.present();
  }
  async addNewSlot() {
    const modal = await this.modalCtrl.create({
      component: SelectVacationSlotsComponent,
      cssClass: 'bidVacation',
      componentProps: { editBidSchedule: false },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.selectVacationSlots(data.data);
    });

    return await modal.present();
  }
  showHide() {
    if (this.empHide == false) {
      this.empHide = true;
    } else {
      this.empHide = false;
    }
  }
  getEmpInitial(empId) {
    for (var i = 0; i < this.allEmployee.length; i++) {
      if (empId == this.allEmployee[i].empid) {
        return this.allEmployee[i];
      }
    }
  }
  async checkDataForVacationSlots() {
    if (this.newBidSchedule != null) {
      if (this.newBidSchedule.employeemap.length > 0) {
        this.addNewSlot();
      } else {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: 'Please select Employees before adding vacation slots.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Please select Employees before adding vacation slots.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
  async checkDataForBidRounds() {
    if (this.newBidSchedule != null) {
      if (
        this.newBidSchedule.shiftdefmap.length > 0 &&
        this.newBidSchedule.employeemap.length > 0 &&
        this.newBidSchedule.leavemap.length > 0
      ) {
        this.addNewBidRound();
      } else {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: 'Please add vacation slots before computing bid rounds.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Please add vacation slots before computing bid rounds.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  selectBidRound(data) {
    if (data.checkValuechanged == undefined) {
      this.updatedValue = this.checkValuechanged;
    } else {
      this.checkValuechanged = data.checkValuechanged;
      this.updatedValue = data.checkValuechanged;
      this.steps = { ...this.steps, bidRoundsSelected: true };
    }
    this.ngOnInit();
  }
  async openBidRoundModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBidRoundsComponent,
      cssClass: 'bidRounds',
      componentProps: {
        checkValuechanged: this.checkValuechanged,
        editBidSchedule: false,
        totalCreatedVacationHours: this.totalCreatedVacationHours,
        totalRequiredVacationHours: this.totalRequiredVacationHours,
        totalAccumulatedLeaves: this.totalAccumulatedLeaves
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.selectBidRound(data.data);
    });
    return await modal.present();
  }
  async showRecomputeAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: 'Please re-compute the bid rounds. You updated the data.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
  addNewBidRound() {
    if (!this.isDesktop) {
      this.openBidRoundModal();
    } else {
      this.shiflinePanel.close();
      this.employeePanel.close();
      this.vacationSlotsPanel.open();
      this.bidRoundPanel.open();
      this.bidRoundPanelElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
      this.showRecomputeAlert();
    }
  }
  async continue() {
    var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
    if (this.newBidSchedule != undefined) {
      if (this.newBidSchedule.roundmap != undefined) {
        if (this.newBidSchedule.roundmap.length > 0) {
          var rmap = this.newBidSchedule.roundmap;
          rmap = rmap.sort((a, b) => {
            return Number(a.roundseq_id) - Number(b.roundseq_id);
          });
          var startDate = rmap[0].roundstartdate.split('T')[0];
          var startTimme = rmap[0].roundstarttime;

          if (
            this.bidShculeTimeZone == undefined ||
            this.bidShculeTimeZone == null ||
            this.bidShculeTimeZone == ''
          ) {
            this.bidShculeTimeZone = 'US/Eastern';
          } else {
            this.bidShculeTimeZone = this.newBidSchedule.timezone;
          }
          var todayCheck, date, invdate, diff;
          date = new Date();
          invdate = new Date(
            date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone,
            })
          );
          diff = date.getTime() - invdate.getTime();
          todayCheck = new Date(date.getTime() - diff);

          if (
            new Date(
              Number(startDate.split('-')[0]),
              Number(startDate.split('-')[1]) + -+1,
              Number(startDate.split('-')[2]),
              Number(startTimme.split(':')[0]),
              Number(startTimme.split(':')[1]),
              0
            ).getTime() < todayCheck.getTime()
          ) {
            if (
              new Date(
                Number(startDate.split('-')[0]),
                Number(startDate.split('-')[1]) + -+1,
                Number(startDate.split('-')[2]),
                0,
                0,
                0
              ).getTime() <
              new Date(
                todayCheck.getFullYear(),
                todayCheck.getMonth(),
                todayCheck.getDate(),
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
        }
      }
    }
    if (this.checkPastTimeAndDate == false) {
      if (tempObj != null) {
        const modal = await this.modalCtrl.create({
          component: SaveNewBidScheduleComponent,
          cssClass: 'saveBidSchedule',
          componentProps: {
            checkShiftLine: this.check_correct_shitline_schedule,
          },
          swipeToClose: true,
        });
        modal.onDidDismiss().then((data) => {
          // this.ngOnInit()
        });

        return await modal.present();
      }
    }
  }
  async viewBidRoundList() {
    const modal = await this.modalCtrl.create({
      component: BidRoundSummaryComponent,
      cssClass: 'shiftlineSummaryForBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps: {
        view_bid_schedule_id: this.view_bid_schedule_id,
        editBidSchedule: false,
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
  async showShiftLineScheduleSummary() {
    const modal = await this.modalCtrl.create({
      component: SelectShiftlineScheduleSummaryComponent,
      cssClass: 'shiftlineSummaryForBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps: {
        view_bid_schedule_id: this.view_bid_schedule_id,
        editBidSchedule: false,
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
  async viewEmpList() {
    const modal = await this.modalCtrl.create({
      component: SelectedEmployeeSummaryComponent,
      cssClass: 'shiftlineSummaryForBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps: {
        view_bid_schedule_id: this.view_bid_schedule_id,
        editBidSchedule: false,
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
  async viewVacationSlot() {
    const modal = await this.modalCtrl.create({
      component: SelectVacationSlotSummaryComponent,
      componentProps: {
        view_bid_schedule_id: this.view_bid_schedule_id,
        editBidSchedule: false,
      },
      cssClass: 'shiftlineSummaryForBidSchedule',
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  employeeSelected(data){
    this.newBidSchedule.employeemap = data.updatedEmployeeMap;
  }
}
