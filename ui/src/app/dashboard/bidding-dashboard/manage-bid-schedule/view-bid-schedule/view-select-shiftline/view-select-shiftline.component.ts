import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NavController, ModalController, NavParams, ToastController, ActionSheetController } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';
import { CustomSchedulePopupComponent } from '../../create-new-bid-schedule/select-shiftline/custom-schedule-popup/custom-schedule-popup.component';
import straightlines_io_apis from 'src/app/json/apis.json';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-view-select-shiftline',
  templateUrl: './view-select-shiftline.component.html',
  styleUrls: ['./view-select-shiftline.component.scss']
})
export class ViewSelectShiftlineComponent implements OnInit {

  @Input() isModal: boolean = true;
  @Input() isEditBidSchedule: boolean = false;
  @Input() completed: boolean = false;
  @Output() shiftsSelected = new EventEmitter();
  @Output() shiftsUpdated = new EventEmitter();
  isSaved = false;
  setUpBidParametersForm: FormGroup;
  bid_schedule_data: any;
  all_schedule: any;
  selected_schedule_data: any;
  user_data: any;
  allShiftData = [];
  getAllScheduleName: any[];
  allEmployee = [];
  scheduleListForm: any;
  schedule_data = [];
  lastDate;
  all_schedule_list = [];
  checkDate = [];
  minDate = new Date();
  dateValidation = false;
  checkShiftLineSchedule = false;
  setUpBidScheduleOne: any;
  updatedData: any[];
  allScheduleData = [];
  disable = true;
  all_final_data = [];
  bidScheduleId: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private getAllEmp: AddNewEmployeeService,
    private scheduleService: GeneratedScheduleService,
    private headerTitleService: HeaderTitleService,
    private toastCtrl: ToastController,
    private bidScheduleSer: BidScheduleService,
    public actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    private localData: LocalDataService
  ) {
    if (this.isModal) {
      this.bid_schedule_data = navParams.get('bid_schedule_data');
      this.allScheduleData = navParams.get('all_schedule_data');
      this.isEditBidSchedule = navParams.get('editBidSchedule') || false;
    }
  }
  ngOnInit() {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.getShiftLineSchedule();
    this.all_schedule_list = [];
    this.scheduleListForm = this.fb.group({
      allScheduleListData: this.fb.array([]),
    });
    this.isSaved = !this.compareChange();
  }
  get allScheduleListData(): FormArray {
    return this.scheduleListForm.get('allScheduleListData') as FormArray;
  }
  newWorkLoadData(): FormGroup {
    return this.fb.group({
      id: new FormControl(),
      scheduleName: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      active: new FormControl(),
      scheduleID: new FormControl(),
      scheduleselected: new FormControl(),
      bidschref: new FormControl(),
      bidshiftmapid: new FormControl(),
    });
  }
  getShiftLineSchedule() {
    this.scheduleService.newgetAllSchedule(this.user_data.id).subscribe(
      (res) => {
        this.all_schedule = res;
        this.all_schedule = this.all_schedule.sort((a, b) => {
          return b.sh_schedule_id - a.sh_schedule_id;
        });
        // if(this.isEditBidSchedule==false){
        this.shiftLineForm();
        // }else{
        // this.editShiftLineForm()
        // }

        return this.all_schedule;
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  totalSelectedShiftlineSchedule = 0;
  oldindex;
  dateRangeChange(index) {
    var shiftlineData = [];
    this.oldindex = index;
    shiftlineData = this.scheduleListForm.value.allScheduleListData;
    var date1, date2;
    for (
      var i = 0;
      i < this.scheduleListForm.value.allScheduleListData.length;
      i++
    ) {
      if (
        i == index &&
        this.scheduleListForm.value.allScheduleListData[i].scheduleselected ==
          true
      ) {
        if (
          this.scheduleListForm.value.allScheduleListData[i].startDate != null
        ) {
          date1 = this.scheduleListForm.value.allScheduleListData[i].startDate;
        }
        if (
          this.scheduleListForm.value.allScheduleListData[i].endDate != null
        ) {
          date2 = this.scheduleListForm.value.allScheduleListData[i].endDate;
        }
      }
    }
    date1 = new Date(date1);
    date2 = new Date(date2);

    var from,
      to,
      tempfrom,
      tempto,
      dateExist = false;
    for (
      var i = 0;
      i < this.scheduleListForm.value.allScheduleListData.length;
      i++
    ) {
      if (
        this.scheduleListForm.value.allScheduleListData[i].startDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].endDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].scheduleselected ===
          true &&
        i != index
      ) {
        tempfrom = this.scheduleListForm.value.allScheduleListData[i].startDate;
        tempto = this.scheduleListForm.value.allScheduleListData[i].endDate;
        from = new Date(tempfrom);
        to = new Date(tempto);
        if (
          date1 != null &&
          date1.getTime() >= from.getTime() &&
          date1.getTime() <= to.getTime()
        ) {
          dateExist = true;
        }
        if (
          date2 != null &&
          date2.getTime() >= from.getTime() &&
          date2.getTime() <= to.getTime()
        ) {
          dateExist = true;
        }
      }
    }

    if (dateExist == true) {
      this.oldindex = index;
      this.totalSelectedShiftlineSchedule = 0;
    } else {
      this.oldindex = -1;
      for (
        var i = 0;
        i < this.scheduleListForm.value.allScheduleListData.length;
        i++
      ) {
        if (
          this.scheduleListForm.value.allScheduleListData[i].startDate !=
            null &&
          this.scheduleListForm.value.allScheduleListData[i].endDate != null &&
          this.scheduleListForm.value.allScheduleListData[i]
            .scheduleselected === true
        ) {
          this.totalSelectedShiftlineSchedule++;
        }
      }
    }
    this.isSaved = this.compareChange();
    // this.scheduleListForm  = this.fb.group({
    //   allScheduleListData: this.fb.array([]) ,
    // });
    // this.allScheduleListData.setValue(this.all_schedule_list)
  }
  getUpdatedState() {
    var temp = [];
    var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
    var tempNewObj;
    if (tempObj != null) {
      if (tempObj.shiftdefmap.length > 0) {
        // temp=tempObj.shiftdefmap
      }
    }
    for (
      var i = 0;
      i < this.scheduleListForm.value.allScheduleListData.length;
      i++
    ) {
      if (
        this.scheduleListForm.value.allScheduleListData[i].startDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].endDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].scheduleselected ===
          true
      ) {
        temp.push({
          shiftdefref:
            this.scheduleListForm.value.allScheduleListData[i].scheduleID,
          shiftdefstartdate:
            this.scheduleListForm.value.allScheduleListData[i].startDate,
          shiftdefenddate:
            this.scheduleListForm.value.allScheduleListData[i].endDate,
        });
      }
    }
    if (tempObj == null) {
      tempNewObj = {
        bidschename: null,
        bidmanagerid: this.user_data.id,
        timezone: '',
        intervalstarttime: null,
        intervalduration: null,
        hasinterval: false,
        bidroundoption: 'SAME',
        weekendstatus: false,
        bidschstartdate: null,
        bidschenddate: null,
        schedulesavestatus: 0,
        leavesavestatus: 0,
        roundsavestatus: 0,
        shiftdefmap: temp,
        employeemap: [],
        leavemap: [],
        roundmap: [],
      };
    } else {
      tempNewObj = {
        bidschename: tempObj.bidschename,
        bidmanagerid: this.user_data.id,
        timezone: tempObj.timezone,
        weekendstatus: tempObj.weekendstatus,
        bidschstartdate: tempObj.bidschstartdate,
        bidschenddate: tempObj.bidschenddate,
        intervalstarttime: tempObj.intervalstarttime,
        intervalduration: tempObj.intervalduration,
        hasinterval: tempObj.hasinterval,
        bidroundoption: tempObj.bidroundoption,
        schedulesavestatus: tempObj.schedulesavestatus,
        leavesavestatus: tempObj.leavesavestatus,
        roundsavestatus: tempObj.roundsavestatus,
        shiftdefmap: temp,
        employeemap: tempObj.employeemap,
        leavemap: tempObj.leavemap,
        roundmap: tempObj.roundmap,
      };
    }
    return tempNewObj;
  }
  compareChange() {
    return isEqual(JSON.parse(this.localData.getItem('newBidSchedule')),this.getUpdatedState());
  }

  editShiftLineForm() {}

  close() {
    this.modalCtrl.dismiss();
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  updateShiftLineForm() {}
  shiftLineForm() {
    var temp;
    this.all_schedule_list = [];
    this.updatedData = [];
    var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
    for (var i = 0; i < this.all_schedule.length; i++) {
      this.allScheduleListData.push(this.newWorkLoadData());
      temp = {
        id: i,
        startDate: null,
        endDate: null,
        scheduleName: this.all_schedule[i].schedulename,
        active: false,
        scheduleselected: false,
        scheduleID: this.all_schedule[i].sh_schedule_id,
        bidschref: '',
        bidshiftmapid: '',
      };
      this.all_schedule_list.push(temp);
      this.updatedData.push(temp);
    }
    var tempArr = [],
      tempArrTwo = [];
      var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
      if (tempObj != null && tempObj.shiftdefmap.length > 0) {
        for (var i = 0; i < tempObj.shiftdefmap.length; i++) {
          tempArrTwo.push(tempObj.shiftdefmap[i].shiftdefref);
        }
        for (var i = 0; i < this.all_schedule_list.length; i++) {
          var a = tempArrTwo.includes(this.all_schedule_list[i].scheduleID);
          this.totalSelectedShiftlineSchedule++;
          if (a == false) {
            tempArr.push({
              id: i,
              startDate: null,
              endDate: null,
              scheduleName: this.all_schedule_list[i].scheduleName,
              active: false,
              scheduleselected: false,
              scheduleID: this.all_schedule_list[i].scheduleID,
              bidschref: '',
              bidshiftmapid: '',
            });
          } else {
            for (var j = 0; j < tempObj.shiftdefmap.length; j++) {
              if (
                tempObj.shiftdefmap[j].shiftdefref ===
                this.all_schedule_list[i].scheduleID
              ) {
                tempArr.push({
                  id: i,
                  startDate: this.dateFinalConvert(
                    tempObj.shiftdefmap[j].shiftdefstartdate
                  ),
                  endDate: this.dateFinalConvert(
                    tempObj.shiftdefmap[j].shiftdefenddate
                  ),
                  scheduleName: this.all_schedule_list[i].scheduleName,
                  active: this.all_schedule_list[i].active,
                  scheduleselected: true,
                  scheduleID: this.all_schedule_list[i].scheduleID,
                  bidschref: tempObj.shiftdefmap[j].bidschref,
                  bidshiftmapid: tempObj.shiftdefmap[j].bidshiftmapid,
                });
              }
            }
          }
        }
        this.all_schedule_list = tempArr;
        this.allScheduleListData.setValue(this.all_schedule_list);
      } else {
        this.allScheduleListData.setValue(this.all_schedule_list);
      }
  }
  setAll(e) {}
  dateFinalConvert(date) {
    var result = date.includes('T');
    if (result == false) {
      var temp = date.split('-');
      var newDate = new Date(
        temp[0],
        Number(temp[1]) + -+1,
        Number(temp[2]),
        0,
        0,
        0
      );
      return newDate;
    } else {
      var temp = date.split('T');
      temp = temp[0].split('-');
      var newDate = new Date(
        temp[0],
        Number(temp[1]) + -+1,
        Number(temp[2]),
        0,
        0,
        0
      );
      return newDate;
    }
  }
  dateConvert(date) {
    var temp = date.split('-');
    var newDate = new Date(
      temp[0],
      Number(temp[1]) + -+1,
      Number(temp[2]),
      0,
      0,
      0
    );
    return newDate;
  }
  allShceduleBasedOnBidScheduleName() {
    var b_schedule_name = this.bid_schedule_data.SBP_schedule_name;
    if (b_schedule_name !== '') {
      this.bidScheduleSer.getScheduleNameBasedOnBidScheduleName(b_schedule_name)
        .subscribe(
          (res) => {
            this.allScheduleData = [];
            this.allScheduleData = res;

            // this.multiDimensionalUniqueForShiftLineSchedule(res)
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
    }
  }


  async customSchedule() {
    const modal = await this.modalCtrl.create({
      component: CustomSchedulePopupComponent,
      cssClass: 'ImportScheduleModal',
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  showOptions(i) {
    if (this.oldindex > 0) {
      if (i == this.oldindex) {
        this.oldindex = -1;
        if (
          this.scheduleListForm.value.allScheduleListData[i].startDate !=
            null &&
          this.scheduleListForm.value.allScheduleListData[i].endDate != null &&
          this.scheduleListForm.value.allScheduleListData[i].scheduleselected ==
            false
        ) {
          if (this.totalSelectedShiftlineSchedule > 0) {
            this.totalSelectedShiftlineSchedule--;
          }
        }
      }
    }
    this.dateRangeChange(i);
  }

  formatDate(date) {
    var d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  all_bid_round_data;
  totalDefaultEmp = 0;
  defaultMAxLeave;
  totalEmp = 0;
  maxLeave = 0;
  totalBidRounds = 0;
  allRoundInfo = [];
  getAllEmployeeList() {
    this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res) => {
        this.allEmployee = res;
        // this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)
        var tempArr = [];

        if (this.isEditBidSchedule == false) {
          var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
          for (var i = 0; i < this.allEmployee.length; i++) {
            for (var j = 0; j < tempObj.employeemap.length; j++) {
              if (this.allEmployee[i].empid === tempObj.employeemap[j]) {
                tempArr.push(this.allEmployee[i].vacation);
              }
            }
          }
        } else {
          var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
          for (var i = 0; i < this.allEmployee.length; i++) {
            for (var j = 0; j < tempObj.employeemap.length; j++) {
              if (
                this.allEmployee[i].empid === tempObj.employeemap[j].empidref
              ) {
                tempArr.push(this.allEmployee[i].vacation);
              }
            }
          }
        }

        this.maxLeave = Math.max(...tempArr);
        this.defaultMAxLeave = this.maxLeave;
        if (this.maxLeave > 208) {
          this.maxLeave = 208;
          this.defaultMAxLeave = this.maxLeave;
        }
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
    this.totalEmployees();
  }
  bidSchedule;
  all_final_data_for_total_emp = new Array();
  shiftLinesSchedule = new Array();
  shiftlineScheduleData;
  totalEmployees() {
    if (this.isEditBidSchedule == false) {
      this.bidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));
    } else {
      this.bidSchedule = JSON.parse(this.localData.getItem('editBidSchedule'));
    }

    this.shiftLinesSchedule = new Array();
    this.all_final_data_for_total_emp = new Array();
    if (this.bidSchedule != null) {
      for (var i = 0; i < this.bidSchedule.shiftdefmap.length; i++) {
        this.scheduleService
          .newgetAllShiftLinesBasedOnScheduleId(
            this.bidSchedule.shiftdefmap[i].shiftdefref
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
    }
  }
  convertArrayData() {
    var tempArr = new Array();
    tempArr = this.shiftLinesSchedule;

    for (var i = 0; i < tempArr.length; i++) {
      for (var j = 0; j < this.bidSchedule.shiftdefmap.length; j++) {
        if (
          tempArr[i].sh_schedule_id ===
          this.bidSchedule.shiftdefmap[j].shiftdefref
        ) {
          this.largestNumber(tempArr[i].schild.length);
        }
      }
    }

    this.onChange();
  }
  largestNumber(arr) {
    this.all_final_data_for_total_emp.push(arr);
    return (this.totalEmp = Math.max(...this.all_final_data_for_total_emp));
  }

  addBidRound(bid_round_data) {
    bid_round_data = this.all_bid_round_data;
    var temp;
    var tempArr = [];

    if (this.isEditBidSchedule == false) {
      var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
    } else {
      var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
    }
    var tempNewObj;
    if (tempObj != null) {
      for (var i = 0; i < bid_round_data.length; i++) {
        temp = {
          bidroundid: bid_round_data[i].bidroundid,
          bidschref: bid_round_data[i].bidschref,
          roundduration: bid_round_data[i].bid_duration,
          roundstartdate: bid_round_data[i].bidroundstartdate,
          roundenddate: bid_round_data[i].bidroundenddate,
          actual_bidround_start_time: bid_round_data[i].daily_starttime,
          actual_bidround_end_time: bid_round_data[i].daily_endttime,

          bidleavereason: bid_round_data[i].bidleavereason,
          roundstarttime: bid_round_data[i].roundstarttime,
          roundendttime: bid_round_data[i].roundendttime,
          roundseq_id: i + +(+1),
        };
        tempArr.push(temp);
      }
      // }
      temp = tempArr;
    } else {
      for (var i = 0; i < bid_round_data.length; i++) {
        temp = {
          bidroundid: bid_round_data[i].bidroundid,
          bidschref: bid_round_data[i].bidschref,
          roundduration: bid_round_data[i].bid_duration,
          roundstartdate: bid_round_data[i].bidroundstartdate,
          roundenddate: bid_round_data[i].bidroundenddate,

          bidleavereason: bid_round_data[i].bidleavereason,
          roundstarttime: bid_round_data[i].roundstarttime,
          roundendttime: bid_round_data[i].roundendttime,

          actual_bidround_start_time: bid_round_data[i].daily_starttime,
          actual_bidround_end_time: bid_round_data[i].daily_endttime,
          roundseq_id: i + +(+1),
        };

        tempArr.push(temp);
      }

      temp = tempArr;
    }
    var finalArr = [];
    if (this.isEditBidSchedule != false) {
      if (tempObj != null) {
        if (tempArr.length > 0) {
          for (var i = 0; i < tempArr.length; i++) {
            if (tempObj.roundmap.length > i) {
              temp = {
                bidroundid: tempObj.roundmap[i].bidroundid,
                bidschref: this.bidScheduleId,
                roundduration: tempArr[i].roundduration,
                roundstartdate: tempArr[i].roundstartdate,
                roundenddate: tempArr[i].roundenddate,
                bidleavereason: tempArr[i].bidleavereason,
                roundstarttime: tempArr[i].roundstarttime,
                roundendttime: tempArr[i].roundendttime,
                actual_bidround_start_time:
                  tempArr[i].actual_bidround_start_time,
                actual_bidround_end_time: tempArr[i].actual_bidround_end_time,
                roundseq_id: i + +(+1),
              };
            } else {
              temp = {
                bidroundid: '',
                bidschref: this.bidScheduleId,
                roundduration: temp[i].roundduration,
                roundstartdate: temp[i].roundstartdate,
                roundenddate: temp[i].roundenddate,
                bidleavereason: temp[i].bidleavereason,
                roundstarttime: temp[i].roundstarttime,
                roundendttime: temp[i].roundendttime,
                actual_bidround_start_time: temp[i].actual_bidround_start_time,
                actual_bidround_end_time: temp[i].actual_bidround_end_time,
                roundseq_id: i + +(+1),
              };
            }
            finalArr.push(temp);
          }
        }
      }
      temp = finalArr;
    }

    if (tempObj == null) {
      tempNewObj = {
        bidschename: null,
        bidmanagerid: this.user_data.id,
        timezone: '',
        intervalstarttime: null,
        intervalduration: null,
        hasinterval: false,
        bidroundoption: 'SAME',
        bidschstartdate: null,
        bidschenddate: null,
        weekendstatus: false,
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
        bidschstartdate: tempObj.bidschstartdate,
        timezone: tempObj.timezone,
        weekendstatus: tempObj.weekendstatus,
        intervalstarttime: tempObj.intervalstarttime,
        intervalduration: tempObj.intervalduration,
        hasinterval: tempObj.hasinterval,
        bidroundoption: tempObj.bidroundoption,
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

    if (this.isEditBidSchedule == false) {
      this.localData.setItem('newBidSchedule', JSON.stringify(tempNewObj));
    } else {
      this.localData.setItem('editBidSchedule', JSON.stringify(tempNewObj));
    }
    // this.onChange()
    this.modalCtrl.dismiss();
  }

  roundStartTime;

  onChange() {
    this.all_SBP_rounds = [];
    var startDate,
      endDate,
      startTime,
      endTime,
      duration,
      leaveRule,
      tempArr = [];
    var newBidSchedule;
    if (this.isEditBidSchedule == false) {
      newBidSchedule = JSON.parse(this.localData.getItem('newBidSchedule'));
    } else {
      newBidSchedule = JSON.parse(this.localData.getItem('editBidSchedule'));
    }

    startDate = this.dateFinalConvert(
      newBidSchedule.roundmap[0].roundstartdate
    );
    startTime = newBidSchedule.roundmap[0].roundstarttime;
    endTime = newBidSchedule.roundmap[0].roundendttime;

    var totalRequiredRounds = 0;

    // this.defaultMAxLeave=208
    // this.totalEmp=33
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
      if (i == 0) {
        temp = { id: i, roundduration: '00:30:00', leaveRule: '2 weeks NC' };
      } else {
        temp = { id: i, roundduration: '00:15:00', leaveRule: '1 week' };
      }

      tempArr.push(temp);
    }
    this.allRoundInfo = [];
    this.all_SBP_rounds = tempArr;
    this.allRoundInfo = tempArr;
    var temp;
    tempArr = [];
    this.totalEmp = newBidSchedule.employeemap.length;

    this.totalBidRounds = totalRequiredRounds;
    this.totalDefaultEmp = this.totalEmp;
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

    this.displayRoundData(0, newBidSchedule.roundmap[0]);
  }
  all_window_data = [];
  all_SBP_rounds = [];
  currentactiveRoundNumber = 0;
  all_bid_WindoRound_data;
  finalViewBidWindowData = [];

  displayRoundData(i, newBidSchedule) {
    this.currentactiveRoundNumber = i;
    i = i;
    var temp = this.all_window_data;
    this.all_bid_WindoRound_data = [];
    if (this.currentactiveRoundNumber == i) {
      for (var j = 0; j < this.all_SBP_rounds.length; j++) {
        i = j;
        this.finalViewBidWindowData = [];
        for (var l = 0; l < temp.length; l++) {
          if (new Date() >= temp[l].startTime) {
            if (new Date() > temp[l].endTime) {
              if (i + +(+1) == temp[l].round) {
                this.finalViewBidWindowData.push({
                  id: l + 1,
                  startTime: temp[l].startTime,
                  status: 2,
                  endTime: temp[l].endTime,
                  empName: '',
                  empInitial: '',
                  round: temp[l].round,
                  duration: temp[l].duration,
                });
              }
            } else {
              if (i + +(+1) == temp[l].round) {
                this.finalViewBidWindowData.push({
                  id: l + 1,
                  startTime: temp[l].startTime,
                  status: 1,
                  endTime: temp[l].endTime,
                  empName: '',
                  empInitial: '',
                  round: temp[l].round,
                  duration: temp[l].duration,
                });
              }
            }
          } else if (new Date() < temp[l].startTime) {
            if (i + +(+1) == temp[l].round) {
              this.finalViewBidWindowData.push({
                id: l + 1,
                startTime: temp[l].startTime,
                status: 0,
                endTime: temp[l].endTime,
                empName: 'Vrushang Patel',
                empInitial: 'VP',
                round: temp[l].round,
                duration: temp[l].duration,
              });
            }
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
        roundstarttime: newBidSchedule.roundstarttime,
        roundendttime: newBidSchedule.roundendttime,
        roundsavestatus: 1,
      });
    }
    this.all_bid_round_data = all_bid_round_data;

    this.addBidRound(this.all_bid_round_data);
  }

  checkSingleDigit(number) {
    if (Number(number) < 10) {
      return '0' + number;
    } else {
      return number;
    }
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
}
