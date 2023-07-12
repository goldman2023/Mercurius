import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

@Component({
  selector: 'app-view-select-employee',
  templateUrl: './view-select-employee.component.html',
  styleUrls: ['./view-select-employee.component.scss']
})
export class ViewSelectEmployeeComponent implements OnInit {
  @Input() isModal: boolean = true;
  @Input() completed: boolean = false;
  @Input() totalAccumulatedLeaves: number = 0;
  @Output() employeesSelected = new EventEmitter();
  @Output() employeesUpdated = new EventEmitter();
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
      accumulatedleave: new FormControl()
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
      () => {}
    );
  }
  selectAll(e) {
    this.selectAllEmp = e.detail.checked;
    if (e.detail.checked) {
    }
  }
  masterSelected;

  checklist: any;
  checkedList: any;
  // Check All Checkbox Checked

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
      var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
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
          accumulatedleave: this.allEmployee[i].accumulatedleave || '0'
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
          if (a == false) {
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
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0'
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
              accumulatedleave: this.allEmployee[i].accumulatedleave || '0'
            });
          }
        }
        this.allEmployeeListData.setValue(this.all_emp);
      } else {
        this.allEmployeeListData.setValue(this.all_schedule_list);
      }

    this.showOptions();
  }
  totalRequiredHours = 0;
  showOptions() {
    this.totalRequiredHours = 0;
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
  }

  close() {
    this.modalCtrl.dismiss({
      totalRequired: this.totalRequiredHours,
      updatedValue: false,
    });
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


          var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
          for (var i = 0; i < this.allEmployee.length; i++) {
            for (var j = 0; j < tempObj.employeemap.length; j++) {
              if (
                this.allEmployee[i].empid === tempObj.employeemap[j].empidref
              ) {
                tempArr.push(this.allEmployee[i].vacation);
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
      this.bidSchedule = JSON.parse(this.localData.getItem('viewBidSchedule'));


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


      var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));

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


      this.localData.setItem('viewBidSchedule', JSON.stringify(tempNewObj));

    this.modalCtrl.dismiss();
  }




}
