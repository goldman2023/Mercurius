import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  NavParams,
  ActionSheetController,
} from '@ionic/angular';
import { element } from 'protractor';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { BidScheduleService } from 'src/app/services/bidschedule/bid-schedule.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-select-vacation-slots',
  templateUrl: './view-select-vacation-slots.component.html',
  styleUrls: ['./view-select-vacation-slots.component.scss'],
})
export class ViewSelectVacationSlotsComponent implements OnInit, OnChanges {
  @Input() isModal: boolean = true;
  @Input() totalRequiredVacationHours: number = 0;
  @Input() totalAccumulatedLeaves: number = 0;
  @Input() completed: boolean = false;
  @Output() slotsSelected = new EventEmitter();
  @Output() slotsUpdated = new EventEmitter();
  isSaved: boolean = false;
  totalHours = 0;
  setUpBidParametersForm: FormGroup;
  bid_schedule_data: any;
  all_schedule: any;
  selected_schedule_data: any;
  user_data: any;
  allShiftData = [];
  old_list = [];
  getAllScheduleName: any[];
  allEmployee = [];
  scheduleListForm: any;
  schedule_data = [];
  lastDate;
  all_vacation_slots_list = [];
  checkDate = [];
  dateValidation = false;
  checkShiftLineSchedule = false;
  setUpBidScheduleOne: any;
  updatedData: any[];
  allScheduleData = [];
  disable = true;
  countOfDateRange = 0;
  all_final_data = [];
  view_bid_schedule_id;
  updatedValue = false;
  newBidSchedule;
  minDate = new Date();
  totalRequiredHours = 0;
  remainingAccuredHours = 0;
  totalAccuredHours = 0;
  isValid: boolean = false;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private getAllEmp: AddNewEmployeeService,
    private scheduleService: GeneratedScheduleService,
    private headerTitleService: HeaderTitleService,
    private activaRouter: ActivatedRoute,
    private bidScheduleSer: BidScheduleService,
    public actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    private localData: LocalDataService
  ) {
    this.bid_schedule_data = navParams.get('bid_schedule_data');
    this.allScheduleData = navParams.get('all_schedule_data');
    this.activaRouter.params.subscribe((params) => {
      this.view_bid_schedule_id = params['_id'];
    });
  }
  ngOnInit() {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));

    this.newBidSchedule = JSON.parse(this.localData.getItem('viewBidSchedule'));
    this.viewGetEmp();

    this.getShiftLineSchedule();
    this.all_vacation_slots_list = [];
    this.scheduleListForm = this.fb.group({
      allScheduleListData: this.fb.array([]),
    });
  }
  get allScheduleListData(): FormArray {
    return this.scheduleListForm.get('allScheduleListData') as FormArray;
  }
  newWorkLoadData(): FormGroup {
    return this.fb.group({
      id: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      bidschref: new FormControl(),
      bidleaveid: new FormControl(),
      SBP_slots: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
    });
  }
  getShiftLineSchedule() {
    this.scheduleService.newgetAllSchedule(this.user_data.id).subscribe(
      (res) => {
        this.all_schedule = res;

        this.shiftLineForm();
        return this.all_schedule;
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }
  viewGetEmp() {
    this.allEmployee = [];
    for (var i = 0; i < this.newBidSchedule.employeemap.length; i++) {
      this.getEmployeeList(this.newBidSchedule.employeemap[i].empidref, i);
    }
  }
  getEmp() {
    this.allEmployee = [];
    for (var i = 0; i < this.newBidSchedule.employeemap.length; i++) {
      this.getEmployeeList(this.newBidSchedule.employeemap[i], i);
    }
  }

  getEmployeeList(empId, i) {
    console.log(empId)
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
    this.totalAccuredHours = 0
    for (var i = 0; i < this.allEmployee.length; i++) {
      this.totalRequiredHours =
        this.totalRequiredHours + +(+this.allEmployee[i].vacation);
    }
    this.allEmployee.forEach(element => {
      this.totalAccuredHours += element.vacation
    })
  }

  invalidHours() {
    return this.totalHours < this.totalAccuredHours;
  }

  dateRangeChange() {
    this.updatedValue = true;
    this.totalSlots();
  }

  close() {
    this.modalCtrl.dismiss({
      totalHours: this.totalHours,
      updatedValue: false,
    });
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  changeDate(date) {
    var temp = date.split('T');
    return temp;
  }
  shiftLineForm() {
    var temp;

    this.all_vacation_slots_list = [];
    this.updatedData = [];
    var tempObj = JSON.parse(this.localData.getItem('viewBidSchedule'));
    if (tempObj != null && tempObj.leavemap.length > 0) {
      for (var i = 0; i < tempObj.leavemap.length; i++) {
        this.allScheduleListData.push(this.newWorkLoadData());
        temp = {
          id: i,
          startDate: this.dateConvert(tempObj.leavemap[i].leavestartdate),
          endDate: this.dateConvert(tempObj.leavemap[i].leaveenddate),
          SBP_slots: tempObj.leavemap[i].leaveslots,
          bidschref: tempObj.leavemap[i].bidschref,
          bidleaveid: tempObj.leavemap[i].bidleaveid,
        };
        this.all_vacation_slots_list.push(temp);
        this.updatedData.push(temp);
      }
      this.allScheduleListData.setValue(this.all_vacation_slots_list);
    } else {
      for (var i = 0; i < 1; i++) {
        this.allScheduleListData.push(this.newWorkLoadData());
        temp = {
          id: i,
          startDate: null,
          endDate: null,
          SBP_slots: '',
          bidschref: '',
          bidleaveid: '',
        };
        this.all_vacation_slots_list.push(temp);
        this.updatedData.push(temp);
      }
      this.allScheduleListData.setValue(this.all_vacation_slots_list);
    }
    this.totalSlots();
  }
  dateConvert(date) {
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
  totalSlots() {
    this.updatedValue = true;
    this.totalHours = 0;
    for (
      var i = 0;
      i < this.scheduleListForm.value.allScheduleListData.length;
      i++
    ) {
      if (
        this.scheduleListForm.value.allScheduleListData[i].startDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].endDate != null &&
        this.scheduleListForm.value.allScheduleListData[i].SBP_slots != null &&
        this.scheduleListForm.value.allScheduleListData[i].SBP_slots > 0 &&
        this.scheduleListForm.value.allScheduleListData[i].SBP_slots != ''
      ) {
        var date1 = new Date(
          this.scheduleListForm.value.allScheduleListData[i].startDate
        );
        var date2 = new Date(
          this.scheduleListForm.value.allScheduleListData[i].endDate
        );
        date2.setDate(date2.getDate() + 1);
        var Difference_In_Time = date2.getTime() - date1.getTime();

        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        let accruedHours =
          Difference_In_Days *
          this.scheduleListForm.value.allScheduleListData[i].SBP_slots *
          8;

        this.totalHours = this.totalHours + accruedHours;
      }
    }
    if (Number.isInteger(this.totalHours)) {
      this.totalHours = this.totalHours;
    } else {
      this.totalHours = Math.ceil(this.totalHours);
    }
    this.localData.setItem(
      'totalCreatedVacationHours',
      String(this.totalHours)
    );
    this.remainingAccuredHours = (this.totalRequiredVacationHours || this.totalAccuredHours) - this.totalHours;

    if (this.remainingAccuredHours < 0) {
      this.remainingAccuredHours = 0;
    }
    this.isValid = this.totalHours >= this.totalAccuredHours;
    this.getSloteData()
  }

  getSloteData(): void {
    let selected = {
      totalHours: this.totalHours,
      updatedValue: this.updatedValue,
    };

    this.slotsUpdated.emit(selected);
  }

  ngOnChanges(_: SimpleChanges): void {
    this.totalSlots();
  }
}
