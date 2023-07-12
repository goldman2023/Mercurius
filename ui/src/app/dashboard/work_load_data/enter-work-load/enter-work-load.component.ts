import {
  Component,
  HostListener, OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import { WorkDay } from 'src/app/model/workDay';
import { RequiredWorkforceService } from 'src/app/services/required-workforce.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ScheduleDataService } from 'src/app/services/schedule-data.service';
import { WorkPattern } from 'src/app/model/workPattern';
import { IncludeExcludeShiftService } from 'src/app/services/include-exclude-shift.service';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';
import { CreateNewShiftDefintionPage } from '../create-new-shift-defintion/create-new-shift-defintion.page';
import { EditWorkLoadDataPage } from '../edit-work-load-data/edit-work-load-data.page';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MidSummaryComponent } from '../../manage-shift-line-schedules/edit-schedule/summary/mid-summary/mid-summary.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { WorkLoadDataFnService } from '../work_load_data_fn.service';
import { ChangeDetectorRef } from '@angular/core';
export interface WorkLoadData {
  id: number;
  startTime: string;
  shiftName: string;
  shiftCategory: number;
  shift_duration: number;
  shift_created_by: string;
  sh_include_exclude: string;
  shift_category_name: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}
@Component({
  selector: 'app-enter-work-load',
  templateUrl: './enter-work-load.component.html',
  styleUrls: ['./enter-work-load.component.scss'],
})


export class EnterWorkLoadComponent implements OnInit {
  hideSplitShiftMidDay = false;
  hideSplitShiftDayEve = false;
  hideSplitShiftEveMid = false;
  shiftValidation = true;
  changeText = true;
  worData: WorkLoadData[] = [];
  work_load_data: WorkLoadData[] = [];
  selected_shift_duration = JSON.parse(this.localData.getItem("selected_shift_duration")) || 8;
  // selected_shift_duration = 10;
  newShiftDefinition;
  editWorkLoadForm: FormGroup;
  errorMsg: any;
  wData: any;
  gDatasun: any;
  gDatamon: any;
  gDatatue: any;
  gDatawed: any;
  gDatathu: any;
  gDatafri: any;
  gDatasat: any;
  gDataPattern: any;
  scheduleShift: any[] = [];
  gData: any = [];
  requiredWorkforceDataForm: FormGroup;
  totalSunDay = 0;
  totalMonDay = 0;
  totalTueDay = 0;
  totalWedDay = 0;
  totalThuDay = 0;
  totalFriDay = 0;
  totalSatDay = 0;
  totalSunEve = 0;
  totalMonEve = 0;
  totalTueEve = 0;
  totalWedEve = 0;
  totalThuEve = 0;
  totalFriEve = 0;
  totalSatEve = 0;
  totalSunMid = 0;
  totalMonMid = 0;
  totalTueMid = 0;
  totalWedMid = 0;
  totalThuMid = 0;
  totalFriMid = 0;
  totalSatMid = 0;
  totalSunDayEve = 0;
  totalMonDayEve = 0;
  totalTueDayEve = 0;
  totalWedDayEve = 0;
  totalThuDayEve = 0;
  totalFriDayEve = 0;
  totalSatDayEve = 0;
  totalSunEveMid = 0;
  totalMonEveMid = 0;
  totalTueEveMid = 0;
  totalWedEveMid = 0;
  totalThuEveMid = 0;
  totalFriEveMid = 0;
  totalSatEveMid = 0;
  totalSunMidDay = 0;
  totalMonMidDay = 0;
  totalTueMidDay = 0;
  totalWedMidDay = 0;
  totalThuMidDay = 0;
  totalFriMidDay = 0;
  totalSatMidDay = 0;
  totalSun = 0;
  totalMon = 0;
  totalTue = 0;
  totalWed = 0;
  totalThu = 0;
  totalFri = 0;
  totalSat = 0;
  workLoadId: number;
  allMsgChangeLogs: any;
  allEmployeeChangeLogs: any;
  requiredWorkforceData = [] as any;
  updaterequiredWorkforceData = [] as any;
  hide = false;
  requiredWorkforceDataId = 1;
  requiredWorkLoadData = [] as any;
  scheduleDataArray: any[] = [];
  workLoadData = [] as any;
  comparisonDataArray = [] as any;
  scheduleData = [] as any;
  comparisonData = [] as any;
  tempScheduleDataStored: any;
  suntotal: any = 0;
  sattotal: any = 0;
  satDaytotal: any;
  totalRequireworkforceForm: FormGroup;
  test1: { sh_name: any };
  workPatternDayForm: FormGroup;
  fritotal: any = 0;
  a: number;
  result: number;
  totalCOmputedWorkForce: any;
  totalComputedWorkForce: any;
  static workLoadGenerated: any;
  static requiredvsGenerate: any;
  thutotal: any = 0;
  static systemGeneratedComparisonData: any;
  static data2: any[];
  requiredEmpData: any;
  generatedEmpData: any;
  static requiredData: any;
  testing: { scheduleData: any[] };
  defaultscheduleShift: any[];
  wLdata = [];
  wLdata1 = [];
  day1_pattern;
  day2_pattern;
  day3_pattern;
  day4_pattern;
  day5_pattern;
  wedtotal: any = 0;
  workPatternPreference: {};
  dat: {
    Fri: string;
    Mon: string;
    Sat: string;
    Sun: string;
    Thu: string;
    Tue: string;
    Wed: string;
    id: number;
    shiftName: string;
    shift_created_by: string;
    startTime: string;
  };
  re: any;
  selectedShift: any;
  tempSun: any;
  tempMon: any;
  tempTue: any;
  tempWed: any;
  tempThu: any;
  tempFri: any;
  tempSat: any;
  afterdeleteShiftdefs: any[];
  deleteShiftdefs: any[];
  timeLeft: number;
  updatedWorkPattern: any[];
  PWP: any[];
  PSO: any[];
  gTempSun: any;
  g_Datasun: any[];
  outliers: any;
  outliers_sun: {};
  shift_outliers: any;
  sun_outliers: any;
  final_outliers: any[];
  res: any;
  convertResponseToJsonStrigify: any;
  validSun: boolean = true;
  summary_days: any[] = [
    { id: 0, day: 'Sun' },
    { id: 1, day: 'Mon' },
    { id: 2, day: 'Tue' },
    { id: 3, day: 'Wed' },
    { id: 4, day: 'Thu' },
    { id: 5, day: 'Fri' },
    { id: 6, day: 'Sat' },
  ];
  temp = {};
  tuetotal: any = 0;
  allGeneratedSchedule = [] as any;
  allDefaultGeneratedSchedule = [] as any;
  temp1 = 'EVE1500';
  temp2 = 'EVE1300';
  temp3 = 'DAY0700';
  temp4 = 'DAY0600';
  temp5 = 'MID2300';
  temp6 = 'EVE1300';
  temp7 = 'EVE1300';
  temp8 = 'DAY0600';
  temp9 = 'DAY0600';
  montotal: any = 0;
  gDataShiftLineName: any;
  checkUserAccess = false;
  totalRequiredWorkForce = 33;
  workLoad23: any[];
  workLoad6: any[];
  workLoad7: any[];
  workLoad15: any[];
  workLoad13: any[];
  work_Load: any[];
  workload = [] as any;
  workLoadForm: FormGroup;
  allShift;
  allShiftData;
  shiftLen;
  allll = [] as any;
  sh_startTime;
  shift_name;
  convertTimetoString;
  allShiftName = [] as any;
  workPattern = new WorkPattern();
  arrangeShiftdefintionG = [];
  arrangeShiftdefintionL = [];
  outliervalues = false;
  nonoutlier = {};
  user_data;
  PSO_PWP;
  oldUpdatedWorkPattern = [];
  countSunOutlier = 0;
  countMonOutlier = 0;
  countTueOutlier = 0;
  countWedOutlier = 0;
  countThuOutlier = 0;
  countFriOutlier = 0;
  countSatOutlier = 0;
  max_shift_validation;
  all_schedule = [];
  allShiftDataAll = [];
  all_Schedule = [];
  activeRow = -1;
  maximizeWorkLoad = false;
  constructor(
    public modalCtrl: ModalController,
    private route: Router,
    public navCtrl: NavController,
    public shiftDefSer: WorkLoadService,
    public alertController: AlertController,
    private headerTitleService: HeaderTitleService,
    private scheduleService: GeneratedScheduleService,
    public loadingController: LoadingController,
    private requiredWorkforce: RequiredWorkforceService,
    public dataService: ScheduleDataService,
    public alertCtrl: AlertController,
    private localData: LocalDataService,
    public formBuilder: FormBuilder,
    private includeExcludeSer: IncludeExcludeShiftService,
    public dialogs: MatDialog,
    private workLoadDataFnService: WorkLoadDataFnService,
  ) {
    this.totalRequireworkforceForm = this.formBuilder.group({
      TotalRequiredWorkForce: this.totalComputedWorkForce,
    });
    this.workPatternDayForm = this.formBuilder.group({
      day1: new FormControl(this.temp1),
      day2: new FormControl(this.temp2),
      day3: new FormControl(this.temp3),
      day4: new FormControl(this.temp4),
      day5: new FormControl(this.temp5),
    });
    
  }
  async ionViewWillEnter() {
    if (
      JSON.parse(this.localData.getItem('customizedScheduleShiftLine')) == null
    ) {
      this.hide = false;
    } else {
      this.hide = true;
    }
   await this.ngOnInit();
    // this.work_load_data=  JSON.parse(this.localData.getItem('allShiftRequiredData'))
  }

