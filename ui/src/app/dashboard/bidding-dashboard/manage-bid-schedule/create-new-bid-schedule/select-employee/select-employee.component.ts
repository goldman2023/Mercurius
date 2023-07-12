import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  AlertController,
  ModalController,
  NavController,
  NavParams
} from '@ionic/angular';
import { isEqual } from 'lodash';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { AddNewEmployeeComponent } from 'src/app/dashboard/add-new-employee/add-new-employee.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import Swal from 'sweetalert2';
import { BID_ROUND_OPTIONS } from 'src/constants/bid-round';
@Component({
  selector: 'app-select-employee',
  templateUrl: './select-employee.component.html',
  styleUrls: ['./select-employee.component.scss'],
})
export class SelectEmployeeComponent implements OnInit {
  @Input() isModal: boolean = true;
  @Input() isEditBidSchedule: boolean = false;
  @Input() completed: boolean = false;
  @Output() employeesSelected = new EventEmitter();
  @Output() employeesUpdated = new EventEmitter();
  @Output() employeesLoaded = new EventEmitter();
  isSaved = false;
  roundListForm: FormGroup;
  employeeListForm: FormGroup;
  all_schedule_list: any[];
  updatedData: any[];
  allEmployee = [];
  user_data: any;
  all_emp = [];
  selectAllEmp = true;
  totalSelectdEmployees = 0;
  bidScheduleId: string;
  disablebutton = false;
  constructor(
    public navCtrl: NavController,
    private headerTitleService: HeaderTitleService,
    public navParams: NavParams,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    public alertCtrl: AlertController,
    private getAllEmp: AddNewEmployeeService,
    public alertController: AlertController,
    private scheduleService: GeneratedScheduleService,
    private localData: LocalDataService,
    private setUPbidRoundSer: SetupBidRoundService
  ) {
    this.isEditBidSchedule = navParams.get('editBidSchedule');
  }