  async ngOnInit(online?:boolean) {
    if(this.selected_shift_duration == 10) {
      this.day1.setValue(this.temp6);
      this.day2.setValue(this.temp7);
      this.day3.setValue(this.temp8);
      this.day4.setValue(this.temp9);
    }
    if (sessionStorage.getItem('token') != undefined) {
      this.checkUserAccess = true;
    } else {
      this.checkUserAccess = false;
    }
    //Work Load Form

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    if (this.user_data.role == 'bidmanager') {
      if (
        straightlines_io_apis.apis.enter_Work_load ===
        String(this.route.url).substr(1)
      ) {
        this.headerTitleService.setForwardUrl(
          straightlines_io_apis.apis.generated_schedule
        );

        this.headerTitleService.setBackUrl(
          straightlines_io_apis.apis.create_new_bid_schedule
        );
      } else {
        this.headerTitleService.setForwardUrl(
          straightlines_io_apis.apis.generated_schedule_api
        );
        this.getAllScheduleName();
        if (this.all_schedule.length > 0) {
          this.headerTitleService.setBackUrl(
            straightlines_io_apis.apis.manage_shift_line_schedule
          );
        } else {
          this.headerTitleService.setBackUrl(
            straightlines_io_apis.apis.dashboard
          );
        }
      }
    } else {
      this.headerTitleService.setForwardUrl(
        straightlines_io_apis.apis.guest_generated_schedule_api
      );
      this.getAllScheduleName();
      if (this.all_schedule.length > 0) {
        this.headerTitleService.setBackUrl(
          straightlines_io_apis.apis.guest_manage_shift_line_schedule
        );
      } else {
        this.headerTitleService.setBackUrl(
          straightlines_io_apis.apis.guest_dashboard
        );
      }
    }
    this.headerTitleService.setTitle('New Shiftline Schedule');
    this.headerTitleService.setDefaultHeader(true);
    this.headerTitleService.checkBiddingTime('');
    this.headerTitleService.checkBiddingEndDate('');

    // this.forwardOldGeneratedShiftLines()
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.PSO_PWP = JSON.parse(this.localData.getItem('PWP-PSO'));
    this.work_load_data = [];

    if (JSON.parse(this.localData.getItem('outliers')) != null) {
      this.outliers = JSON.parse(this.localData.getItem('outliers'));
    }
    if (JSON.parse(this.localData.getItem('newSHiftDefinition')) != null) {
      this.newShiftDefinition = JSON.parse(
        this.localData.getItem('newSHiftDefinition')
      );
    }

    const days = [this.day1.value, this.day2.value, this.day3.value, this.day4.value, this.day5.value];
    const requiredDays = this.selected_shift_duration == 8 ? 5 : 4;

    this.updatedWorkPattern = days.slice(0, requiredDays);
    this.PWP = this.updatedWorkPattern.map(day => day.substring(0, 3));
    this.PSO = this.updatedWorkPattern.map(day => day.substring(3));

    this.initForms();
    
    if (!online && this.localData.getItem("updatedallShiftRequiredData") && JSON.parse(this.localData.getItem('selected_shift_duration')) == this.selected_shift_duration  ) {
      this.work_load_data = JSON.parse(this.localData.getItem("updatedallShiftRequiredData"))??[];
      this.putFormData(true);
    } else {
      this.localData.setItem('selected_shift_duration', JSON.stringify(this.selected_shift_duration));
      this.work_load_data = await this.shiftDefSer
      .getAllSystemDefinedShiftDefinition(this.selected_shift_duration)
        .toPromise();
      
    var user_defined_shifts = await this.shiftDefSer
      .getAllShiftDefinition(this.user_data.id)
      .toPromise();
    
    user_defined_shifts.filter((shift) => shift.sh_duration == this.selected_shift_duration)
      .map((data) => ({
        id: data.sh_id,
        startTime: data.sh_starttime,
        shiftName: data.sh_name,
        shiftCategory: data.sh_category_id,
        shift_duration: data.sh_duration,
        shift_created_by: data.sh_created_by,
        sh_include_exclude: data.sh_include_exclude,
        shift_category_name: data.sh_category_name_ref,
        sun: '0',
        mon: '0',
        tue: '0',
        wed: '0',
        thu: '0',
        fri: '0',
        sat: '0'
      })).forEach((data) => {
        this.work_load_data.push(data);
      });

    this.work_load_data = this.work_load_data.map((data) => ({
                            ...data,
                            startTime: data.startTime
                              .substring(0, data.startTime.length - 3)
                              .replace(':', ''),
                          }))
                          .sort((a, b) => 
                            a.startTime.localeCompare(b.startTime)
                          ).sort((a) => {
                            return (Number(a.startTime) >= 2200) ? -1 : 1
                          });

    for (var i = 0; i < this.work_load_data.length; i++) {
      if (Number(this.work_load_data[i].shiftCategory) == 4) {
        this.hideSplitShiftMidDay = true;
      } else if (Number(this.work_load_data[i].shiftCategory) == 5) {
        this.hideSplitShiftDayEve = true;
      } else if (Number(this.work_load_data[i].shiftCategory) == 6) {
        this.hideSplitShiftEveMid = true;
      }
    }

    
      this.putFormData(false);
    }
  }

  initForms() {
    this.allShiftName = [];

    this.workLoadForm = this.formBuilder.group({
      allWorkLoadData: this.formBuilder.array([]),
    });
  }