  ngOnInit() {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.masterSelected = false;
    this.employeeListForm = this.fb.group({
      allEmployeeListData: this.fb.array([]),
    });
    this.getAllEmployeeList();
  }
  get allEmployeeListData(): FormArray {
    return this.employeeListForm.get('allEmployeeListData') as FormArray;
  }
  newWorkLoadData(): FormGroup {
    return this.fb.group({
      id: new FormControl(),
      empId: new FormControl(),
      empfName: new FormControl(),
      emplName: new FormControl(),
      empRank: new FormControl(),
      selected: new FormControl(),
      empInitial: new FormControl(),
      vacation: new FormControl(),
      role: new FormControl(),
      bidemployeemapid: new FormControl(),
      bidschref: new FormControl(),
      accumulatedleave: new FormControl(),
      status: new FormControl()
    });
  }
  popUp() {
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
  }
  getAllEmployeeList() {
    this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res) => {
        this.allEmployee = res;
        this.allEmployee = this.allEmployee.sort((a, b) => a.rank - b.rank);
        this.shiftLineForm();
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.compareChanged();
      }
    );
  }
  selectAll(e) {
    this.selectAllEmp = e.detail.checked;
    if (e.detail.checked) {
    }
  }
  masterSelected;
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (
      var i = 0;
      i < this.employeeListForm.value.allEmployeeListData.length;
      i++
    ) {
      this.employeeListForm.value.allEmployeeListData[i].selected =
        this.masterSelected;
    }
    this.getCheckedItemList();
    this.compareChanged();
  }

  checklist: any;
  checkedList: any;
  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.employeeListForm.value.allEmployeeListData.every(
      function (item: any) {
        return item.selected == true;
      }
    );
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.all_schedule_list = [];
    this.updatedData = [];
    for (
      var i = 0;
      i < this.employeeListForm.value.allEmployeeListData.length;
      i++
    ) {
      if (this.employeeListForm.value.allEmployeeListData[i].selected)
        this.updatedData.push(
          this.employeeListForm.value.allEmployeeListData[i]
        );
      this.all_schedule_list.push(
        this.employeeListForm.value.allEmployeeListData[i]
      );
    }
    this.allEmployeeListData.setValue(this.all_schedule_list);
    this.showOptions();
  }

  shiftLineForm() {
    var temp;
    this.all_schedule_list = [];
    this.updatedData = [];

    if (!this.isEditBidSchedule) {
      var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
      for (var i = 0; i < this.allEmployee.length; i++) {
        this.allEmployeeListData.push(this.newWorkLoadData());
        temp = {
          id: i,
          vacation: this.allEmployee[i].vacation,
          empId: this.allEmployee[i].empid,
          selected: true,
          empInitial: this.allEmployee[i].initials,
          empRank: this.allEmployee[i].rank,
          empfName: this.allEmployee[i].fname,
          emplName: this.allEmployee[i].lname,
          role: this.allEmployee[i].role,
          bidemployeemapid: '',
          bidschref: '',
          accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
          status: this.allEmployee[i].status
        };
        this.all_schedule_list.push(temp);
        this.updatedData.push(temp);
      }
      this.all_emp = [];
      if (tempObj != null && tempObj.employeemap.length > 0) {
        for (var i = 0; i < this.all_schedule_list.length; i++) {
          var a = tempObj.employeemap.includes(this.all_schedule_list[i].empId);
          if (!a) {
            this.all_emp.push({
              id: i,
              empId: this.all_schedule_list[i].empId,
              selected: false,
              empInitial: this.all_schedule_list[i].empInitial,
              empRank: this.all_schedule_list[i].empRank,
              empfName: this.all_schedule_list[i].empfName,
              emplName: this.all_schedule_list[i].emplName,
              bidemployeemapid: '',
              bidschref: '',
              vacation: this.allEmployee[i].vacation,
              role: this.allEmployee[i].role,
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
              status: this.allEmployee[i].status
            });
          } else {
            this.all_emp.push({
              id: i,
              empId: this.all_schedule_list[i].empId,
              selected: true,
              empInitial: this.all_schedule_list[i].empInitial,
              empRank: this.all_schedule_list[i].empRank,
              empfName: this.all_schedule_list[i].empfName,
              emplName: this.all_schedule_list[i].emplName,
              bidemployeemapid: '',
              bidschref: '',
              vacation: this.allEmployee[i].vacation,
              role: this.allEmployee[i].role,
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
              status: this.allEmployee[i].status
            });
          }
        }
        this.allEmployeeListData.setValue(this.all_emp);
      } else {
        this.allEmployeeListData.setValue(this.all_schedule_list);
      }
    } else {
      var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
      this.bidScheduleId = tempObj.bidschid;
      for (var i = 0; i < this.allEmployee.length; i++) {
        this.allEmployeeListData.push(this.newWorkLoadData());
        temp = {
          id: i,
          vacation: this.allEmployee[i].vacation,
          empId: this.allEmployee[i].empid,
          selected: false,
          empInitial: this.allEmployee[i].initials,
          empRank: this.allEmployee[i].rank,
          empfName: this.allEmployee[i].fname,
          emplName: this.allEmployee[i].lname,
          bidemployeemapid: '',
          bidschref: '',
          role: '',
          accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
          status: this.allEmployee[i].status
        };
        this.all_schedule_list.push(temp);
        this.updatedData.push(temp);
      }
      this.all_emp = [];
      var tempArr = [],
        a;
      var bidemployeemapid = null,
        tempbidschref = null;
      if (tempObj != null && tempObj.employeemap.length > 0) {
        for (var i = 0; i < tempObj.employeemap.length; i++) {
          tempArr.push(tempObj.employeemap[i].empidref);
        }
        for (var i = 0; i < this.all_schedule_list.length; i++) {
          a = tempArr.includes(this.all_schedule_list[i].empId);
          for (var k = 0; k < tempObj.employeemap.length; k++) {
            if (
              tempObj.employeemap[k].empidref ===
              this.all_schedule_list[i].empId
            ) {
              bidemployeemapid = tempObj.employeemap[k].bidemployeemapid;
              tempbidschref = tempObj.employeemap[k].bidschref;
            }
          }
          if (!a) {
            this.all_emp.push({
              id: i,
              vacation: this.allEmployee[i].vacation,
              empId: this.all_schedule_list[i].empId,
              selected: false,
              empInitial: this.all_schedule_list[i].empInitial,
              empRank: this.all_schedule_list[i].empRank,
              empfName: this.all_schedule_list[i].empfName,
              emplName: this.all_schedule_list[i].emplName,
              bidemployeemapid: '',
              bidschref: '',
              role: '',
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
              status: this.allEmployee[i].status
            });
          } else {
            this.all_emp.push({
              id: i,
              vacation: this.allEmployee[i].vacation,
              empId: this.all_schedule_list[i].empId,
              selected: true,
              empInitial: this.all_schedule_list[i].empInitial,
              empRank: this.all_schedule_list[i].empRank,
              empfName: this.all_schedule_list[i].empfName,
              emplName: this.all_schedule_list[i].emplName,
              bidemployeemapid: bidemployeemapid,
              bidschref: tempbidschref,
              role: '',
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0',
              status: this.allEmployee[i].status
            });
          }
        }
        this.allEmployeeListData.setValue(this.all_emp);
      } else {
        this.allEmployeeListData.setValue(this.all_schedule_list);
      }
    }

    this.showOptions();
  }
  totalRequiredHours = 0;
  totalAccumulatedLeaves = 0;
  showOptions() {
    this.totalRequiredHours = 0;
    this.totalAccumulatedLeaves = 0;
    this.totalSelectdEmployees = 0;
    for (
      var i = 0;
      i < this.employeeListForm.value.allEmployeeListData.length;
      i++
    ) {
      if (this.employeeListForm.value.allEmployeeListData[i].selected == true) {
        this.totalSelectdEmployees++;
        this.totalRequiredHours =
          this.totalRequiredHours +
          +(+this.employeeListForm.value.allEmployeeListData[i].vacation);
          this.totalAccumulatedLeaves += +(+Number(this.employeeListForm.value.allEmployeeListData[i].accumulatedleave));
      }
    }
    if (
      this.employeeListForm.value.allEmployeeListData.length ==
      this.totalSelectdEmployees
    ) {
      if (
        this.totalSelectdEmployees == 0 &&
        this.employeeListForm.value.allEmployeeListData.length == 0
      ) {
        this.masterSelected = false;
      } else {
        this.masterSelected = true;
      }
    }
    if(this.isEditBidSchedule){
      this.localData.setItem(
        'edittotalAccumulatedLeaves',
        JSON.stringify(this.totalAccumulatedLeaves)
      )
      this.localData.setItem('edittotalRequiredVacationHours',JSON.stringify(this.totalRequiredHours));

      if (!this.isModal) {
        this.employeesLoaded.emit();
      }
    }
    this.compareChanged();
  }
  getNewState() {
    var temp = [];
    for (
      var i = 0;
      i < this.employeeListForm.value.allEmployeeListData.length;
      i++
    ) {
      if (this.employeeListForm.value.allEmployeeListData[i].selected == true) {
        temp.push(this.employeeListForm.value.allEmployeeListData[i].empId);
      }
    }
    this.totalEmp = temp.length;
    var tempObj = JSON.parse(this.localData.getItem('newBidSchedule'));
    const prevState = tempObj?.employeemap;
    this.isSaved = isEqual(prevState, temp);
    var tempNewObj;
    if (tempObj == null) {
      tempNewObj = {
        bidschename: null,
        bidmanagerid: this.user_data.id,
        timezone: '',
        weekendstatus: false,
        bidschstartdate: null,
        bidschenddate: null,
        schedulesavestatus: 0,
        leavesavestatus: 0,
        roundsavestatus: 0,
        shiftdefmap: [],
        employeemap: temp,
        leavemap: [],
        roundmap: [],
        hasinterval: false,
        intervalduration: null,
        intervalstarttime: null,
        bidroundoption: BID_ROUND_OPTIONS.SAME
      };
    } else {
      tempNewObj = {
        bidschename: tempObj.bidschename,
        bidmanagerid: this.user_data.id,
        timezone: tempObj.timezone,
        weekendstatus: tempObj.weekendstatus,
        bidschstartdate: tempObj.bidschstartdate,
        bidschenddate: tempObj.bidschenddate,
        schedulesavestatus: tempObj.schedulesavestatus,
        leavesavestatus: tempObj.leavesavestatus,
        roundsavestatus: tempObj.roundsavestatus,
        shiftdefmap: tempObj.shiftdefmap,
        employeemap: temp,
        leavemap: tempObj.leavemap,
        roundmap: tempObj.roundmap,
        hasinterval: tempObj.hasinterval,
        intervalduration: tempObj.intervalduration,
        intervalstarttime: tempObj.intervalstarttime,
        bidroundoption: tempObj.bidroundoption
      };
    }
    return tempNewObj;
  }
  compareChanged() {
    if (this.isEditBidSchedule) {
      this.getUpdatedState();
    } else {
      this.getNewState();
    }
  }
  showSuccessAlert(type: string, callback: () => void) {
    Swal.fire({
      title: 'Success!',
      html: `Employees were ${type} successfully!`,
      icon: 'success',
      showCancelButton: false,
      imageHeight: '250px',
      heightAuto: false,
      confirmButtonColor: '#ff6700',
      timer: 1500,
    }).then(callback);
  }
  save() {
    this.localData.setItem(
      'newBidSchedule',
      JSON.stringify(this.getNewState())
    );
    this.showSuccessAlert('saved', () => {
      let selected = {
        totalRequired: this.totalRequiredHours,
        totalAccumulatedLeaves: this.totalAccumulatedLeaves,
        updatedValue: true,
      };
      if (!this.isModal) {
        this.employeesSelected.emit(selected);
      } else {
        this.modalCtrl.dismiss(selected);
      }
      this.isSaved = true;
    });
  }
  close() {
    this.modalCtrl.dismiss({
      totalRequired: this.totalRequiredHours,
      totalAccumulatedLeaves: this.totalAccumulatedLeaves,
      updatedValue: false,
    });
  }
  async addNewEmp() {
    const modal = await this.modalCtrl.create({
      component: AddNewEmployeeComponent,
      cssClass: 'add-emp',
      componentProps: { data: null, edit: false },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });

    return await modal.present();
  }
  getUpdatedState() {
    var temp = [];
    var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));

    for (
      var i = 0;
      i < this.employeeListForm.value.allEmployeeListData.length;
      i++
    ) {
      if (this.employeeListForm.value.allEmployeeListData[i].selected == true) {
        temp.push({
          bidemployeemapid:
            this.employeeListForm.value.allEmployeeListData[i].bidemployeemapid,
          bidschref:
            this.employeeListForm.value.allEmployeeListData[i].bidschref,
          empidref: this.employeeListForm.value.allEmployeeListData[i].empId,
          employeebidstatus:
            tempObj?.employeemap?.[i]?.employeebidstatus ?? null,
        });
        // )
      }
    }

    const prevState = tempObj?.employeemap;
    this.isSaved = isEqual(prevState, temp);
    var tempNewObj;
    if (tempObj == null) {
      tempNewObj = {
        bidschename: null,
        bidmanagerid: this.user_data.id,
        bidschid: this.bidScheduleId,
        timezone: '',
        bidschstartdate: null,
        weekendstatus: false,
        bidschenddate: null,
        schedulesavestatus: 0,
        leavesavestatus: 0,
        roundsavestatus: 0,
        shiftdefmap: [],
        employeemap: temp,
        leavemap: [],
        roundmap: [],
        hasinterval: false,
        intervalduration: null,
        intervalstarttime: null,
        bidroundoption: BID_ROUND_OPTIONS.SAME
      };
    } else {
      tempNewObj = {
        bidschename: tempObj.bidschename,
        bidmanagerid: this.user_data.id,
        bidschid: this.bidScheduleId,
        timezone: tempObj.timezone,
        weekendstatus: tempObj.weekendstatus,
        bidschstartdate: tempObj.bidschstartdate,
        bidschenddate: tempObj.bidschenddate,
        schedulesavestatus: tempObj.schedulesavestatus,
        leavesavestatus: tempObj.leavesavestatus,
        roundsavestatus: tempObj.roundsavestatus,
        shiftdefmap: tempObj.shiftdefmap,
        employeemap: temp,
        leavemap: tempObj.leavemap,
        roundmap: tempObj.roundmap,
        hasinterval: tempObj.hasinterval,
        intervalduration: tempObj.intervalduration,
        intervalstarttime: tempObj.intervalstarttime,
        bidroundoption: tempObj.bidroundoption
      };
    }
    return tempNewObj;
  }
  update() {
    let bidSchedule = this.getUpdatedState();
    this.localData.setItem(
      'editBidSchedule',
      JSON.stringify(bidSchedule)
    );
    this.showSuccessAlert('updated', () => {
      this.isSaved = true;
      let updated = {
        totalRequired: this.totalRequiredHours,
        totalAccumulatedLeaves: this.totalAccumulatedLeaves,
        updatedValue: true,
        updatedEmployeeMap: [...bidSchedule.employeemap],
      };
      this.isModal
        ? this.modalCtrl.dismiss(updated)
        : this.employeesUpdated.emit(updated);
    });
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

  dateFinalConvert(date) {
    var result = date.includes('T');
    if (!result) {
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

  all_bid_round_data;
  totalDefaultEmp = 0;
  defaultMAxLeave;
  totalEmp = 0;
  maxLeave = 0;
  totalBidRounds = 0;
  allRoundInfo = [];
  getAllEmployeelist() {
    this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res) => {
        this.allEmployee = res;
        // this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)
        var tempArr = [];

        if (!this.isEditBidSchedule) {
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
  cssForTotalEmployee(totalSelectdEmployees) {
    if (totalSelectdEmployees < 10) {
      return 'round-button-single-digit data';
    } else if (totalSelectdEmployees > 9 && totalSelectdEmployees < 100) {
      return 'round-button-double-digit data';
    } else {
      return 'round-button-three-digit data';
    }
  }
  totalEmployees() {
    if (!this.isEditBidSchedule) {
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
              //
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

    // this.onChange()
  }
  largestNumber(arr) {
    this.all_final_data_for_total_emp.push(arr);
    return (this.totalEmp = Math.max(...this.all_final_data_for_total_emp));
  }

  addBidRound(bid_round_data) {
    bid_round_data = this.all_bid_round_data;

    var temp;
    var tempArr = [];

    if (!this.isEditBidSchedule) {
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
        bidschstartdate: null,
        timezone: '',
        weekendstatus: false,
        bidschenddate: null,
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
        roundmap: temp,
      };
    }

    if (!this.isEditBidSchedule) {
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
    if (!this.isEditBidSchedule) {
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
        bidschref: '',
        bidroundid: '',
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
  lastUpdatedData;
  async edit(empData) {
    const modal = await this.modalCtrl.create({
      component: AddNewEmployeeComponent,
      cssClass: 'add-emp',
      componentProps: { data: empData, edit: true },
      swipeToClose: true,
    });
    modal.onDidDismiss().then((data) => {
      this.lastUpdatedData = empData;

      // this.getAllEmployeeList()
      this.ngOnInit();
    });

    return await modal.present();
  }
  async deleteEmp(data) {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to delete the record?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Delete',
          role: 'delete',
          handler: () => {
            this.getAllEmp.deleteEmp(data.empId).subscribe(
              async (res) => {
                const alertC = await this.alertController.create({
                  cssClass: 'my-custom-class',
                  header: 'Success',
                  message: 'Deleted Successfully!',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {},
                    },
                  ],
                });
                await alertC.present();
              },
              (err) => {
                console.log(err);
              },
              () => {
                this.ngOnInit();
              }
            );
          },
        },
      ],
    });
    await confirm.present();
  }
  employeeStatus(employee) {
    if (employee.status != 0) { // just in case if status colunm is attached in response
      return "Deactivate"
    } else return "Activate"
  }
  async updateEmployeeStatus(data) {
    const employeeStatusMessage = this.employeeStatus(data);
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: `Are you sure you want to ${employeeStatusMessage} the Employee?`,
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: `${employeeStatusMessage}`,
          role: 'update',
          handler: () => {
            const updateEmployeeStatusData = employeeStatusMessage == "Deactivate" ? 0 : 1;
            this.getAllEmp.updateEmpStatusBasedOnId(data.empId, updateEmployeeStatusData).subscribe(
                async (res) => {
                  const alertC = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Success',
                    message: `Employee ${employeeStatusMessage}d Successfully!`,
                    buttons: [
                      {
                        text: 'Ok',
                        role: 'cancel',
                      handler: () => { },
                      },
                    ],
                  });
                  await alertC.present();
                },
                async (err) => {
                  const alertC = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Error',
                    message: 'Failed to Update Data',
                    buttons: [
                      {
                        text: 'Ok',
                        role: 'cancel',
                      handler: () => { },
                      },
                    ],
                  });
                  await alertC.present();
                  console.log(err);
                },
                () => {
                  this.ngOnInit();
                }
              );
          },
        },
      ],
    });
    await confirm.present();
  }
  checkUpdatedEmployee() {
    return 'data ion-no-padding ion-no-margin ion-text-center';
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