  putFormData(fromLocal: boolean) {
    
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (this.work_load_data[i].shiftName != null) {
        if (this.work_load_data[i].sh_include_exclude == 'I') {
          if (Number(this.work_load_data[i].shiftCategory) == 1) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'MID' + this.work_load_data[i].startTime,
              shift_category: 'MID',
              p_workPattern: 'M',
            });
          } else if (Number(this.work_load_data[i].shiftCategory) == 3) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'DAY' + this.work_load_data[i].startTime,
              shift_category: 'DAY',
              p_workPattern: 'D',
            });
          } else if (Number(this.work_load_data[i].shiftCategory) == 2) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'EVE' + this.work_load_data[i].startTime,
              shift_category: 'EVE',
              p_workPattern: 'E',
            });
          } else if (Number(this.work_load_data[i].shiftCategory) == 4) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'SMD' + this.work_load_data[i].startTime,
              shift_category: 'M/D',
              p_workPattern: 'S',
            });
          } else if (Number(this.work_load_data[i].shiftCategory) == 5) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'SDE' + this.work_load_data[i].startTime,
              shift_category: 'D/E',
              p_workPattern: 'S',
            });
          } else if (Number(this.work_load_data[i].shiftCategory) == 6) {
            this.allShiftName.push({
              id: i + 1,
              shift_name: this.work_load_data[i].shiftName,
              startTime: this.work_load_data[i].startTime,
              shiftPattern: 'SEM' + this.work_load_data[i].startTime,
              shift_category: 'E/M',
              p_workPattern: 'S',
            });
          }
        }
      }
    }
    
    if (!fromLocal) {
      this.temp1 = 'EVE1500';
      this.temp2 = 'EVE1300';
      this.temp3 = 'DAY0700';
      this.temp4 = 'DAY0600';
      this.temp5 = 'MID2300';
      this.temp6 = 'EVE1300';
      this.temp7 = 'EVE1300';
      this.temp8 = 'DAY0600';
      this.temp9 = 'DAY0600';
    } else if(this.PSO_PWP.PSO.length > 4) {
      this.day1.setValue(this.PSO_PWP.PWP?.[0] + this.PSO_PWP.PSO?.[0]);
      this.day2.setValue(this.PSO_PWP.PWP?.[1] + this.PSO_PWP.PSO?.[1]);
      this.day3.setValue(this.PSO_PWP.PWP?.[2] + this.PSO_PWP.PSO?.[2]);
      this.day4.setValue(this.PSO_PWP.PWP?.[3] + this.PSO_PWP.PSO?.[3]);
      this.day5.setValue(this.PSO_PWP.PWP?.[4] + this.PSO_PWP.PSO?.[4]);
    } else {
      this.day1.setValue(this.PSO_PWP.PWP?.[0] + this.PSO_PWP.PSO?.[0]);
      this.day2.setValue(this.PSO_PWP.PWP?.[1] + this.PSO_PWP.PSO?.[1]);
      this.day3.setValue(this.PSO_PWP.PWP?.[2] + this.PSO_PWP.PSO?.[2]);
      this.day4.setValue(this.PSO_PWP.PWP?.[3] + this.PSO_PWP.PSO?.[3]);
    }
   

    const dataset = [];
    for (var i = 0; i < this.work_load_data.length; i++) {
      this.allWorkLoadData.push(this.newWorkLoadData());
      const temp = {
        id: this.work_load_data[i].id,
        startTime: this.work_load_data[i].startTime,
        Sun: fromLocal ? this.work_load_data[i]["Sun"] : this.work_load_data[i].sun,
        Mon: fromLocal ? this.work_load_data[i]["Mon"] : this.work_load_data[i].mon,
        Tue: fromLocal ? this.work_load_data[i]["Tue"] : this.work_load_data[i].tue,
        Wed: fromLocal ? this.work_load_data[i]["Wed"] : this.work_load_data[i].wed,
        Thu: fromLocal ? this.work_load_data[i]["Thu"] : this.work_load_data[i].thu,
        Fri: fromLocal ? this.work_load_data[i]["Fri"] : this.work_load_data[i].fri,
        Sat: fromLocal ? this.work_load_data[i]["Sat"] : this.work_load_data[i].sat,
        shiftName: this.work_load_data[i].shiftName,
        shift_duration: this.work_load_data[i].shift_duration,
        shiftCategory: this.work_load_data[i].shiftCategory,
        sh_include_exclude: this.work_load_data[i].sh_include_exclude,
        shift_created_by: this.work_load_data[i].shift_created_by,
        sunOutlier: false,
        monOutlier: false,
        tueOutlier: false,
        wedOutlier: false,
        thuOutlier: false,
        friOutlier: false,
        satOutlier: false,
      };
      
      dataset.push(temp);
    } 
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(dataset)
    );
    const outlierShiftData = [];
    const nonOutlierShiftData = [];
    var outliers = [];
    if (this.outliers.length > 0) {
      for (var i = 0; i < Object.keys(this.outliers[0]).length; i++) {
        outliers.push({
          shiftName: Object.keys(this.outliers[0])?.[i],
          values: Object.values(this.outliers[0])?.[i],
        });
      }
      this.outliers = outliers;
      this.countSunOutlier = 0;
      this.countMonOutlier = 0;
      this.countTueOutlier = 0;
      this.countWedOutlier = 0;
      this.countThuOutlier = 0;
      this.countFriOutlier = 0;
      this.countSatOutlier = 0;
      
      for (var j = 0; j < this.outliers.length; j++) {
        for (var i = 0; i < dataset.length; i++) {
          if (
            Number(this.outliers[j].shiftName) === Number(dataset[i].startTime)
          ) {
            var sunOutlier,
              monOutlier,
              tueOutlier,
              wedOutlier,
              thuOutlier,
              friOutlier,
              satOutlier;
            if (this.outliers[j].values.SUN) {
              sunOutlier = true;
              this.countSunOutlier = this.countSunOutlier + +(+1);
            } else {
              sunOutlier = false;
            }
            if (this.outliers[j].values.MON) {
              monOutlier = true;
              this.countMonOutlier = this.countMonOutlier + +(+1);
            } else {
              monOutlier = false;
            }
            if (this.outliers[j].values.TUE) {
              tueOutlier = true;
              this.countTueOutlier = this.countTueOutlier + +(+1);
            } else {
              tueOutlier = false;
            }
            if (this.outliers[j].values.WED) {
              wedOutlier = true;
              this.countWedOutlier = this.countWedOutlier + +(+1);
            } else {
              wedOutlier = false;
            }
            if (this.outliers[j].values.THU) {
              thuOutlier = true;
              this.countThuOutlier = this.countThuOutlier + +(+1);
            } else {
              thuOutlier = false;
            }
            if (this.outliers[j].values.FRI) {
              friOutlier = true;
              this.countFriOutlier = this.countFriOutlier + +(+1);
            } else {
              friOutlier = false;
            }
            if (this.outliers[j].values.SAT) {
              satOutlier = true;
              this.countSatOutlier = this.countSatOutlier + +(+1);
            } else {
              satOutlier = false;
            }
            this.temp = {
              id: dataset[i].id,
              startTime: dataset[i].startTime,
              Sun: dataset[i].sun,
              Mon: dataset[i].mon,
              Tue: dataset[i].tue,
              Wed: dataset[i].wed,
              Thu: dataset[i].thu,
              Fri: dataset[i].fri,
              Sat: dataset[i].sat,
              shiftName: dataset[i].shiftName,
              shift_duration: dataset[i].shift_duration,
              shiftCategory: dataset[i].shiftCategory,
              sh_include_exclude: dataset[i].sh_include_exclude,
              shift_created_by: dataset[i].shift_created_by,
              sunOutlier: sunOutlier,
              monOutlier: monOutlier,
              tueOutlier: tueOutlier,
              wedOutlier: wedOutlier,
              thuOutlier: thuOutlier,
              friOutlier: friOutlier,
              satOutlier: satOutlier,
            };
            outlierShiftData.push(this.temp);
          } else if (
            Number(this.outliers[j].shiftName) !== Number(dataset[i].startTime)
          ) {
            this.nonoutlier = dataset[i];
            nonOutlierShiftData.push(this.nonoutlier);
          }
        }
      }
      
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const incrementOutlierCount = (day, count) => {
        if (this.outliers[j].values[day]) {
          count += 1;
        }
        return count;
      };

      const setOutlierStatus = (day) => {
        return this.outliers[j].values[day] || false;
      };

      this.outliers.forEach((outlier) => {
        dataset.forEach((data) => {
          if (Number(outlier.shiftName) === Number(data.startTime)) {
            const outlierStatus = {};

            daysOfWeek.forEach((day) => {
              outlierStatus[`${day}Outlier`] = setOutlierStatus(day);
              this[`count${day}Outlier`] = incrementOutlierCount(day, this[`count${day}Outlier`]);
            });

            this.temp = {
              ...data,
              ...outlierStatus,
            };
            outlierShiftData.push(this.temp);
          } else if (Number(outlier.shiftName) !== Number(data.startTime)) {
            this.nonoutlier = data;
            nonOutlierShiftData.push(this.nonoutlier);
          }
        });
      });


      let beforeFinalData;
      beforeFinalData = nonOutlierShiftData.filter(
        (v, i, a) =>
          a.findIndex((t) => t.shiftTime === v.shiftTime && t.id === v.id) === i
      );
      for (var i = 0; i < beforeFinalData.length; i++) {
        outlierShiftData.push(beforeFinalData[i]);
      }
      let finalDataSet;
      finalDataSet = outlierShiftData.filter(
        (v, i, a) =>
          a.findIndex((t) => t.shiftTime === v.shiftTime && t.id === v.id) === i
      );
      let arrangeShiftdefintionGreater = [];
      let arrangeShiftdefintionLess = [];
      for (var i = 0; i < finalDataSet.length; i++) {
        if (Number(finalDataSet[i].startTime) > 2200) {
          arrangeShiftdefintionGreater.push(finalDataSet[i]);
        } else if (Number(finalDataSet[i].startTime) <= 2200) {
          arrangeShiftdefintionLess.push(finalDataSet[i]);
        }
      }

      arrangeShiftdefintionGreater.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      arrangeShiftdefintionLess.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      this.work_load_data = [];
      var final_work_load_data = [];
      for (var i = 0; i < arrangeShiftdefintionGreater.length; i++) {
        final_work_load_data.push(arrangeShiftdefintionGreater[i]);
      }
      for (var i = 0; i < arrangeShiftdefintionLess.length; i++) {
        final_work_load_data.push(arrangeShiftdefintionLess[i]);
      }
    }

    if (this.outliers.length > 0) {
      this.work_load_data = final_work_load_data;
      this.allWorkLoadData.setValue(dataset);
    } else {
      this.work_load_data = dataset;
      this.allWorkLoadData.setValue(dataset);
    }
    var allShiftDataInclude = [];
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (this.work_load_data[i].sh_include_exclude == 'I') {
        const temp = {
          id: this.work_load_data[i].id,
          startTime: this.work_load_data[i].startTime,

          Sun: this.work_load_data[i].sun,
          Mon: this.work_load_data[i].mon,
          Tue: this.work_load_data[i].tue,
          Wed: this.work_load_data[i].wed,
          Thu: this.work_load_data[i].thu,
          Fri: this.work_load_data[i].fri,
          Sat: this.work_load_data[i].sat,
          shift_duration: this.work_load_data[i].shift_duration,
          shiftName: this.work_load_data[i].shiftName,
          shiftCategory: this.work_load_data[i].shiftCategory,
          shift_created_by: this.work_load_data[i].shift_created_by,
        };

        allShiftDataInclude.push(temp);
      }
    }
    var {countMid,countSysMid,countEve,countSysEve,countDay,countSysDay} = this.workLoadDataFnService.countShifts(allShiftDataInclude);
    if (countMid < 5 && countDay < 5 && countEve < 5) {
      this.max_shift_validation = true;
    } else {
      this.max_shift_validation = false;
    }
    if (countSysMid > 0 && countSysDay > 0 && countSysEve > 0) {
      this.shiftValidation = true;
    } else {
      this.shiftValidation = false;
    }

    this.updateWorkLoad();
  }

  get TotalRequiredWorkForce() {
    return this.totalRequireworkforceForm.get('TotalRequiredWorkForce');
  }
  get allWorkLoadData(): FormArray {
    return this.workLoadForm.get('allWorkLoadData') as FormArray;
  }

  setActiveRow(i: number) {
    this.activeRow = i;
  }
  numberOnlyValidation(event: any) {
    const pattern = /^[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input

      event.preventDefault();
    }
  }
  newWorkLoadData(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(),
      startTime: new FormControl(),
      Sun: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      Mon: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      Tue: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      Wed: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      Thu: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      Fri: new FormControl(
        '',
        Validators.compose([
          ,
          Validators.min(0),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      Sat: new FormControl(
        '',
        Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])
      ),
      shift_duration: new FormControl(),
      shiftName: new FormControl(),
      shiftCategory: new FormControl(),
      shift_created_by: new FormControl(),
      sh_include_exclude: new FormControl(),
      sunOutlier: new FormControl(),
      monOutlier: new FormControl(),
      tueOutlier: new FormControl(),
      wedOutlier: new FormControl(),
      thuOutlier: new FormControl(),
      friOutlier: new FormControl(),
      satOutlier: new FormControl(),
    });
  }
  checkShiftDefintion() {
    return { emailIsTaken: false };
  }
  checkValidEmail(con: AbstractControl) {
    if (con.value === 0 || con.value === '0') {
      return { emailIsTaken: true };
    }
  }

  maximize() {
    this.maximizeWorkLoad = true;
  }
  minimize() {
    this.maximizeWorkLoad = false;
  }
  get day1() {
    return this.workPatternDayForm.get('day1');
  }
  get day2() {
    return this.workPatternDayForm.get('day2');
  }
  get day3() {
    return this.workPatternDayForm.get('day3');
  }
  get day4() {
    return this.workPatternDayForm.get('day4');
  }
  get day5() {
    return this.workPatternDayForm.get('day5');
  }

  

  private changeShiftValue(index: number, day: any): void {
    const allWorkLoadData = this.workLoadForm.controls.allWorkLoadData as FormArray;
    const workLoadData = allWorkLoadData.at(index).value;
  this.tempSun = workLoadData[day];
    if (workLoadData.sh_include_exclude === 'I') {
      const selectedShift = {
        ...workLoadData,
        [day]: '',
      };
  
      allWorkLoadData.at(index).setValue(selectedShift);
    }
  };

  @HostListener('focus')
  changeDay(index,day) {
    this.changeShiftValue(index,day)
  }
  

  private onFocusOutDay(index, day) {
    const dayShort = day.slice(0, 3);
    const allWorkLoadData = <FormArray>this.workLoadForm.controls['allWorkLoadData'];
    const dayValue = allWorkLoadData.at(index).value[dayShort];
  
    if (dayValue == null || dayValue == '') {
      if (dayValue === 0) {
        this.selectedShift = [
          {
            ...allWorkLoadData.at(index).value,
            [dayShort]: '0',
          },
        ];
      } else {
        this.selectedShift = [
          {
            ...allWorkLoadData.at(index).value,
            [dayShort]: '',
          },
        ];
  
        allWorkLoadData.at(index).setValue({
          ...this.selectedShift[0],
          [dayShort]: this.tempSun,
        });
      }
    } else {
      this.selectedShift = [
        {
          ...allWorkLoadData.at(index).value,
        },
      ];
  
      if (allWorkLoadData.at(index).value[`${dayShort}Outlier`] == true) {
        this[`count${dayShort}Outlier`] = this[`count${dayShort}Outlier`] - 1;
      }
  
      allWorkLoadData.at(index).setValue({
        ...this.selectedShift[0],
        [`${String(dayShort).toLowerCase()}Outlier`]: false,
      });
    }
  
    this.updateWorkLoad();
  }
  onFocusOutDays(index,day) {
    this.onFocusOutDay(index,day)
  }

  updateWorkPattern(event) {
    const days = [this.day1.value, this.day2.value, this.day3.value, this.day4.value, this.day5.value];
    const isValid = this.isValidWorkPattern(days, this.selected_shift_duration);
    
    if (isValid) {
      this.oldUpdatedWorkPattern = this.updatedWorkPattern;
    }
    
    this.updatedWorkPattern = days.slice(0, this.selected_shift_duration == 8 ? 5 : 4);
    this.PWP = this.updatedWorkPattern.map(day => day.substring(0, 3));
    this.PSO = this.updatedWorkPattern.map(day => day.substring(3));
  
    this.updatedWorkPattern = this.updatedWorkPattern.map((day, index) =>
      this.findMatchingShiftPattern(day, this.allShiftName, index)
    );
  
    this.PWP = this.updatedWorkPattern.map(day => day.substring(0, 3));
    this.PSO = this.updatedWorkPattern.map(day => day.substring(3));
  
    this.localData.setItem('PWP-PSO', JSON.stringify({ PWP: this.PWP, PSO: this.PSO }));
  }
  
  private isValidWorkPattern(days: string[], selected_shift_duration: number): boolean {
    const requiredDays = selected_shift_duration == 8 ? 5 : 4;
    return days.slice(0, requiredDays).every(day => day !== '');
  }
  
  private findMatchingShiftPattern(day: string, allShiftName: any[], index: number): string {
    const matchingShift = allShiftName.find(shift => shift.shiftPattern == day);
    return matchingShift ? matchingShift.shiftPattern : day;
  }
  

  updateWorkLoad() {
    this.extractIncludedWorkloadData();
    this.resetTotalWorkload();
    this.calculateTotalWorkload();
    this.calculateTotalComputedWorkForce();
    this.createTotalRequireworkforceForm();
    this.extractWorkLoadDataByStartTime();
    this.buildWorkloadArray();
  }
  
  private extractIncludedWorkloadData() {
    this.wLdata = this.workLoadForm.value.allWorkLoadData.filter(workLoad => workLoad.sh_include_exclude === 'I');
  }
  
  private resetTotalWorkload() {
    this.totalSun = this.totalMon = this.totalTue = this.totalWed = this.totalThu = this.totalFri = this.totalSat = 0;
  }
  
  private calculateTotalWorkload() {
    this.wLdata.forEach(workLoad => {
      const { Sun, Mon, Tue, Wed, Thu, Fri, Sat } = workLoad;
      const currentTotals = { Sun, Mon, Tue, Wed, Thu, Fri, Sat };
  
      for (const day in currentTotals) {
        this[`total${day}`] += Number(currentTotals[day]);
      }
    });
  }
  
  private calculateTotalComputedWorkForce() {
    const shiftDurationDivisor = Number(this.selected_shift_duration) == 8 ? 5 : 4;
    this.totalComputedWorkForce = Math.ceil(
      (this.totalSun + this.totalMon + this.totalTue + this.totalWed + this.totalThu + this.totalFri + this.totalSat) / shiftDurationDivisor
    );
  }
  
  private createTotalRequireworkforceForm() {
    this.totalRequireworkforceForm = this.formBuilder.group({
      TotalRequiredWorkForce: [this.totalComputedWorkForce],
    });
  }
  
  private extractWorkLoadDataByStartTime() {
    this.workLoad23 = this.workLoad6 = this.workLoad7 = this.workLoad13 = this.workLoad15 = [];
    this.wLdata.forEach(workLoad => {
      const { startTime, Sun, Mon, Tue, Wed, Thu, Fri, Sat } = workLoad;
      const currentWorkLoad = [Sun, Mon, Tue, Wed, Thu, Fri, Sat];
  
      if (Number(startTime) === 2300) this.workLoad23 = currentWorkLoad;
      else if (Number(startTime) === 600) this.workLoad6 = currentWorkLoad;
      else if (Number(startTime) === 700) this.workLoad7 = currentWorkLoad;
      else if (Number(startTime) === 1300) this.workLoad13 = currentWorkLoad;
      else if (Number(startTime) === 1500) this.workLoad15 = currentWorkLoad;
    });
  }
  
  private buildWorkloadArray() {
    this.workload = this.wLdata.map(workLoad => {
      const { startTime, Sun, Mon, Tue, Wed, Thu, Fri, Sat } = workLoad;
      return [startTime, Sun, Mon, Tue, Wed, Thu, Fri, Sat];
    });
  }
  
  getTotal(day: string, shift?: number): number {
    if (shift) {
      const workLoadData = this.wLdata.filter(workLoad => Number(workLoad.shiftCategory) === shift);
      if (workLoadData) {
       let temp = 0;
        workLoadData.forEach(
          workload => {
            temp += Number(workload[day])
          }
        )
        return temp;
      } else {
        return 0;
      }
    } else {
      return this[`total${day}`];
    }
  }
  

  async daySummary(day_summary) {
    var tempObj,
      final_mid_Summary = [],
      final_day_Summary = [],
      final_eve_Summary = [],
      mid_day_summary = [],
      day_eve_summary = [],
      eve_mid_summary = [];
    for (var i = 0; i < this.wLdata.length; i++) {
      tempObj = {
        defFri: 0,
        defMon: 0,
        defSat: 0,
        defSun: 0,
        defThu: 0,
        defTue: 0,
        defWed: 0,
        Fri: this.wLdata[i].Fri,
        Mon: this.wLdata[i].Mon,
        Sat: this.wLdata[i].Sat,
        Sun: this.wLdata[i].Sun,
        Thu: this.wLdata[i].Thu,
        Tue: this.wLdata[i].Tue,
        Wed: this.wLdata[i].Wed,
        diffFri: 0,
        diffMon: 0,
        diffSat: 0,
        diffSun: 0,
        diffThu: 0,
        diffTue: 0,
        diffWed: 0,
        shift_duration: Number(this.wLdata[i].shift_duration),
        shiftTime: this.wLdata[i].startTime,
      };
      if (this.wLdata[i].shiftCategory == 1) {
        final_mid_Summary.push(tempObj);
      } else if (this.wLdata[i].shiftCategory == 2) {
        final_eve_Summary.push(tempObj);
      } else if (this.wLdata[i].shiftCategory == 3) {
        final_day_Summary.push(tempObj);
      } else if (this.wLdata[i].shiftCategory == 4) {
        mid_day_summary.push(tempObj);
      } else if (this.wLdata[i].shiftCategory == 5) {
        day_eve_summary.push(tempObj);
      } else if (this.wLdata[i].shiftCategory == 6) {
        eve_mid_summary.push(tempObj);
      }
    }
    const modal = await this.modalCtrl.create({
      component: MidSummaryComponent,
      componentProps: {
        summaryType: 'day',
        summaryData: {
          mid: final_mid_Summary,
          day: final_day_Summary,
          eve: final_eve_Summary,
          mid_day: mid_day_summary,
          day_eve: day_eve_summary,
          eve_mid: eve_mid_summary,
        },
        day: day_summary,
        default: true,
      },
      cssClass: 'dayEditSummaryData',
      // cssClass: 'daySummaryData',
      swipeToClose: true,
    });
    return await modal.present();
  }

  private async showShiftDetails(shiftType) {
    let summaryData = [];
    let summaryType;
  
    for (const data of this.wLdata) {
      const tempObj = {
        defFri: 0, defMon: 0, defSat: 0, defSun: 0, defThu: 0, defTue: 0, defWed: 0,
        Fri: data.Fri, Mon: data.Mon, Sat: data.Sat, Sun: data.Sun, Thu: data.Thu, Tue: data.Tue, Wed: data.Wed,
        diffFri: 0, diffMon: 0, diffSat: 0, diffSun: 0, diffThu: 0, diffTue: 0, diffWed: 0,
        shift_duration: Number(data.shift_duration), shiftTime: data.startTime
      };
  
      if (data.shiftCategory === shiftType) {
        summaryData.push(tempObj);
      }
    }
  
    if (shiftType === 1) {
      summaryType = 'Mid Shift';
    } else if (shiftType === 3) {
      summaryType = 'Day Shift';
    } else if (shiftType === 2) {
      summaryType = 'Eve Shift';
    }
  
    const modal = await this.modalCtrl.create({
      component: MidSummaryComponent,
      cssClass: 'viewShiftData',
      swipeToClose: true,
      componentProps: {
        summaryType: summaryType,
        summaryData: summaryData,
        default: true,
      },
    });
    return await modal.present();
  }

  async midShiftsDetails() {
    return await this.showShiftDetails(1);
  }
  
  async dayShiftsDetails() {
    return await this.showShiftDetails(3);
  }
  
  async eveShiftsDetails() {
    return await this.showShiftDetails(2);
  }

  ConvertStringToNumber(input: string) {
    var numeric = Number(input);
    return numeric;
  }
  updateRequiredWorkLoadData() {
    this.a = this.totalRequireworkforceForm.value;
    this.result = this.TotalRequiredWorkForce.value;
  }
  async open(worData) {
    const modal = await this.modalCtrl.create({
      component: EditWorkLoadDataPage,
      cssClass: 'editWorkLoad',
      componentProps: { workLoadData: worData },
    });
    return await modal.present();
  }
  workDayModel = new WorkDay();
  
  gotoNextField(nextElement) {
    nextElement.setFocus();
  }
  async addNewShiftDefinition() {
    if (this.checkUserAccess == true) {
      this.work_load_data = this.workLoadForm.value.allWorkLoadData;
      var work_load_data = [],
        workload_data = [];
      work_load_data = JSON.parse(
        this.localData.getItem('updatedallShiftRequiredData')
      );
      workload_data = this.work_load_data;
      for (var i = 0; i < work_load_data.length; i++) {
        if (this.selected_shift_duration != work_load_data[i].shift_duration) {
          workload_data.push(work_load_data[i]);
        }
      }
      this.localData.setItem(
        'updatedallShiftRequiredData',
        JSON.stringify(workload_data)
      );
      const modal = await this.modalCtrl.create({
        component: CreateNewShiftDefintionPage,
        componentProps: { shift_duration: this.selected_shift_duration },
        cssClass: 'AddNewShiftDefintion',
        swipeToClose: true,
      });
      modal.onDidDismiss().then(() => {
        this.ngOnInit(true);
      });

      return await modal.present();
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message:
          "Sorry, you don't have access to create a new shift! Please upgrade your plan.",
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
  afterDelallShiftReqData = [];
  async removeItem(del_Shift) {
    var work_load_data = JSON.parse(
      this.localData.getItem('updatedallShiftRequiredData')
    );
    work_load_data = work_load_data.filter((data) => data.id != del_Shift.id);
    if (this.checkShiftDefInSchedule([del_Shift]).length > 0) {
      const confirm = await this.alertCtrl.create({
        header: 'Alert',
        message:
          "Can't delete the Shift because it is included in a Shiftline Schedule.",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
        ],
      });
      await confirm.present();
    } else {
      const confirm = await this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'Are you sure you want to delete the record?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Delete',
            role: 'delete',
            handler: async () => {
              this.localData.setItem(
                'allShiftRequiredData',
                JSON.stringify(work_load_data)
              );
              this.localData.setItem(
                'updatedallShiftRequiredData',
                JSON.stringify(work_load_data)
              );
              this.shiftDefSer
                .deleteShiftDefinition(del_Shift.id)
                .subscribe(() => {
                  this.shiftDefSer
                    .getAllShiftDefinition(this.user_data.id)
                    .subscribe(async (res) => {
                      this.allShift = res.filter((shift) => shift.sh_duration == this.selected_shift_duration);
                      this.localData.setItem(
                        'allShift',
                        JSON.stringify(this.allShift)
                      );
                      this.localData.removeItem(
                        'customizedScheduleShiftLine'
                      );
                      // location.reload();
                      const alert = await this.alertCtrl.create({
                        cssClass: 'my-custom-class',
                        header: 'Alert',
                        message: 'Successfully deleted!!!',
                        buttons: ['OK'],
                      });
                      await alert.present();
                      this.initForms();
                      this.work_load_data = JSON.parse(
                        this.localData.getItem('updatedallShiftRequiredData')
                      );
                      this.putFormData(true);
                    });
                });
            },
          },
        ],
      });
      await confirm.present();
    }
  }
  checkShiftDefInSchedule(deletedShiftDef) {
    var tempArr = [],
      temp,
      tempRArr = [];

    for (var i = 0; i < this.all_schedule.length; i++) {
      tempArr = [];
      for (var j = 0; j < this.all_schedule[i].schild.length; j++) {
        tempArr.push(this.all_schedule[i].schild[j].sun);
        tempArr.push(this.all_schedule[i].schild[j].mon);
        tempArr.push(this.all_schedule[i].schild[j].tue);
        tempArr.push(this.all_schedule[i].schild[j].wed);
        tempArr.push(this.all_schedule[i].schild[j].thu);
        tempArr.push(this.all_schedule[i].schild[j].fri);
        tempArr.push(this.all_schedule[i].schild[j].sat);
      }
      temp = tempArr.includes(deletedShiftDef[0].shiftName);
      if (temp === true) {
        tempRArr.push(this.all_schedule[i]);
      }
    }
    return tempRArr;
  }
  getSchedule() {
    var tempArr = [];
    var all_shift_data = [];
    this.scheduleService.getAllSchedule().subscribe(
      (res) => {
        for (var i = 0; i < res.length; i++) {
          if (Number(this.user_data.id) === Number(res[i].userid)) {
            tempArr.push(res[i]);
          }
        }

        var getAllScheduleName = [];
        for (var i = 0; i < tempArr.length; i++) {
          for (var j = 0; j < tempArr.length; j++) {
            if (getAllScheduleName[i] !== tempArr[j].schedulename) {
              getAllScheduleName.push(tempArr[j].schedulename);
            }
          }
        }
        var unique = getAllScheduleName.filter(this.onlyUnique);

        var tempArray = [],
          finalData = [];
        var ob;
        for (var i = 0; i < unique.length; i++) {
          tempArray = [];
          for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[j].schedulename === unique[i]) {
              tempArray.push(tempArr[j]);
            }
          }
          ob = {
            schedule_name: unique[i],
            customizedScheduleShiftLine: tempArray,
            defaultScheduleShiftLine: tempArray,
            allShiftRequiredData: all_shift_data,
          };
          finalData.push(ob);
        }
        this.all_Schedule = [];
        for (var i = 0; i < finalData.length; i++) {
          if (this.all_Schedule == null) {
            this.all_Schedule.push(finalData[i]);
          } else {
            this.all_Schedule.push(finalData[i]);
          }
        }

        this.all_schedule = this.all_Schedule;

        // this.localData.setItem('allSchedule',JSON.stringify(this.all_schedule))
        return this.all_schedule;
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  // includeExclude
  async includeExcludeShift(wD) {
    var current_shift_data;
    this.hide = false;
    this.allShift = await this.shiftDefSer
      .getAllShiftDefinition(this.user_data.id)
      .toPromise();

    this.allShift.filter((shift) => shift.sh_duration == this.selected_shift_duration)
    .forEach((shift) => {
      if (shift.sh_id == wD.id) current_shift_data = shift;
    });
    this.localData.setItem('allShift', JSON.stringify(this.allShift));
    if (current_shift_data.sh_include_exclude == 'I') {
      current_shift_data = {
        ...current_shift_data,
        sh_include_exclude: 'E'
      };
    } else {
      current_shift_data = {
        ...current_shift_data,
        sh_include_exclude: 'I'
      };
    }
    this.work_load_data = JSON.parse(
      this.localData.getItem('updatedallShiftRequiredData')
    );
    this.work_load_data = this.work_load_data.map((data) => 
      (data.id != wD.id ? data : {
        ...data,
        sh_include_exclude: data.sh_include_exclude == 'I' ? 'E' : 'I'
      })
    );

    this.localData.setItem(
      'allShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.includeExcludeSer
      .includeExcludeService(current_shift_data.sh_id, current_shift_data)
      .subscribe(() => { },
      (error: any) => {
        this.errorMsg = error;
        console.log(this.errorMsg);
      },
      () => {
        this.initForms();
        this.work_load_data = JSON.parse(
          this.localData.getItem('updatedallShiftRequiredData')
        );
        this.putFormData(true);
        this.updateWorkPattern(false);
      });
    
    var allShiftDataInclude = this.work_load_data
                                .filter((data) => data.sh_include_exclude == 'I');

    var {countMid,countSysMid,countEve,countSysEve,countDay,countSysDay} = this.workLoadDataFnService.countShifts(allShiftDataInclude);

    if (countMid < 5 && countDay < 5 && countEve < 5) {
      this.max_shift_validation = true;
    } else {
      this.max_shift_validation = false;
    }
    if (countSysMid > 0 && countSysDay > 0 && countSysEve > 0) {
      this.shiftValidation = true;
    } else {
      this.shiftValidation = false;
    }
  }

  async generate() {
    let loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner: 'bubbles',
      message: '',
      duration: 10000,
    });
    await loading.present();

        const all_work_load_data = this.workLoadForm.value.allWorkLoadData;
    let shift_length = 0;
    const daily_shifts = {
      Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
    };

    for (const data of all_work_load_data) {
      if (data.sh_include_exclude === 'I') {
        shift_length++;

        for (const day of Object.keys(daily_shifts)) {
          daily_shifts[day].push({ key: data.startTime, value: data[day] });
        }
      }
    }

    const resultMap = {};
    for (const day of Object.keys(daily_shifts)) {
      resultMap[day] = daily_shifts[day].reduce((map, obj) => {
        map[obj.key] = Number(obj.value);
        return map;
      }, {});
    }

    var allShiftDataInclude = [];
    var allShiftDataIncludeWithExclude = [];
    this.work_load_data = [];
    this.work_load_data = this.workLoadForm.value.allWorkLoadData;
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (this.work_load_data[i].sh_include_exclude == 'I') {
        const temp = {
          id: this.work_load_data[i].id,
          startTime: this.work_load_data[i].startTime,

          Sun: this.work_load_data[i].sun,
          Mon: this.work_load_data[i].mon,
          Tue: this.work_load_data[i].tue,
          Wed: this.work_load_data[i].wed,
          Thu: this.work_load_data[i].thu,
          Fri: this.work_load_data[i].fri,
          Sat: this.work_load_data[i].sat,
          //  "shift_duration":this.work_load_data[i].shift_duration,
          shiftName: this.work_load_data[i].shiftName,
          shiftCategory: this.work_load_data[i].shiftCategory,
          shift_created_by: this.work_load_data[i].shift_created_by,
        };

        allShiftDataInclude.push(temp);
      }
    }

    allShiftDataIncludeWithExclude = [];
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (this.work_load_data[i].id != null) {
        allShiftDataIncludeWithExclude.push(this.work_load_data[i]);
      }
    }

    var {countMid,countSysMid,countEve,countSysEve,countDay,countSysDay} = this.workLoadDataFnService.countShifts(allShiftDataInclude);
    // if(countSysMid>0 && countSysDay>0 &&countSysEve>0){
    //   if(countMid<5 && countDay<5 &&countEve<5){

    var pwpCount = 0;
    for (var i = 0; i < this.PWP.length; i++) {
      if (this.PWP[i] == '') {
        pwpCount = pwpCount + +(+1);
      }
    }
    
    this.requiredWorkforceData = {
      Schedule: null,
      shift_length: Number(this.selected_shift_duration),
      PWP: JSON.parse(this.localData.getItem('PWP-PSO')).PWP,
      PSO: JSON.parse(this.localData.getItem('PWP-PSO')).PSO,
      daily_shifts: { SUN:resultMap['Sun'], MON:resultMap['Mon'], TUE:resultMap['Tue'], WED:resultMap['Wed'], THU:resultMap['Thu'], FRI:resultMap['Fri'], SAT:resultMap['Sat'] },
    };

    const createDayObject = (day, eve, mid) => ({ DAY: day, EVE: eve, MID: mid });

    this.updaterequiredWorkforceData = {
      SUN: createDayObject(this.totalSunDay, this.totalSunEve, this.totalSunMid),
      MON: createDayObject(this.totalMonDay, this.totalMonEve, this.totalMonMid),
      TUE: createDayObject(this.totalTueDay, this.totalTueEve, this.totalTueMid),
      WED: createDayObject(this.totalWedDay, this.totalWedEve, this.totalWedMid),
      THU: createDayObject(this.totalThuDay, this.totalThuEve, this.totalThuMid),
      FRI: createDayObject(this.totalFriDay, this.totalFriEve, this.totalFriMid),
      SAT: createDayObject(this.totalSatDay, this.totalSatEve, this.totalSatMid),
    };


    if (pwpCount > 0) {
      await loading.dismiss();
      let alert = this.alertCtrl.create({
        header: 'Error!',
        subHeader:
          'Preferred Work Pattern has an excluded shift. Please fix the Preferred Work Pattern!',
        buttons: ['Cancel'],
      });
      (await alert).present();
    } else {
      this.requiredWorkforce
        .postRequiredWorkforceData(this.TotalRequiredWorkForce.value, this.requiredWorkforceData)
        .subscribe(
          async (response) => {
            this.res = JSON.stringify(response[0]);
            this.allDefaultGeneratedSchedule = [];
            this.allGeneratedSchedule = [];
            this.convertResponseToJsonStrigify = JSON.parse(this.res);

            if (
              Object.keys(
                this.convertResponseToJsonStrigify.generated_schedule_1.schedule
              ).length > 0
            ) {
              for (var s = 0; s < response.length; s++) {
                this.outliervalues = false;

                (this.scheduleData = JSON.parse(
                  response[s]?.['generated_schedule_' + (s + +(+1))]?.[
                    'schedule'
                  ]
                )),
                  (this.comparisonData = JSON.parse(
                    response[s]?.['generated_schedule_' + (s + +(+1))]?.[
                      'shift totals'
                    ]
                  ));

                this.scheduleDataArray = [];
                this.comparisonDataArray = [];
                this.scheduleDataArray.push(this.scheduleData);
                this.comparisonDataArray.push(this.comparisonData);
                this.gDatasun = this.scheduleDataArray?.[0].SUN;
                this.gDatamon = this.scheduleDataArray?.[0].MON;
                this.gDatatue = this.scheduleDataArray?.[0].TUE;
                this.gDatawed = this.scheduleDataArray?.[0].WED;
                this.gDatathu = this.scheduleDataArray?.[0].THU;
                this.gDatafri = this.scheduleDataArray?.[0].FRI;
                this.gDatasat = this.scheduleDataArray?.[0].SAT;
                this.gDataPattern = this.scheduleDataArray?.[0].Pattern;
                this.gDataShiftLineName =
                  this.scheduleDataArray?.[0].shiftline_name;
                this.scheduleShift = [];
                for (var i = 0; i < i + 1 && this.gDatasun[i] != null; i++) {
                  this.gData = {
                    id: i,
                    Sun: this.gDatasun[i],
                    Mon: this.gDatamon[i],
                    Tue: this.gDatatue[i],
                    Wed: this.gDatawed[i],
                    Thu: this.gDatathu[i],
                    Fri: this.gDatafri[i],
                    Sat: this.gDatasat[i],
                    Pattern: this.gDataPattern[i],
                    SL: this.gDataShiftLineName[i],
                    shiftdurationc: this.selected_shift_duration,
                  };
                  for (var j = 0; j < this.allShiftName.length; j++) {
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatasun[i]) ||
                      this.allShiftName[j].startTime == this.gDatasun[i]
                    ) {
                      this.gDatasun[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatamon[i]) ||
                      this.allShiftName[j].startTime == this.gDatamon[i]
                    ) {
                      this.gDatamon[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatatue[i]) ||
                      this.allShiftName[j].startTime == this.gDatatue[i]
                    ) {
                      this.gDatatue[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatawed[i]) ||
                      this.allShiftName[j].startTime == this.gDatawed[i]
                    ) {
                      this.gDatawed[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatathu[i]) ||
                      this.allShiftName[j].startTime == this.gDatathu[i]
                    ) {
                      this.gDatathu[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatafri[i]) ||
                      this.allShiftName[j].startTime == this.gDatafri[i]
                    ) {
                      this.gDatafri[i] = this.allShiftName[j].shift_name;
                    }
                    if (
                      Number(this.allShiftName[j].startTime) ==
                        Number(this.gDatasat[i]) ||
                      this.allShiftName[j].startTime == this.gDatasat[i]
                    ) {
                      this.gDatasat[i] = this.allShiftName[j].shift_name;
                    }
                    this.gData = {
                      id: i,
                      Sun: this.gDatasun[i],
                      Mon: this.gDatamon[i],
                      Tue: this.gDatatue[i],
                      Wed: this.gDatawed[i],
                      Thu: this.gDatathu[i],
                      Fri: this.gDatafri[i],
                      Sat: this.gDatasat[i],
                      Pattern: this.gDataPattern[i],
                      SL: this.gDataShiftLineName[i],
                      shiftdurationc: this.selected_shift_duration,
                    };
                  }
                  this.scheduleShift.push(this.gData);
                }
                var tempArr = [];
                for (var i = 0; i < this.scheduleShift.length; i++) {
                  tempArr.push({
                    id: i,
                    Sun: this.scheduleShift[i].Sun,
                    Mon: this.scheduleShift[i].Mon,
                    Tue: this.scheduleShift[i].Tue,
                    Wed: this.scheduleShift[i].Wed,
                    Thu: this.scheduleShift[i].Thu,
                    Fri: this.scheduleShift[i].Fri,
                    Sat: this.scheduleShift[i].Sat,
                    Pattern: this.scheduleShift[i].Pattern,
                    SL: this.scheduleShift[i].SL,
                    shiftdurationp: this.selected_shift_duration,
                    seq: this.checkID(
                      i,
                      this.scheduleShift[i].SL,
                      this.scheduleShift
                    ),
                    shiftdurationc: this.selected_shift_duration,
                  });
                }
                this.defaultscheduleShift = [];
                for (var i = 0; i < i + 1 && this.gDatasun[i] != null; i++) {
                  this.gData = {
                    id: i,
                    Sun: this.gDatasun[i],
                    Mon: this.gDatamon[i],
                    Tue: this.gDatatue[i],
                    Wed: this.gDatawed[i],
                    Thu: this.gDatathu[i],
                    Fri: this.gDatafri[i],
                    Sat: this.gDatasat[i],
                    Pattern: this.gDataPattern[i],
                    SL: this.gDataShiftLineName[i],
                    shiftdurationc: this.selected_shift_duration,
                  };
                  this.defaultscheduleShift.push(this.gData);
                }
                this.testing = { scheduleData: this.scheduleShift };
                this.allGeneratedSchedule.push(tempArr);
                this.allDefaultGeneratedSchedule.push(tempArr);
              }
             const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
              const timeSlots = ['DAY', 'MID', 'EVE', 'MID_DAY', 'DAY_EVE', 'EVE_MID'];
              function formatTimeSlot(timeSlot) {
                return timeSlot
                  .split('_')
                  .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                  .join('');
              }

              this.requiredEmpData = {};

              for (const day of days) {
                for (const timeSlot of timeSlots) {
                  const key = `${day}_${timeSlot}`;
                  this.requiredEmpData[key] = this[`total${day.charAt(0) + day.slice(1).toLowerCase()}${formatTimeSlot(timeSlot)}`];
                }
              }
              this.localData.setItem(
                'PWP-PSO',
                JSON.stringify({ PWP: this.PWP, PSO: this.PSO })
              );
              this.localData.setItem('outliers', JSON.stringify([]));
              this.localData.setItem('focusShiftLine', JSON.stringify(''));
              this.localData.setItem('updateScheduleId', JSON.stringify(''));
              this.localData.setItem(
                'allShiftRequiredData',
                JSON.stringify(allShiftDataInclude)
              );
              this.localData.setItem(
                'updatedallShiftRequiredData',
                JSON.stringify(allShiftDataIncludeWithExclude)
              );
              this.localData.setItem(
                'customizedScheduleShiftLine',
                JSON.stringify(this.allGeneratedSchedule)
              );
              this.localData.setItem(
                'defaultScheduleShiftLine',
                JSON.stringify(this.allDefaultGeneratedSchedule)
              );
              this.localData.setItem(
                'requiredEmpData',
                JSON.stringify(this.requiredEmpData)
              );
              this.localData.setItem(
                'hideBLrulesLabels',
                JSON.stringify({ hideBLrulesLabels: false })
              );

              if (this.user_data.role == 'bidmanager') {
                if (
                  straightlines_io_apis.apis.enter_Work_load ===
                  String(this.route.url).substr(1)
                ) {
                  this.navCtrl.navigateForward([
                    straightlines_io_apis.apis.generated_schedule,
                  ]);
                } else {
                  this.navCtrl.navigateForward([
                    straightlines_io_apis.apis.generated_schedule_api,
                  ]);
                }
              } else {
                this.navCtrl.navigateForward([
                  straightlines_io_apis.apis.guest_generated_schedule_api,
                ]);
              }
            } else if (
              Object.keys(
                this.convertResponseToJsonStrigify.generated_schedule_1.outliers
              ).length > 0
            ) {
              this.outliervalues = true;

              const outliers =
                this.convertResponseToJsonStrigify.generated_schedule_1
                  .outliers;

              this.localData.setItem('outliers', JSON.stringify([outliers]));
              this.localData.setItem(
                'allShiftRequiredData',
                JSON.stringify(allShiftDataInclude)
              );
              this.localData.setItem(
                'updatedallShiftRequiredData',
                JSON.stringify(allShiftDataIncludeWithExclude)
              );
              this.initForms();
              this.work_load_data = JSON.parse(
                this.localData.getItem('updatedallShiftRequiredData')
              );
              this.putFormData(true);
            } else if (
              Object.keys(
                this.convertResponseToJsonStrigify.generated_schedule_1
                  .pwp_error
              ).length > 0
            ) {
              let alert = this.alertCtrl.create({
                header: 'Error!',
                subHeader:
                  this.convertResponseToJsonStrigify.generated_schedule_1
                    .pwp_error,
                buttons: ['Cancel'],
              });
              (await alert).present();
              this.localData.setItem('outliers', JSON.stringify([]));
              this.localData.setItem(
                'allShiftRequiredData',
                JSON.stringify(allShiftDataInclude)
              );
              this.localData.setItem(
                'updatedallShiftRequiredData',
                JSON.stringify(allShiftDataIncludeWithExclude)
              );
            }
          },
          async (error: any) => {
            this.errorMsg = error;
            console.log(this.errorMsg);
            if (this.errorMsg != null) {
              await loading.dismiss();
              let alert = this.alertCtrl.create({
                header: 'Error!',
                subHeader: 'Please try again',
                buttons: ['Cancel'],
              });
              (await alert).present();
            }
          },
          async () => {
            await loading.dismiss();
          }
        );
    }
  }
  checkID(id, sl, scheduleShift) {
    var tempArr = [];
    for (var i = 0; i <= scheduleShift.length; i++) {
      if (scheduleShift[i] != undefined) {
        if (scheduleShift[i]?.SL == sl || scheduleShift[i]?.SL == sl + '-A') {
          tempArr.push(Number(scheduleShift[i]?.id));
        }
      }
    }
    tempArr = tempArr.sort((a, b) => {
      return a - b;
    });
    var newid = tempArr.indexOf(id);
    return newid;
  }
  home() {
    this.navCtrl.navigateBack('home');
  }
  segmentChanged(event) {
    this.hideSplitShiftMidDay = false;
    this.hideSplitShiftDayEve = false;
    this.hideSplitShiftEveMid = false;
    let newValue = event.detail.value;
    if (newValue !== this.selected_shift_duration) {
      
      this.selected_shift_duration = newValue;
      if (this.selected_shift_duration == 10) {
        this.day1.setValue("EVE1300");
        this.day2.setValue("EVE1300");
        this.day3.setValue("DAY0600");
        this.day4.setValue("DAY0600");
        this.localData.setItem('PWP-PSO', JSON.stringify({ PWP: ['EVE','EVE','DAY','DAY'], PSO: ['1300','1300','0600','0600'] }))
        
        
      }else{
        this.day1.setValue("EVE1500");
        this.day2.setValue("EVE1300");
        this.day3.setValue("DAY0700");
        this.day4.setValue("DAY0600");
        this.day5.setValue("MID2300");
        this.localData.setItem('PWP-PSO', JSON.stringify({ PWP: ['EVE','EVE','DAY','DAY','MID'], PSO: ['1500','1300','0700','0600','2300'] }))
      }
      this.ngOnInit();
    }
  }

  getAllScheduleName() {
    var user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.scheduleService.newgetAllSchedule(user_data.id).subscribe(
      (res) => {
        this.all_schedule = res;

        if (this.user_data.role == 'bidmanager') {
          if (this.all_schedule.length > 0) {
            return this.headerTitleService.setBackUrl(
              straightlines_io_apis.apis.manage_shift_line_schedule
            );
          } else {
            return this.headerTitleService.setBackUrl(
              straightlines_io_apis.apis.dashboard
            );
          }
        } else {
          if (this.all_schedule.length > 0) {
            return this.headerTitleService.setBackUrl(
              straightlines_io_apis.apis.guest_manage_shift_line_schedule
            );
          } else {
            return this.headerTitleService.setBackUrl(
              straightlines_io_apis.apis.guest_dashboard
            );
          }
        }
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }

  getImageSource(shiftCategory: number | string): string {
    switch (shiftCategory) {
      case 1:
      case '1':
        return 'assets/img/night.png';
      case 2:
      case '2':
        return 'assets/img/evening.png';
      case 3:
      case '3':
        return 'assets/img/morning.png';
      case 4:
      case '4':
        return 'assets/img/night-morning.png';
      case 5:
      case '5':
        return 'assets/img/morning-evening.png';
      case 6:
      case '6':
        return 'assets/img/evening-night.png';
      default:
        return '';
    }
  }

  isDisabled(): boolean {
    return (
      this.allWorkLoadData?.invalid ||
      this.countSunOutlier > 0 ||
      this.countMonOutlier > 0 ||
      this.countTueOutlier > 0 ||
      this.countWedOutlier > 0 ||
      this.countThuOutlier > 0 ||
      this.countFriOutlier > 0 ||
      this.countSatOutlier > 0
    );
  }

  isInvalidNumber(): boolean {
    return this.allWorkLoadData?.invalid;
  }
}
