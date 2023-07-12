import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, LoadingController, ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { Workbook } from 'exceljs';
import { Buffer } from 'buffer';
import * as fs from 'file-saver';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewShiftLinePage } from 'src/app/dashboard/generated_schedule/add-edit-shift-lines/add-new-shift-line/add-new-shift-line.page';
import { EditShiftLineScheduleComponent } from './edit-shift-line-schedule/edit-shift-line-schedule.component';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MidSummaryComponent } from './summary/mid-summary/mid-summary.component';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { EditScheduleActionSheetComponent } from './edit-schedule-action-sheet/edit-schedule-action-sheet.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import { HttpClient } from '@angular/common/http';
import { GenerateScheduleHelper } from '../../../helper/schedule.helper';
@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss'],
})
export class EditScheduleComponent implements OnInit {


  @ViewChild(IonSlides) slides: IonSlides;
  // generatedScheduleData=GeneratedScheduleData
  // scheduleShift=scheduleShiftLines
  title = 'angular-app';
  fileName= 'Schedule Data.xlsx';
  hideSplitShiftMidDay=false
  hideSplitShiftDayEve=false
  hideSplitShiftEveMid=false
  result1:any=[];
  result2:any=[];
  gData:any=[]
  totalShiftLine:any=[]
  ishidden = true;
  countSunSat=0;countSunMon=0;countMonTue=0;countTueWed=0;countWedThu=0;countThuFri=0;countFriSat=0;
  countFSS=0;countSMS=0;countSMT=0;countMTW=0;countTWT=0;countWTF=0;countTFS=0;countNC=0;
  SunSat=0;SunMon=0;MonTue=0;TueWed=0;WedThu=0;ThuFri=0;FriSat=0;
  coun: any;
  showRDOinfo=false
  excelHeaders:string[] = ["Id","Mon","Tue","Wed","Thu","Fri","Sat"];
  templateToExcel:string[][] = [this.excelHeaders,[]];
  totalCount: any;
  totalDefaultScheduleLine=0
  scheduleShift: any []=[]
  afterdeleteShiftLines:any []=[]
  deleteShiftLines:any []=[]
  defaultscheduleShift: any []=[]
  defaultScheduleShift: any []=[]
  gDatasun: any;
  gDatamon: any;
  gDatatue: any;
  gDatawed: any;
  gDatathu: any;
  gDatafri: any;
  gDatasat: any;
  deletedShiftLines=[]
  gDataPattern: any;
  generatedComparisonData: any []=[]
  generatedShiftLines:any []=[]
  generatedScheduleData:any []=[]
  requiredEmpData:any
  defrdosArr=[]
  defGeneratedData= {"SUN_DAY":0,"SUN_MID":0,"SUN_EVE":0,"SUN_MID_DAY":0,"SUN_DAY_EVE":0,"SUN_EVE_MID":0,
                      "MON_DAY":0,"MON_MID":0,"MON_EVE":0,"MON_MID_DAY":0,"MON_DAY_EVE":0,"MON_EVE_MID":0,
                      "TUE_DAY":0,"TUE_MID":0,"TUE_EVE":0,"TUE_MID_DAY":0,"TUE_DAY_EVE":0,"TUE_EVE_MID":0,
                      "WED_DAY":0,"WED_MID":0,"WED_EVE":0,"WED_MID_DAY":0,"WED_DAY_EVE":0,"WED_EVE_MID":0,
                      "THU_DAY":0,"THU_MID":0,"THU_EVE":0,"THU_MID_DAY":0,"THU_DAY_EVE":0,"THU_EVE_MID":0,
                      "FRI_DAY":0,"FRI_MID":0,"FRI_EVE":0,"FRI_MID_DAY":0,"FRI_DAY_EVE":0,"FRI_EVE_MID":0,
                      "SAT_DAY":0,"SAT_MID":0,"SAT_EVE":0,"SAT_MID_DAY":0,"SAT_DAY_EVE":0,"SAT_EVE_MID":0
}
generatedEmpData={"SUN_DAY":0,"SUN_MID":0,"SUN_EVE":0,"SUN_MID_DAY":0,"SUN_DAY_EVE":0,"SUN_EVE_MID":0,
                  "MON_DAY":0,"MON_MID":0,"MON_EVE":0,"MON_MID_DAY":0,"MON_DAY_EVE":0,"MON_EVE_MID":0,
                  "TUE_DAY":0,"TUE_MID":0,"TUE_EVE":0,"TUE_MID_DAY":0,"TUE_DAY_EVE":0,"TUE_EVE_MID":0,
                  "WED_DAY":0,"WED_MID":0,"WED_EVE":0,"WED_MID_DAY":0,"WED_DAY_EVE":0,"WED_EVE_MID":0,
                  "THU_DAY":0,"THU_MID":0,"THU_EVE":0,"THU_MID_DAY":0,"THU_DAY_EVE":0,"THU_EVE_MID":0,
                  "FRI_DAY":0,"FRI_MID":0,"FRI_EVE":0,"FRI_MID_DAY":0,"FRI_DAY_EVE":0,"FRI_EVE_MID":0,
                  "SAT_DAY":0,"SAT_MID":0,"SAT_EVE":0,"SAT_MID_DAY":0,"SAT_DAY_EVE":0,"SAT_EVE_MID":0
                }
  sun:any;SunDayRequired = [];SunDayGenerated = [];totalSundiff: any;totalSunGenerated: any;totalSunRequired: any;diffSunMid: any;diffSunDay: any;diffSunEve: any;diffSunMidDay: any;diffSunDayEve: any;diffSunEveMid: any;validSunMid: boolean;validSunDay: boolean;validSunEve: boolean;
  mon: any;MonDayRequired= [];MonDayGenerated= [];diffMonMid: any;diffMonDay: any;diffMonEve: any;totalMonRequired: any;totalMonGenerated: any;totalMondiff: any;diffMonMidDay: any;diffMonDayEve: any;diffMonEveMid: any;
  tue:any;TueDayRequired= [];TueDayGenerated= [];diffTueMid: any;diffTueDay: any;diffTueEve: any;totalTueRequired: any;totalTueGenerated: any;totalTuediff: any;diffTueMidDay: any;diffTueDayEve: any;diffTueEveMid: any;
  wed:any;WedDayRequired= [];WedDayGenerated= [];diffWedMid: any;diffWedDay: any;diffWedEve: any;totalWedRequired: any;totalWedGenerated: any;totalWeddiff: any;diffWedMidDay: any;diffWedDayEve: any;diffWedEveMid: any;
  thu:any;ThuDayRequired= [];ThuDayGenerated= [];diffThuMid: any;diffThuDay: any;diffThuEve: any;totalThuRequired: any;totalThuGenerated: any;totalThudiff: any;diffThuMidDay: any;diffThuDayEve: any;diffThuEveMid: any;
  fri:any;FriDayRequired= [];FriDayGenerated= [];diffFriMid: any;diffFriDay: any;diffFriEve: any;totalFriRequired: any;totalFriGenerated: any;totalFridiff: any;diffFriMidDay: any;diffFriDayEve: any;diffFriEveMid: any;
  sat:any;SatDayRequired= [];SatDayGenerated= [];diffSatMid: any;diffSatDay: any;diffSatEve: any;totalSatRequired: any;totalSatGenerated: any;totalSatdiff: any;diffSatMidDay: any;diffSatDayEve: any;diffSatEveMid: any;

  defaultSun: any;defaultSunDayRequired= [];defaultSunDayGenerated= [];defaultDiffSunMid: any;defaultDiffSunDay: any;defaultDiffSunEve: any;defaultTotalSunRequired: any;defaultTotalSunGenerated: any;defaultTotalSundiff: any;defaultDiffSunMidDay: any;defaultDiffSunDayEve: any;defaultDiffSunEveMid: any;
  defaultMon: any;defaultMonDayRequired= [];defaultMonDayGenerated= [];defaultDiffMonMid: any;defaultDiffMonDay: any;defaultDiffMonEve: any;defaultTotalMonRequired: any;defaultTotalMonGenerated: any;defaultTotalMondiff: any;defaultDiffMonMidDay: any;defaultDiffMonDayEve: any;defaultDiffMonEveMid: any;
  defaultTue: any;defaultTueDayRequired= [];defaultTueDayGenerated= [];defaultDiffTueMid: any;defaultDiffTueDay: any;defaultDiffTueEve: any;defaultTotalTueRequired: any;defaultTotalTueGenerated: any;defaultTotalTuediff: any;defaultDiffTueMidDay: any;defaultDiffTueDayEve: any;defaultDiffTueEveMid: any;
  defaultWed: any;defaultWedDayRequired= [];defaultWedDayGenerated= [];defaultDiffWedMid: any;defaultDiffWedDay: any;defaultDiffWedEve: any;defaultTotalWedRequired: any;defaultTotalWedGenerated: any;defaultTotalWeddiff: any;defaultDiffWedMidDay: any;defaultDiffWedDayEve: any;defaultDiffWedEveMid: any;
  defaultThu: any;defaultThuDayRequired= [];defaultThuDayGenerated= [];defaultDiffThuMid: any;defaultDiffThuDay: any;defaultDiffThuEve: any;defaultTotalThuRequired: any;defaultTotalThuGenerated: any;defaultTotalThudiff: any;defaultDiffThuMidDay: any;defaultDiffThuDayEve: any;defaultDiffThuEveMid: any;
  defaultFri: any;defaultFriDayRequired= [];defaultFriDayGenerated= [];defaultDiffFriMid: any;defaultDiffFriDay: any;defaultDiffFriEve: any;defaultTotalFriRequired: any;defaultTotalFriGenerated: any;defaultTotalFridiff: any;defaultDiffFriMidDay: any;defaultDiffFriDayEve: any;defaultDiffFriEveMid: any;
  defaultSat: any;defaultSatDayRequired= [];defaultSatDayGenerated= [];defaultDiffSatMid: any;defaultDiffSatDay: any;defaultDiffSatEve: any;defaultTotalSatRequired: any;defaultTotalSatGenerated: any;defaultTotalSatdiff: any;defaultDiffSatMidDay: any;defaultDiffSatDayEve: any;defaultDiffSatEveMid: any;
  final_mid_Summary=[];final_day_Summary=[];final_eve_Summary=[]
  final_def_mid_Summary=[];final_def_day_Summary=[];final_def_eve_Summary=[]
  exportData=[] as any
  exportScheduleData=[] as any
  sunDay=[] as any
  defscheduleShift: any;
  sundAy= [] as any;mondAy= [] as any;tuedAy= [] as any;weddAy= [] as any;thudAy= [] as any;fridAy= [] as any;satdAy= [] as any;
  def_sundAy= [] as any;def_mondAy= [] as any;def_tuedAy= [] as any;def_weddAy= [] as any;def_thudAy= [] as any;def_fridAy= [] as any;def_satdAy= [] as any;
  req: number=0;
  all_Schedule=[]
  sun_mid: number=0;sun_day: number=0;sun_eve: number=0;sun_mid_day: number=0;sun_day_eve: number=0;sun_eve_mid: number=0;
  mon_mid: number=0;mon_day: number=0;mon_eve: number=0;mon_mid_day: number=0;mon_day_eve: number=0;mon_eve_mid: number=0;
  tue_mid: number=0;tue_day: number=0;tue_eve: number=0;tue_mid_day: number=0;tue_day_eve: number=0;tue_eve_mid: number=0;
  wed_mid: number=0;wed_day: number=0;wed_eve: number=0;wed_mid_day: number=0;wed_day_eve: number=0;wed_eve_mid: number=0;
  thu_mid: number=0;thu_day: number=0;thu_eve: number=0;thu_mid_day: number=0;thu_day_eve: number=0;thu_eve_mid: number=0;
  fri_mid: number=0;fri_day: number=0;fri_eve: number=0;fri_mid_day: number=0;fri_day_eve: number=0;fri_eve_mid: number=0;
  sat_mid: number=0;sat_day: number=0;sat_eve: number=0;sat_mid_day: number=0;sat_day_eve: number=0;sat_eve_mid: number=0;

  def_sun_mid: number=0;def_sun_day: number=0;def_sun_eve: number=0;def_sun_mid_day: number=0;def_sun_day_eve: number=0;def_sun_eve_mid: number=0;
  def_mon_mid: number=0;def_mon_day: number=0;def_mon_eve: number=0;def_mon_mid_day: number=0;def_mon_day_eve: number=0;def_mon_eve_mid: number=0;
  def_tue_mid: number=0;def_tue_day: number=0;def_tue_eve: number=0;def_tue_mid_day: number=0;def_tue_day_eve: number=0;def_tue_eve_mid: number=0;
  def_wed_mid: number=0;def_wed_day: number=0;def_wed_eve: number=0;def_wed_mid_day: number=0;def_wed_day_eve: number=0;def_wed_eve_mid: number=0;
  def_thu_mid: number=0;def_thu_day: number=0;def_thu_eve: number=0;def_thu_mid_day: number=0;def_thu_day_eve: number=0;def_thu_eve_mid: number=0;
  def_fri_mid: number=0;def_fri_day: number=0;def_fri_eve: number=0;def_fri_mid_day: number=0;def_fri_day_eve: number=0;def_fri_eve_mid: number=0;
  def_sat_mid: number=0;def_sat_day: number=0;def_sat_eve: number=0;def_sat_mid_day: number=0;def_sat_day_eve: number=0;def_sat_eve_mid: number=0;


schedule_id


  workLoadData: any;
  shift: any;
  defRequiredData: any;

  ReqVsGeneTotalData;ReqVsGeneMidData: any;ReqVsGeneDayData: any;ReqVsGeneEveData: any;ReqVsGeneMidDayData: any;ReqVsGeneDayEveData: any;ReqVsGeneEveMidData: any;dayTitleforExcel:any;
  req_shift_1_data;req_shift_2_data;req_shift_3_data;req_shift_4_data;req_shift_5_data;
  gen_shift_1_data;gen_shift_2_data;gen_shift_3_data;gen_shift_4_data;gen_shift_5_data;
  defReqVsGeneTotalData;defReqVsGeneMidData: any;defReqVsGeneDayData: any;defReqVsGeneEveData: any;defReqVsGeneMidDayData: any;defReqVsGeneDayEveData: any;defReqVsGeneEveMidData: any;
  def_gen_shift_1_data;def_gen_shift_2_data;def_gen_shift_3_data;def_gen_shift_4_data;def_gen_shift_5_data
  required_title: any;
  generated_title:any;
  required_vs_generated_title: any;
  customizeScheduleShiftLines=[] as any
  totalCustomizeShiftLine: any;
  customizeShiftData: any;
  testing: any;

  reqData=[] as any
  genData=[] as any
  defGenData=[] as any
  t: string;
  defaultValue=0
  da=[] as any
  updateDefscheduleShiftId: {};
  updatedDefScheduleShiftLines=[] as any
  def=[];defSun=[];defMon=[];defTue=[];defWed=[];defThu=[];defFri=[];defSat=[]
  customized=[];customizedSun=[];customizedMon=[];customizedTue=[];customizedWed=[];customizedThu=[];customizedFri=[];customizedSat=[]
  reqDataShiftTime=[];reqDataSun=[];reqDataMon=[];reqDataTue=[];reqDataWed=[];reqDataThu=[];reqDataFri=[];reqDataSat=[]
  reqvsgenDefDataShiftTime=[];reqvsgenDefDataSun=[];reqvsgenDefDataMon=[];reqvsgenDefDataTue=[];reqvsgenDefDataWed=[];reqvsgenDefDataThu=[];reqvsgenDefDataFri=[];reqvsgenDefDataSat=[]
  reqvsgenDataShiftTime=[];reqvsgenDataSun=[];reqvsgenDataMon=[];reqvsgenDataTue=[];reqvsgenDataWed=[];reqvsgenDataThu=[];reqvsgenDataFri=[];reqvsgenDataSat=[]
  focusShiftLine
  allShiftData: any;
  allShiftName: any[];
  currentShiftlineScheduleShiftDuration=8
  midData=[] as any
 dayData= [] as any
 demo=[] as any
 diffDay_23_sun: number;
 diffDay_23_tue: number;
 diffDay_23_mon: number;
 diffDay_23_wed: number;
 diffDay_23_thu: number;
 diffDay_23_fri: number;
  diffDay_23_sat: number;
  week_date = ["Mon", "Tue", "Sat", "Fri", "Thu", "Sun", "Wed"];
 summary_days:any []=[{"id":0,"day":"Sun"},{"id":1,"day":"Mon"},{"id":2,"day":"Tue"},{"id":3,"day":"Wed"},{"id":4,"day":"Thu"},{"id":5,"day":"Fri"},{"id":6,"day":"Sat"}]
 default_value=0
 hide_BL_rules_Labels=false
 addShiftData: any
 gShift: any;
 schedule_title
 schedule_length
 one_generated_schedule
 three_generated_schedule
 nextslide=true
 slideOption={
  shortSwipes:false,
  longSwipes:true,
  longSwipesRatio:0.5,
  initialSlide: 0,
  spaceBetween: 200,

 }
 defReqVsGeneData
 ReqVsGeneData
 rdosArr=[]
 selected_shift_duration=8
  edit_schedule_id: any;
  mid_day_summary: any[];
  eve_mid_summary: any[];
  day_eve_summary: any[];
  allShiftDataWithIncludeExclude
  shiftline_schedule_name
  maximizeCard: boolean = false;
  init:boolean = true;
  shiftCategoryName = [
    'MID', 'EVE', 'DAY', 'M/D', 'D/E', 'E/M'
  ];
  dateset = [{title:'Sun',color:'sat-sun',shift:['SS', 'FSS', 'FSS-A', 'SS-A']}, {title:'Mon',color:'sun-mon',shift:['SM', 'SMS', 'SMS-A', 'SM-A']},{title:'Tue',color:'mon-tue',shift:['MT', 'SMT', 'SMT-A', 'MT-A']}, {title:'Wed',color:'tue-wed',shift:['TW', 'MTW', 'MTW-A', 'TW-A']}, {title:'Thu',color:'wed-thu',shift:['WT', 'TWT', 'TWT-A', 'WT-A','TWTh','TWTh-A','WTh-A','WTh']}, {title:'Fri',color:'thu-fri',shift:['TF', 'WTF', 'WTF-A', 'TF-A','ThF','WThF','WThF-A','ThF-A']}, {title:'Sat',color:'fri-sat',shift:['FS', 'TFS', 'TFS-A', 'FS-A','ThFS','ThFS-A']}, ];
  day_generate :any;
  total_day_generate:any;
  constructor(public modalCtrl: ModalController,
    private route: Router,
    public workLoadDataService:WorkLoadService,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private scheduleService:GeneratedScheduleService,
              private headerTitleService: HeaderTitleService,
              private activaRouter: ActivatedRoute,public navParams: NavParams,
              public navCtrl: NavController,
              private cdref: ChangeDetectorRef,
              private localData: LocalDataService,
              public formBuilder: FormBuilder,
              public http : HttpClient,
              public busniessRulesValidation:BusinessRulesValidationService,
              public actionsheetCtrl: ActionSheetController,
              public generateScheduleHelper:GenerateScheduleHelper
              ) {

          this.schedule_id=0
          this.activaRouter.params.subscribe(params => {
            this.edit_schedule_id=params['_id']
            this.shiftline_schedule_name=params['_sn']
          });

  }
  user_data
  async ngOnInit(noinit?:boolean) {
    this.init = !noinit;
     this.headerTitleService.setTitle('Edit Shiftline Schedule');
    this.headerTitleService.setDefaultHeader(true)
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    await this.updateLocalShiftData()
    if(this.user_data.role=='bidmanager'){
      if(this.edit_schedule_id==='I'){
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.setUp_bid_parameters);
       }
       else{
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.manage_shift_line_schedule);
       }
    }else{
      this.headerTitleService.setBackUrl(straightlines_io_apis.apis.guest_manage_shift_line_schedule);
    }

    this.headerTitleService.setForwardUrl(null);
    this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');
    this.exportData=[]
    this.customizeShiftData=[]
        this.customizeScheduleShiftLines=[]
    this.allShiftDataWithIncludeExclude=JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
    this.allShiftData=this.allShiftDataWithIncludeExclude
    this.scheduleShift = JSON.parse(this.localData.getItem('editCustomizedScheduleShiftLine'))
    /* 10 hours schedule missing "t"*/
    for (let i = 0; i < this.scheduleShift.length; i++) {
      const element = this.scheduleShift[i];
      let tempElement = element;
      if (element.shiftdurationc == 10) {
        Object.keys(element).forEach(item => {
          if (this.week_date.indexOf(item) !== -1 && Number(element[item])){
            element[item] = String(element[item])+"t"
          }
          tempElement[item] = element[item];
        })
        this.scheduleShift[i] = tempElement;
      }
    }
    /* 10 hours schedule missing "t"*/
    let shift_lines = [];
    if(this.init){
      for (let i = 0; i < this.scheduleShift.length; i++) {
          const element = this.scheduleShift[i];
          let test = [];
          if(element.shiftdurationc == 9) {
            let tempObj = {};
            ['SUN','MON','TUE','WED','THU','FRI','SAT','SUN2','MON2','TUE2','WED2','THU2','FRI2','SAT2'].forEach(item => {
              let shift =  item.includes('2')? item.charAt(0)+item.slice(1,3).toLowerCase() +'shift2': item.charAt(0)+item.slice(1).toLowerCase();
              tempObj[item] = {shift:this.convertRDOtoShiftDefintion(element[shift],9),length: element[shift] == 'X' || element[shift] == null ? 'X':Number(element[shift].split('-')[1])}
            })
            shift_lines.push(tempObj);
          }else{
            this.dateset.forEach(item=>{
              test.push(this.convertRDOtoShiftDefintion(element[item.title],element.shiftdurationc)?? 'X');
            });
            shift_lines.push({
            "shift_line": test,
            "shift_length":Number(element.shiftdurationc)
            })
          }
      }
      const res:any = await this.busniessRulesValidation.businessRulesCheckForArray(shift_lines).toPromise();
      
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        this.scheduleShift[i]['BMLRule'] = element.business_rules === true ? null:false
      }
    }

    this.localData.setItem('editCustomizedScheduleShiftLine',JSON.stringify(this.scheduleShift))

    this.defscheduleShift=JSON.parse(this.localData.getItem('editDefaultScheduleShiftLine'))
    this.focusShiftLine=JSON.parse(this.localData.getItem('focusShiftLineEdit'))
    this.currentShiftlineScheduleShiftDuration=this.scheduleShift[0].shiftdurationp
    if(this.edit_schedule_id==='I'){
      this.schedule_title='Generated Schedule!'
    }else{
      this.schedule_title='Edit Schedule!'
    }
    this.schedule_length=this.scheduleShift.length
    for(var i=0;i<this.allShiftData.length;i++){
      if( Number(this.allShiftData[i].shiftCategory)==4){
        this.hideSplitShiftMidDay=true
      }
      else if( Number(this.allShiftData[i].shiftCategory)==5){
        this.hideSplitShiftDayEve=true
      }
      else if( Number(this.allShiftData[i].shiftCategory)==6){
        this.hideSplitShiftEveMid=true
      }

    }
    this.allShiftName=[]
    this.allShiftName.push({"shiftName":'X',"shiftCategory":'X'})
    for(var i=0;i<this.allShiftData.length;i++){
      if(this.selected_shift_duration==this.allShiftData[i].shift_duration){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shiftTime":this.allShiftData[i].startTime})
      }
    }
    var r = [],r1=[],r2=[],r3=[]
    this.allShiftData.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
    r1=r1.sort((a,b) => Number(b.startTime) - Number(a.startTime));
    r=r.sort((a,b) => Number(a.startTime) - Number(b.startTime));
    this.allShiftData=r1.concat(r);
    this.allShiftData=this.allShiftData.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
    this.shift=['M',6,7,1,3]
    if(this.schedule_id==undefined){
      this.schedule_id=0
    }
    /* refactoring start*/
    this.defrdosArr = this.initializeAndCreateRdosArr(this.defscheduleShift);
    this.rdosArr = this.initializeAndCreateRdosArr(this.scheduleShift);
    /* refactoring end*/

    this.updatedDefScheduleShiftLines=[]
    for(var i=0;i<this.defscheduleShift.length;i++){
      this.updateDefscheduleShiftId=[this.defscheduleShift[i].SL+(this.defscheduleShift[i].id+ + +1),this.defscheduleShift[i].Sun,this.defscheduleShift[i].Mon,this.defscheduleShift[i].Tue,this.defscheduleShift[i].Wed,this.defscheduleShift[i].Thu,this.defscheduleShift[i].Fri,this.defscheduleShift[i].Sat,this.defscheduleShift[i].Pattern,this.defscheduleShift[i].shiftdurationc]
      this.updatedDefScheduleShiftLines.push(this.updateDefscheduleShiftId)
    }
    this.customizeScheduleShiftLines=[]
    for(var i=0;i<this.scheduleShift.length;i++){
      if(this.scheduleShift[i]!=undefined){
        if(this.scheduleShift[i].SL!=undefined && this.scheduleShift[i].SL!=null){
          this.customizeShiftData=[this.scheduleShift[i].SL+(this.scheduleShift[i].id+ + + 1 ),this.scheduleShift[i].Sun,this.scheduleShift[i].Mon,this.scheduleShift[i].Tue,this.scheduleShift[i].Wed,this.scheduleShift[i].Thu,this.scheduleShift[i].Fri,this.scheduleShift[i].Sat,this.scheduleShift[i].Pattern,this.scheduleShift[i].shiftdurationc]
        this.customizeScheduleShiftLines.push(this.customizeShiftData)
        }
      }
    }
/** refactor start */
    this.initdAy();

    const countCustomizedDays = (dayData) => {
      return [...dayData.reduce((r, e) => {
        let k = `${e.shiftDefintion}|${e.shift_duration}`;
        if (!r.has(k)) r.set(k, {...e, totalEmp: 1});
        else r.get(k).totalEmp++;
        return r;
      }, new Map).values()];
    };
    
    var countsCustomizedSunDay = countCustomizedDays(this.sundAy);
    var countsCustomizedMonDay = countCustomizedDays(this.mondAy);
    var countsCustomizedTueDay = countCustomizedDays(this.tuedAy);
    var countsCustomizedWedDay = countCustomizedDays(this.weddAy);
    var countsCustomizedThuDay = countCustomizedDays(this.thudAy);
    var countsCustomizedFriDay = countCustomizedDays(this.fridAy);
    var countsCustomizedSatDay = countCustomizedDays(this.satdAy);

    /** refactor end */
    /** refactor start */

    const isShiftFound = (countsCustomizedDay, shiftData) => {
      return countsCustomizedDay.some(element => {
        if (element.shiftDefintion === shiftData.startTime && shiftData.shift_duration === element.shift_duration) {
          return true;
        }
      });
    };
    
    const addShiftToDay = (countsCustomizedDay, shiftData) => {
      countsCustomizedDay.push({
        "shiftName": shiftData.shiftName,
        "shiftDefintion": shiftData.startTime,
        "shift_duration": shiftData.shift_duration,
        "shiftCategory": shiftData.shiftCategory,
        "totalEmp": 0
      });
    };
    
    for (const shiftData of this.allShiftData) {
      const isFoundSun = isShiftFound(countsCustomizedSunDay, shiftData);
      const isFoundMon = isShiftFound(countsCustomizedMonDay, shiftData);
      const isFoundTue = isShiftFound(countsCustomizedTueDay, shiftData);
      const isFoundWed = isShiftFound(countsCustomizedWedDay, shiftData);
      const isFoundThu = isShiftFound(countsCustomizedThuDay, shiftData);
      const isFoundFri = isShiftFound(countsCustomizedFriDay, shiftData);
      const isFoundSat = isShiftFound(countsCustomizedSatDay, shiftData);
    
      if (shiftData.shift_duration !== this.currentShiftlineScheduleShiftDuration &&
        !isFoundSun && !isFoundMon && !isFoundTue && !isFoundWed && !isFoundThu && !isFoundFri && !isFoundSat) {
        continue;
      } else {
        if (!isFoundSun) addShiftToDay(countsCustomizedSunDay, shiftData);
        if (!isFoundMon) addShiftToDay(countsCustomizedMonDay, shiftData);
        if (!isFoundTue) addShiftToDay(countsCustomizedTueDay, shiftData);
        if (!isFoundWed) addShiftToDay(countsCustomizedWedDay, shiftData);
        if (!isFoundThu) addShiftToDay(countsCustomizedThuDay, shiftData);
        if (!isFoundFri) addShiftToDay(countsCustomizedFriDay, shiftData);
        if (!isFoundSat) addShiftToDay(countsCustomizedSatDay, shiftData);
      }
    }
    /** refactor end */

    /** refactor start */
    
      // Initialize shifts
      this.initializeShifts();
    
      // Update counts for each day
      this.updateCounts(countsCustomizedSunDay, 'sun');
      this.updateCounts(countsCustomizedMonDay, 'mon');
      this.updateCounts(countsCustomizedTueDay, 'tue');
      this.updateCounts(countsCustomizedWedDay, 'wed');
      this.updateCounts(countsCustomizedThuDay, 'thu');
      this.updateCounts(countsCustomizedFriDay, 'fri');
      this.updateCounts(countsCustomizedSatDay, 'sat');
    
    /** refactor end */
    /** refactor start */
    this.initdAy('def');

    var countsCustomizedDefSunDay = countCustomizedDays(this.def_sundAy);
    var countsCustomizedDefMonDay = countCustomizedDays(this.def_mondAy);
    var countsCustomizedDefTueDay = countCustomizedDays(this.def_tuedAy);
    var countsCustomizedDefWedDay = countCustomizedDays(this.def_weddAy);
    var countsCustomizedDefThuDay = countCustomizedDays(this.def_thudAy);
    var countsCustomizedDefFriDay = countCustomizedDays(this.def_fridAy);
    var countsCustomizedDefSatDay = countCustomizedDays(this.def_satdAy);

    for (const shiftData of this.allShiftData) {
      var isFoundSun = isShiftFound(countsCustomizedDefSunDay, shiftData);
      var isFoundMon = isShiftFound(countsCustomizedDefMonDay, shiftData);
      var isFoundTue = isShiftFound(countsCustomizedDefTueDay, shiftData);
      var isFoundWed = isShiftFound(countsCustomizedDefWedDay, shiftData);
      var isFoundThu = isShiftFound(countsCustomizedDefThuDay, shiftData);
      var isFoundFri = isShiftFound(countsCustomizedDefFriDay, shiftData);
      var isFoundSat = isShiftFound(countsCustomizedDefSatDay, shiftData);
    
      if (shiftData.shift_duration !== this.currentShiftlineScheduleShiftDuration &&
        !isFoundSun && !isFoundMon && !isFoundTue && !isFoundWed && !isFoundThu && !isFoundFri && !isFoundSat) {
        continue;
      } else {
        if (!isFoundSun) addShiftToDay(countsCustomizedDefSunDay, shiftData);
        if (!isFoundMon) addShiftToDay(countsCustomizedDefMonDay, shiftData);
        if (!isFoundTue) addShiftToDay(countsCustomizedDefTueDay, shiftData);
        if (!isFoundWed) addShiftToDay(countsCustomizedDefWedDay, shiftData);
        if (!isFoundThu) addShiftToDay(countsCustomizedDefThuDay, shiftData);
        if (!isFoundFri) addShiftToDay(countsCustomizedDefFriDay, shiftData);
        if (!isFoundSat) addShiftToDay(countsCustomizedDefSatDay, shiftData);
      }
    }
   
    this.initializeShifts('def');
    this.updateCounts(countsCustomizedDefSunDay, 'def_sun');
    this.updateCounts(countsCustomizedDefMonDay, 'def_mon');
    this.updateCounts(countsCustomizedDefTueDay, 'def_tue');
    this.updateCounts(countsCustomizedDefWedDay, 'def_wed');
    this.updateCounts(countsCustomizedDefThuDay, 'def_thu');
    this.updateCounts(countsCustomizedDefFriDay, 'def_fri');
    this.updateCounts(countsCustomizedDefSatDay, 'def_sat');

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const daySuffixes = ['_MID', '_DAY', '_EVE', '_MID_DAY', '_DAY_EVE', '_EVE_MID'];
    const suffWithoutUnderline = ['Mid','Day','Eve','MidDay','DayEve','EveMid'];
    this.day_generate= [];this.total_day_generate=[];
    days.forEach((day,index) => {
      daySuffixes.forEach(suffix => {
        this.generatedEmpData[day + suffix] = this[day.toLowerCase() + suffix.toLowerCase()];
        this.defGeneratedData[day + suffix] = this['def_' + day.toLowerCase() + suffix.toLowerCase()];
      });

      const generated = daySuffixes.map(suffix => this.generatedEmpData[day + suffix]);
      const defGenerated = daySuffixes.map(suffix => this.defGeneratedData[day + suffix]);
      const upperDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      this[upperDay + 'DayGenerated'] = generated;
      this[upperDay + 'DayRequired'] = [];
      this['total' + upperDay + 'Generated'] = generated.reduce((acc, curr) => acc + curr, 0);
      const id = [0,3,1,4,2,5]
      this.day_generate.push({title:this[upperDay+'DayGenerated'],data:[],id});
      this['default' + upperDay + 'DayRequired'] = [];
      this['default' + upperDay + 'DayGenerated'] = defGenerated;
      this['defaultTotal' + upperDay + 'Generated'] = defGenerated.reduce((acc, curr) => acc + curr, 0);
      var temp = [];
      suffWithoutUnderline.forEach((suff,index) => {
        this['diff'+upperDay+suff] = this[upperDay + 'DayGenerated'][index] - this['default' + upperDay + 'DayGenerated'][index]
        temp.push(this['diff'+upperDay+suff]);
      });
      this.day_generate[index].data = temp;
      this['total'+upperDay+'diff'] =  this['total' + upperDay + 'Generated']-this['defaultTotal' + upperDay + 'Generated'];
      this.total_day_generate.push({diff:this['total'+upperDay+'diff'],total:this['total' + upperDay + 'Generated']});
    });
    this.reqData=[]
    for(var i=0;i<this.allShiftData.length;i++){
      this.req_shift_1_data={"shiftTime":this.allShiftData[i].startTime,"sun":this.allShiftData[i].Sun,"mon":this.allShiftData[i].Mon,"tue":this.allShiftData[i].Tue,"wed":this.allShiftData[i].Wed,"thu":this.allShiftData[i].Thu,"fri":this.allShiftData[i].Fri,"sat":this.allShiftData[i].Sat}
      this.reqData.push(this.req_shift_1_data)
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countsCustomizedDays = {
      Sun: countsCustomizedSunDay,
      Mon: countsCustomizedMonDay,
      Tue: countsCustomizedTueDay,
      Wed: countsCustomizedWedDay,
      Thu: countsCustomizedThuDay,
      Fri: countsCustomizedFriDay,
      Sat: countsCustomizedSatDay,
    };

    this.reqvsgenDataShiftTime = [
      { shift_start: 'Shifts', shift_length: 'Duration', shift_name: 'Shift Name' },
    ];

    weekDays.forEach((day) => {
      this[`reqvsgenData${day}`] = [{ shiftTime: '', [day]: day }];
    });

    this.reqvsgUpdate(countsCustomizedDays);

    const countsCustomizedDefDays = {
      Sun: countsCustomizedDefSunDay,
      Mon: countsCustomizedDefMonDay,
      Tue: countsCustomizedDefTueDay,
      Wed: countsCustomizedDefWedDay,
      Thu: countsCustomizedDefThuDay,
      Fri: countsCustomizedDefFriDay,
      Sat: countsCustomizedDefSatDay,
    };

    this.reqvsgenDefDataShiftTime = [
      { shift_start: 'Shifts', shift_length: 'Duration', shift_name: 'Shift Name' },
    ];

    weekDays.forEach((day) => {
      this[`reqvsgenDefData${day}`] = [{ shiftTime: '', [day]: day }];
    });

    this.reqvsgUpdate(countsCustomizedDefDays);
    this.final_day_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 3), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 3));
    this.final_eve_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 2), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 2));
    this.final_mid_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 1), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 1));
    this.eve_mid_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 6), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 6));
    this.day_eve_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 5), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 5));
    this.mid_day_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 4), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 4));

    this.ReqVsGeneData=[]
    this.defReqVsGeneData=[]
    this.ReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    this.ReqVsGeneData.push(["MID",this.generatedEmpData.SUN_MID,this.generatedEmpData.MON_MID,this.generatedEmpData.TUE_MID,this.generatedEmpData.WED_MID,this.generatedEmpData.THU_MID,this.generatedEmpData.FRI_MID,this.generatedEmpData.SAT_MID])
    this.ReqVsGeneData.push(["DAY",this.generatedEmpData.SUN_DAY,this.generatedEmpData.MON_DAY,this.generatedEmpData.TUE_DAY,this.generatedEmpData.WED_DAY,this.generatedEmpData.THU_DAY,this.generatedEmpData.FRI_DAY,this.generatedEmpData.SAT_DAY])
    this.ReqVsGeneData.push(["EVE",this.generatedEmpData.SUN_EVE,this.generatedEmpData.MON_EVE,this.generatedEmpData.TUE_EVE,this.generatedEmpData.WED_EVE,this.generatedEmpData.THU_EVE,this.generatedEmpData.FRI_EVE,this.generatedEmpData.SAT_EVE])
    this.ReqVsGeneData.push(["MID-DAY",this.generatedEmpData.SUN_MID_DAY,this.generatedEmpData.MON_MID_DAY,this.generatedEmpData.TUE_MID_DAY,this.generatedEmpData.WED_MID_DAY,this.generatedEmpData.THU_MID_DAY,this.generatedEmpData.FRI_MID_DAY,this.generatedEmpData.SAT_MID_DAY])
    this.ReqVsGeneData.push(["DAY-EVE",this.generatedEmpData.SUN_DAY_EVE,this.generatedEmpData.MON_DAY_EVE,this.generatedEmpData.TUE_DAY_EVE,this.generatedEmpData.WED_DAY_EVE,this.generatedEmpData.THU_DAY_EVE,this.generatedEmpData.FRI_DAY_EVE,this.generatedEmpData.SAT_DAY_EVE])
    this.ReqVsGeneData.push(["EVE-MID",this.generatedEmpData.SUN_EVE_MID,this.generatedEmpData.MON_EVE_MID,this.generatedEmpData.TUE_EVE_MID,this.generatedEmpData.WED_EVE_MID,this.generatedEmpData.THU_EVE_MID,this.generatedEmpData.FRI_EVE_MID,this.generatedEmpData.SAT_EVE_MID])
    this.ReqVsGeneData.push(["", this.totalSunGenerated, this.totalMonGenerated, this.totalTueGenerated, this.totalWedGenerated,this.totalThuGenerated, this.totalFriGenerated, this.totalSatGenerated])
    this.defReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    this.defReqVsGeneData.push(["MID",this.defGeneratedData.SUN_MID,this.defGeneratedData.MON_MID,this.defGeneratedData.TUE_MID,this.defGeneratedData.WED_MID,this.defGeneratedData.THU_MID,this.defGeneratedData.FRI_MID,this.defGeneratedData.SAT_MID])
    this.defReqVsGeneData.push(["DAY",this.defGeneratedData.SUN_DAY,this.defGeneratedData.MON_DAY,this.defGeneratedData.TUE_DAY,this.defGeneratedData.WED_DAY,this.defGeneratedData.THU_DAY,this.defGeneratedData.FRI_DAY,this.defGeneratedData.SAT_DAY])
    this.defReqVsGeneData.push(["EVE",this.defGeneratedData.SUN_EVE,this.defGeneratedData.MON_EVE,this.defGeneratedData.TUE_EVE,this.defGeneratedData.WED_EVE,this.defGeneratedData.THU_EVE,this.defGeneratedData.FRI_EVE,this.defGeneratedData.SAT_EVE])
    this.defReqVsGeneData.push(["MID-DAY",this.defGeneratedData.SUN_MID_DAY,this.defGeneratedData.MON_MID_DAY,this.defGeneratedData.TUE_MID_DAY,this.defGeneratedData.WED_MID_DAY,this.defGeneratedData.THU_MID_DAY,this.defGeneratedData.FRI_MID_DAY,this.defGeneratedData.SAT_MID_DAY])
    this.defReqVsGeneData.push(["DAY-EVE",this.defGeneratedData.SUN_DAY_EVE,this.defGeneratedData.MON_DAY_EVE,this.defGeneratedData.TUE_DAY_EVE,this.defGeneratedData.WED_DAY_EVE,this.defGeneratedData.THU_DAY_EVE,this.defGeneratedData.FRI_DAY_EVE,this.defGeneratedData.SAT_DAY_EVE])
    this.defReqVsGeneData.push(["EVE-MID",this.defGeneratedData.SUN_EVE_MID,this.defGeneratedData.MON_EVE_MID,this.defGeneratedData.TUE_EVE_MID,this.defGeneratedData.WED_EVE_MID,this.defGeneratedData.THU_EVE_MID,this.defGeneratedData.FRI_EVE_MID,this.defGeneratedData.SAT_EVE_MID])
    this.defReqVsGeneData.push(["",this.defaultTotalSunGenerated,this.defaultTotalMonGenerated,this.defaultTotalTueGenerated,this.defaultTotalWedGenerated,this.defaultTotalThuGenerated, this.defaultTotalFriGenerated, this.defaultTotalSatGenerated])
    
        return this.totalCount,this.countSunSat,this.countSunMon,this.countMonTue,this.countTueWed,this.countWedThu,this.countThuFri,this.countFriSat,this.SunSat,this.SunMon,this.MonTue,this.TueWed,this.WedThu,this.ThuFri,this.FriSat


  }

  private initializeCounts(data){
    this.totalCount=0;this.countNC=0
    this.countSunSat=0;this.countSunMon=0;this.countMonTue=0;this.countTueWed=0;this.countWedThu=0;this.countThuFri=0;this.countFriSat=0;
    this.countFSS=0;this.countSMS=0;this.countSMT=0;this.countMTW=0;this.countTWT=0;this.countWTF=0;this.countTFS=0;
    for (let i = 0; i <= data.length; i++) {
      const shift = data[i];
    
      if (shift) {
        const { SL } = shift;
    
        if (SL == 'SS' || SL == 'SS-A') this.countSunSat++;
        else if (SL == 'SM' || SL == 'SM-A') this.countSunMon++;
        else if (SL == 'MT' || SL == 'MT-A') this.countMonTue++;
        else if (SL == 'TW' || SL == 'TW-A') this.countTueWed++;
        else if (SL == 'WT' || SL == 'WT-A' || SL == 'WTh' || SL == 'WTh-A') this.countWedThu++;
        else if (SL == 'TF' || SL == 'TF-A' || SL == 'ThF' || SL == 'ThF-A') this.countThuFri++;
        else if (SL == 'FS' || SL == 'FS-A') this.countFriSat++;
        else if (SL == 'TFS' || SL == 'TFS-A' || SL == 'ThFS' || SL == 'ThFS-A') this.countTFS++;
        else if (SL == 'FSS' || SL == 'FSS-A') this.countFSS++;
        else if (SL == 'SMS' || SL == 'SMS-A') this.countSMS++;
        else if (SL == 'SMT' || SL == 'SMT-A') this.countSMT++;
        else if (SL == 'MTW' || SL == 'MTW-A') this.countMTW++;
        else if (SL == 'TWT' || SL == 'TWT-A' || SL == 'TWTh' || SL == 'TWTh-A') this.countTWT++;
        else if (SL == 'WTF' || SL == 'WTF-A' || SL == 'WThF' || SL == 'WThF-A') this.countWTF++;
        else this.countNC++;
        this.totalCount++
      }
    }
  }

  private initializeAndCreateRdosArr(scheduleShift) {
    this.initializeCounts(scheduleShift);
    const baseRdos = [
      {'rdo':'SS','rdoInfo':'Sat-Sun','rdoTitle':'SunSat',},
      {'rdo':'SM','rdoInfo':'Sun-Mon','rdoTitle':'SunMon'},
      {'rdo':'MT','rdoInfo':'Mon-Tue','rdoTitle':'MonTue'},
      {'rdo':'TW','rdoInfo':'Tue-Wed','rdoTitle':'TueWed'},
      {'rdo':'WTh','rdoInfo':'Wed-Thu','rdoTitle':'WedThu'},
      {'rdo':'ThF','rdoInfo':'Thu-Fri','rdoTitle':'ThuFri'},
      {'rdo':'FS','rdoInfo':'Fri-Sat','rdoTitle':'FriSat'},
      {'rdo':'FSS','rdoInfo':'Fri-Sat-Sun','rdoTitle':'FSS'},
      {'rdo':'SMS','rdoInfo':'Sun-Mon-Sat','rdoTitle':'SMS'},
      {'rdo':'SMT','rdoInfo':'Sun-Mon-Tue','rdoTitle':'SMT'},
      {'rdo':'MTW','rdoInfo':'Mon-Tue-Wed','rdoTitle':'MTW'},
      {'rdo':'TWTh','rdoInfo':'Tue-Wed-Thu','rdoTitle':'TWT'},
      {'rdo':'WThF','rdoInfo':'Wed-Thu-Fri','rdoTitle':'WTF'},
      {'rdo':'ThFS','rdoInfo':'Thu-Fri-Sat','rdoTitle':'TFS'},
      {'rdo':'NC','rdoInfo':'NC','rdoTitle':'NC'},
    ];
  
    const rdosArr = baseRdos.map(rdo => ({...rdo, 'count': this[`count${rdo.rdoTitle}`]})).filter(rdo => rdo.count > 0);
    return rdosArr;
  }

  private initializeShifts(def?:string) {
    const days =def?['def_sun', 'def_mon', 'def_tue', 'def_wed', 'def_thu', 'def_fri', 'def_sat']: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (const day of days) {
      for (let i = 1; i <= 6; i++) {
        this[`${day}_` + ['mid', 'day', 'eve', 'mid_day', 'day_eve', 'eve_mid'][i - 1]] = 0;
      }
    }
  }
  
 private updateCounts(dayCounts, dayPrefix) {
    for (const count of dayCounts) {
      switch (count.shiftCategory) {
        case '1': case 1: this[`${dayPrefix}_mid`] += +count.totalEmp; break;
        case '3':case 3: this[`${dayPrefix}_day`] += +count.totalEmp; break;
        case '2': case 2:this[`${dayPrefix}_eve`] += +count.totalEmp; break;
        case '4': case 4:this[`${dayPrefix}_mid_day`] += +count.totalEmp; break;
        case '5': case 5:this[`${dayPrefix}_day_eve`] += +count.totalEmp; break;
        case '6': case 6:this[`${dayPrefix}_eve_mid`] += +count.totalEmp; break;
      }
    }
  }
  private initdAy(def?:string){
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const underdef = def ? def + '_':'';
    const defScedule = def? 'defscheduleShift':'scheduleShift';
    const dayArrays = days.map(day => this[`${underdef}${day.toLowerCase()}dAy`] = []);
    
    for (let i = 0; i < this[defScedule].length; i++) {
      const shift = this[defScedule][i];
      const shiftDuration = shift.shiftdurationc;
    
      days.forEach((day, idx) => {
        const dayShifts = dayArrays[idx];
        const mainShift = shift[day];
        const secondShift = shift[`${day}shift2`];
    
        if (mainShift && mainShift.toLowerCase() !== 'x') {
          const isNine = Number(shiftDuration) === 9;
          const shiftName = isNine ? mainShift.split('-')[0] : mainShift;
          this[`${underdef}${day.toLowerCase()}dAy`].push({
            "shiftName": shiftName,
            "shiftDefintion": this.convertRDOtoShiftDefintion(mainShift, shiftDuration),
            "shift_duration": this.getShiftDuration(mainShift, shiftDuration),
            "shiftCategory": this.getShiftCategory(mainShift, shiftDuration)
          });
        }
    
        if (secondShift && secondShift.toLowerCase() !== 'x') {
          const shiftName = secondShift.split('-')[0];
          this[`${underdef}${day.toLowerCase()}dAy`].push({
            "shiftName": shiftName,
            "shiftDefintion": this.convertRDOtoShiftDefintion(secondShift, shiftDuration),
            "shift_duration": this.getShiftDuration(secondShift, shiftDuration),
            "shiftCategory": this.getShiftCategory(secondShift, shiftDuration)
          });
        }
      });
    }
  }

  private reqvsgUpdate(countsCustomizedDays:any,def?:string){
    const t1 = def?'reqvsgenDefDataShiftTime':'reqvsgenDataShiftTime';
    const t2 = def?'reqvsgenDefData':'reqvsgenData';
    function processDayData(dayData) {
      const r1 = [];
      const r = [];
      dayData.forEach((e) => {
        if (e['shiftCategory'] === 1) {
          r1.unshift(e);
        } else {
          r.push(e);
        }
      });
      r1.sort((a, b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
      r.sort((a, b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
      return r1.concat(r).sort((a, b) => Number(a.shift_duration) - Number(b.shift_duration));
    }

    Object.keys(countsCustomizedDays).forEach((day) => {
      countsCustomizedDays[day] = processDayData(countsCustomizedDays[day]);
    });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.allShiftData.forEach((shift) => {
      weekDays.forEach((day) => {
        const dayData = countsCustomizedDays[day];
        for (let j = 0; j < dayData.length; j++) {
          if (Number(shift.startTime) === Number(dayData[j].shiftDefintion) && Number(shift.shift_duration) === Number(dayData[j].shift_duration)) {
            if (day === 'Sun') {
              this[t1].push({ shift_start: String(shift.startTime), shift_length: String(shift.shift_duration), shift_name: String(shift.shiftName) });
            }
            this[`${t2}${day}`].push({
              shiftTime: String(shift.startTime),
              [day]: Number(dayData[j].totalEmp),
              shiftCategory: Number(dayData[j].shiftCategory),
              shift_duration: Number(dayData[j].shift_duration),
            });
          }
        }
      });
    });
  }

  private createSummary(reqData: any[], defData: any[]): any[] {
    return reqData.map(req => {
      const matchingDef = defData.find(def => 
        req.shiftTime === def.shiftTime && 
        req.shiftCategory === def.shiftCategory && 
        req.shift_duration === def.shift_duration
      );
  
      if (matchingDef) {
        return {
          shiftTime: req.shiftTime,
          shiftCategory: Number(req.shiftCategory),
          shift_duration: Number(req.shift_duration),
          ...this.calculateDifferences(req, matchingDef),
        };
      }
  
      return null;
    }).filter(item => item !== null);
  }
  
  private calculateDifferences(req: any, def: any): any {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = {};
  
    days.forEach(day => {
      result[`def${day}`] = def[day];
      result[day] = req[day];
      result[`diff${day}`] = Number(req[day]) - Number(def[day]);
    });
  
    return result;
  }

  
  getShiftDuration(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{

        if(Number(shiftlength)==9){
            return Number(rdo.split('-')[1])
        }else{
          return Number(shiftlength)
        }
    }
  }
  getShiftCategory(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{
      for(var i=0;i<this.allShiftData.length;i++){
        if(Number(shiftlength)==9){
          if(String(this.allShiftData[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(this.allShiftData[i].shift_duration)){
            return this.allShiftData[i].shiftCategory
          }
        }else{
          if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
            return this.allShiftData[i].shiftCategory
          }
        }
      }
    }
  }
  goBack(){
    this.navCtrl.navigateBack([straightlines_io_apis.apis.enter_Work_load_api])
  }
  change(){
    this.slides.getActiveIndex().then(index => {
      this.schedule_id=index
      this.ngOnInit(true)
   })
  }
  async openMenu(){
    const modal = await this.modalCtrl.create({
      component: EditScheduleActionSheetComponent,
      cssClass: 'action-sheet-for-shiftline-schedule',
      componentProps: {
        edit_schedule_id:this.edit_schedule_id,
        shiftline_schedule_name:this.shiftline_schedule_name,
        scheduleShift:this.scheduleShift,
        defscheduleShift:this.defscheduleShift,
        defReqVsGeneData:this.defReqVsGeneData,
        ReqVsGeneData:this.ReqVsGeneData,
        reqvsgenDefDataShiftTime:this.reqvsgenDefDataShiftTime,
        reqvsgenDefDataSun:this.reqvsgenDefDataSun,
        reqvsgenDefDataMon:this.reqvsgenDefDataMon,
        reqvsgenDefDataTue:this.reqvsgenDefDataTue,
        reqvsgenDefDataWed:this.reqvsgenDefDataWed,
        reqvsgenDefDataThu:this.reqvsgenDefDataThu,
        reqvsgenDefDataFri:this.reqvsgenDefDataFri,
        reqvsgenDefDataSat:this.reqvsgenDefDataSat,
        reqvsgenDataShiftTime:this.reqvsgenDataShiftTime,
        reqvsgenDataSun:this.reqvsgenDataSun,
        reqvsgenDataMon:this.reqvsgenDataMon,
        reqvsgenDataTue:this.reqvsgenDataTue,
        reqvsgenDataWed:this.reqvsgenDataWed,
        reqvsgenDataThu:this.reqvsgenDataThu,
        reqvsgenDataFri:this.reqvsgenDataFri,
        rdosArr:this.rdosArr,
        defrdosArr:this.defrdosArr,
        reqvsgenDataSat:this.reqvsgenDataSat},
      swipeToClose:true
    });
    return await modal.present();
}
  async saveInDataBase(){
        var tempArr=[],newShiftLine=[]
        var all_shift_data=[],obj
        for(var i=0;i<this.scheduleShift.length;i++){
          {

        // if( this.scheduleShift[i].id!==null){
            obj={
              "schedule_id": this.scheduleShift[i].schedule_id,
              "id": this.scheduleShift[i].id,
              "shiftdurationc":this.scheduleShift[i].shiftdurationc,
            "seq_id": this.scheduleShift[i].seq_id,
            "mon": this.scheduleShift[i].Mon,
            "tue": this.scheduleShift[i].Tue,
            "wed": this.scheduleShift[i].Wed,
            "thu": this.scheduleShift[i].Thu,
            "fri": this.scheduleShift[i].Fri,
            "sat": this.scheduleShift[i].Sat,
            "sun": this.scheduleShift[i].Sun,
            "pattern": this.scheduleShift[i].Pattern,
            "schedulename": this.scheduleShift[i].schedulename,
            "shiftname": this.scheduleShift[i].SL,
            "areaid": this.scheduleShift[i].areaid,
            "userid": this.scheduleShift[i].userid}
            tempArr.push(obj)

        }

        }

        var tempObj={},tempShiftObj={}
        var tempNewArr=[]

        for(var i=0;i<tempArr.length;i++){

            tempObj={
              "sh_line_id": tempArr[i].id,
              "seq_id": tempArr[i].seq_id,
              "mon": tempArr[i].mon,
              "tue": tempArr[i].tue,
              "wed": tempArr[i].wed,
              "thu":tempArr[i].thu,
              "fri": tempArr[i].fri,
              "shiftdurationc":tempArr[i].shiftdurationc,
              "sat": tempArr[i].sat,
              "sun": tempArr[i].sun,
              "pattern": tempArr[i].pattern,
              "schedulename": tempArr[i].schedulename,
              "shiftname": tempArr[i].shiftname,
              "shidref": tempArr[i].schedule_id,
          }
          tempNewArr.push(tempObj)
        }
        var finalScheduleDataOfUpdate={
          "schedulename":this.shiftline_schedule_name,
          "areaid":tempArr[0].areaid,
          "userid": this.user_data.id,
          "shiftdurationp":8,
             "sh_schedule_id":this.edit_schedule_id,
        "schild":tempNewArr
        }
        this.deletedShiftLines=JSON.parse(this.localData.getItem('deletedShiftLines'))
        if(this.deletedShiftLines!=null){
        for(var i=0;i<this.deletedShiftLines.length;i++){
          if(this.deletedShiftLines[i]!=null ){
            if( this.deletedShiftLines[i].id!=null ){
              this.scheduleService.newdeleteShiftLine(this.deletedShiftLines[i].id).subscribe(
                (res)=>{
                },
                (err)=>{console.log(err);},()=>{})
            }
          }
        }
        this.localData.removeItem('deletedShiftLines')
      }

        this.scheduleService.newupdateSchedule(finalScheduleDataOfUpdate.sh_schedule_id,finalScheduleDataOfUpdate).subscribe(
          (res)=>{

            Swal.fire({
              title: 'Updated successfully!',
              icon: 'success',
              showCancelButton: false,
              imageHeight:'250px',
              confirmButtonColor:'#ff6700',
              heightAuto:false,
            }).then((result) => {
              // this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
              if(this.user_data.role=='bidmanager'){
                this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
              }else{
                this.navCtrl.navigateBack([straightlines_io_apis.apis.guest_manage_shift_line_schedule])
              }
            })
          },
          (err)=>{
            console.log(err);
            Swal.fire({
              title: 'Error!',
              html: 'Please try again later!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor:'#ff6700',
              imageHeight:'250px',
              heightAuto:false,
            }).then((result) => {
              this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
            })

          },
          ()=>{}
        )

  }
  
async export() {
  let loading = await this.loadingController.create({
    cssClass: 'custom-loading',
    spinner:'bubbles',
    message: 'Please Wait...',
    duration: 10000,

  });
  await loading.present();
  
  await this.generateScheduleHelper.export(
    this.allShiftDataWithIncludeExclude,
    this.allShiftData,
    this.shiftline_schedule_name,
    this.scheduleShift,
    this.rdosArr,
    this.defrdosArr,
    this.ReqVsGeneData,
    this.defscheduleShift,
    this.reqvsgenDataShiftTime,
    this.defReqVsGeneData,
    this.reqvsgenDefDataShiftTime,
    this.reqvsgenDataSun,
    this.reqvsgenDataMon,
    this.reqvsgenDataTue,
    this.reqvsgenDataWed,
    this.reqvsgenDataThu,
    this.reqvsgenDataFri,
    this.reqvsgenDataSat,
    this.reqvsgenDefDataSun,
    this.reqvsgenDefDataMon,
    this.reqvsgenDefDataThu,
    this.reqvsgenDefDataWed,
    this.reqvsgenDefDataThu,
    this.reqvsgenDefDataFri,
    this.reqvsgenDefDataSat,
    this.fileName
    )

  await loading.dismiss();

}
    checkDisablepopup=false
myFunction() {
  this.checkDisablepopup=false
  if(this.checkDisablepopup==false){
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
    if(popupshowsummaryInfo.classList.contains("showsummaryInfo")==true){
      popupshowsummaryInfo.classList.toggle("showsummaryInfo");
    }
    var popup = document.getElementById("popupShiftDuration");
    if(popup.classList.contains("showsummaryInfo")==true){
      popup.classList.toggle("showsummaryInfo");
    }
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

}
disablepopup(){
  if(this.checkDisablepopup==true){
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
    if(popupshowsummaryInfo.classList.contains("showsummaryInfo")==true){
      popupshowsummaryInfo.classList.toggle("showsummaryInfo");
    }
    var popup = document.getElementById("popupShiftDuration");
    if(popup.classList.contains("showsummaryInfo")==true){
      popup.classList.toggle("showsummaryInfo");
    }
    if(this.oldrdoIndex!=undefined){
      var popup = document.getElementById("popupRdo"+this.oldrdoIndex);
      if(popup.classList.contains("showrdo")==true){
        popup.classList.toggle("showrdo");
      }
      this.oldrdoIndex=undefined
    }

    var popup = document.getElementById("myPopup");
    if(popup.classList.contains("show")==true){
      popup.classList.toggle("show");
    }
  }
  this.checkDisablepopup=true
}
popupShiftDuration(){
  this.checkDisablepopup=false
  if(this.checkDisablepopup==false){
    var popup = document.getElementById("myPopup");
    if(popup.classList.contains("show")==true){
      popup.classList.toggle("show");
    }
    var popup = document.getElementById("myPopupsummaryInfo");
    if(popup.classList.contains("showsummaryInfo")==true){
      popup.classList.toggle("showsummaryInfo");
    }
    if(this.oldrdoIndex!=undefined){
      var popup = document.getElementById("popupRdo"+this.oldrdoIndex);
      if(popup.classList.contains("showrdo")==true){
        popup.classList.toggle("showrdo");
      }
      this.oldrdoIndex=undefined
    }

    var popupshowsummaryInfo = document.getElementById("popupShiftDuration");
    popupshowsummaryInfo.classList.toggle("showsummaryInfo");
  }

}

oldrdoIndex=undefined
rdoInfo(index){
  this.checkDisablepopup=false
  if(this.checkDisablepopup==false){
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
    if(popupshowsummaryInfo.classList.contains("showsummaryInfo")==true){
      popupshowsummaryInfo.classList.toggle("showsummaryInfo");
    }
    var popup = document.getElementById("myPopup");
    if(popup.classList.contains("show")==true){
      popup.classList.toggle("show");
    }
    if(this.oldrdoIndex!=undefined){
      var popup = document.getElementById("popupRdo"+this.oldrdoIndex);
      if(popup.classList.contains("showrdo")==true){
        popup.classList.toggle("showrdo");
      }
    }
    var popup = document.getElementById("popupRdo"+index);
    popup.classList.toggle("showrdo");
    this.oldrdoIndex=index
  }

}
summaryInfo(){
  this.checkDisablepopup=false
  if(this.checkDisablepopup==false){
    var popup = document.getElementById("myPopup");
    if(popup.classList.contains("show")==true){
      popup.classList.toggle("show");
    }
    if(this.oldrdoIndex!=undefined){
      var popup = document.getElementById("popupRdo"+this.oldrdoIndex);
      if(popup.classList.contains("showrdo")==true){
        popup.classList.toggle("showrdo");
      }
      this.oldrdoIndex=undefined
    }

    var popup = document.getElementById("popupShiftDuration");
    if(popup.classList.contains("showsummaryInfo")==true){
      popup.classList.toggle("showsummaryInfo");
    }
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
    popupshowsummaryInfo.classList.toggle("showsummaryInfo");
  }

}
    async addNewShiftLine(){
      const modal = await this.modalCtrl.create({
        component: AddNewShiftLinePage,
        cssClass: 'addNewShiftLine',
        swipeToClose:true,
       componentProps: {edit_schedule:"edit_schedule" }

      });
      modal.onDidDismiss().then(()=>{
        this.ngOnInit(true)
      })
      return await modal.present();

    }
    async midShiftsDetails(){

      const modal = await this.modalCtrl.create({
        component: MidSummaryComponent,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { summaryType:"Mid Shift",summaryData:this.final_mid_Summary ,default:false }

      });
      // this.scheduleShift=EditScheduleDataPage.data5
      return await modal.present();

    }

    async dayShiftsDetails(){

      const modal = await this.modalCtrl.create({
        component: MidSummaryComponent,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { summaryType:"Day Shift",summaryData:this.final_day_Summary ,default:false }
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5
      return await modal.present();

    }

    async eveShiftsDetails(){

      const modal = await this.modalCtrl.create({
        component: MidSummaryComponent,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { summaryType:"Eve Shift",summaryData:this.final_eve_Summary,default:false }
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5
      return await modal.present();

    }
    async daySummary(day_summary){
      const modal = await this.modalCtrl.create({
        component: MidSummaryComponent,
        componentProps: { summaryType:"day",summaryData:{"mid":this.final_mid_Summary,"day":this.final_day_Summary,"eve":this.final_eve_Summary,"mid_day":this.mid_day_summary,"day_eve":this.day_eve_summary,"eve_mid":this.eve_mid_summary},day:day_summary ,default:false },
        cssClass: 'dayEditSummaryData',
        // cssClass: 'daySummaryData',
        swipeToClose:true
      });
      return await modal.present();

    }
    logOut(){
      sessionStorage.removeItem('token')
    this.navCtrl.navigateBack('login')
    }
    getIndicatorClass(id1){
      if(this.schedule_id===id1 ) {
        return 'active';
      }else {
        return 'small';
      }
      return 'hidden';
    }
    showLegends(){

      if(this.hide_BL_rules_Labels==false){
        return this.hide_BL_rules_Labels=true
      }else{
        return this.hide_BL_rules_Labels=false
      }
    }
  async edit(selectedShiftLine){
  const modal = await this.modalCtrl.create({
    component: EditShiftLineScheduleComponent,
    cssClass: 'editScheduleEditShiftLine',
    componentProps: { scheduleData: selectedShiftLine ,schedule_id:null},
    swipeToClose:true
  })
  modal.onDidDismiss().then(()=>{
    this.ngOnInit(true)
  })
  // this.scheduleShift=EditScheduleDataPage.data5

  return await modal.present();

}


    handleSlide(event){
      event.target.getSlidingRatio().then(res=> {
        if(res>1.2){
          this.nextslide=false
          this.slides.lockSwipes(false);
          // this.slides.slid(1)

        }
        if(res > 0 && res<1.2){
          this.nextslide=true
          this.slides.lockSwipes(true);
        }
      });
    }
    scheduleOne=true
    scheduleTwo=false
    scheduleThree=false
    schedule(id){
      if(id==0){
        this.slides.slideTo(id)
              this.schedule_id=0
      }else if(id==1){
        this.slides.slideTo(id)
        this.schedule_id=1
      }else if(id==2){
        this.slides.slideTo(id)
        this.schedule_id=2
      }
  }

  expand_shiftlineid
  expand(expandShiftlineId,selectedShiftline){
    if(this.expand_shiftlineid==expandShiftlineId){
      this.expand_shiftlineid=null
    }else{
      this.expand_shiftlineid=expandShiftlineId
    }
  }

    numberMargin(i,j){
      var temp
      temp=i+j

      if(Array.from(temp).length<4){
        if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
          return 'margin31'
        }else{
          return 'margin3'
        }
      }
      else if(Array.from(temp).length<5){
        if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
          return 'margin41'
        }else{
          return 'margin4'
        }

      }
      else if(Array.from(temp).length<6){
        return 'margin5'
      }
      else if(Array.from(temp).length<7){
        // return 'margin6'
        if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
          return 'margin61'
        }else{
          return 'margin6'
        }
      }
      else{
        return 'margin7'
      }

    }

    expandlistSlide(i,j,l,index){
      var temp
      temp=i+index
      if((Number(this.focusShiftLine)+ + +1)==j){
        if(Array.from(temp).length<4){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<5){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<6){
          return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<7){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<8){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else{
          return 'title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
        }
      }else{
        if(Array.from(temp).length<4){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<5){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<6){
          return 'ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<7){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<8){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else{
          return 'ion-text-center ion-no-padding ion-no-margin font-size'
        }
      }
    }




  convertRDOtoShiftDefintion(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{
      for(var i=0;i<this.allShiftDataWithIncludeExclude.length;i++){
             if(Number(shiftlength)==9){
          if(String(this.allShiftData[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(this.allShiftData[i].shift_duration)){
            return String(this.allShiftData[i].startTime)
          }
             } else {
               if (Number(shiftlength) == 10) {
                 if (Number(rdo)) {
                   if(String(this.allShiftData[i].shiftName)==`${String(rdo)}t` && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
                     return String(this.allShiftData[i].startTime)
                   }
                 } else {
                   if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
                     return String(this.allShiftData[i].startTime)
                   }
                 }
               } else {
                 if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
                   return String(this.allShiftData[i].startTime)
                 }
               }
        }
      }

    }
  }
  rdoColors(rdo){
    if(rdo=='SS' || rdo=='FSS'){
      return 'colors-sat-sun'
    }else if(rdo=='SM' || rdo=='SMS'){
      return 'colors-sun-mon'
    }else if(rdo=='MT' || rdo=='SMT'){
      return 'colors-mon-tue'
    }else if(rdo=='TW' || rdo=='MTW'){
      return 'colors-tue-wed'
    }else if(rdo=='WTh' || rdo=='TWTh'){
      return 'colors-wed-thu'
    }else if(rdo=='ThF' || rdo=='WThF'){
      return 'colors-thu-fri'
    }else if(rdo=='FS' || rdo=='ThFS'){
      return 'colors-fri-sat'
    }else{
      return 'colors-nc-rdos'
    }
  }

  minimize() {
    this.maximizeCard = false;
  }

  maximize() {
    this.maximizeCard = true;
  }

  async updateLocalShiftData() {
    var all_defined_shifts = await this.workLoadDataService
      .getAllSystemDefinedShiftDefinition(8)
      .toPromise();
    
    var system_defined_ten_hours_shifts = await this.workLoadDataService
      .getAllSystemDefinedShiftDefinition(10)
      .toPromise();
    
    system_defined_ten_hours_shifts.forEach((shift) => all_defined_shifts.push(shift));
    
    var user_defined_shifts = await this.workLoadDataService
      .getAllShiftDefinition(this.user_data.id)
      .toPromise();
    
    user_defined_shifts.map((data) => ({
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
        all_defined_shifts.push(data);
      });
    
    all_defined_shifts = all_defined_shifts.map((data) => ({
                          ...data,
                          Sun: data.sun,
                          Mon: data.mon,
                          Tue: data.tue,
                          Wed: data.wed,
                          Thu: data.thu,
                          Fri: data.fri,
                          Sat: data.sat,
                          sunOutlier: false,
                          monOutlier: false,
                          tueOutlier: false,
                          wedOutlier: false,
                          thuOutlier: false,
                          friOutlier: false,
                          satOutlier: false,
                          startTime: data.startTime
                            .substring(0, data.startTime.length - 3)
                            .replace(':', ''),
                        }))
                        .sort((a, b) => 
                          a.startTime.localeCompare(b.startTime)
                        ).sort((a, b) => {
                          return (Number(a.startTime) >= 2200) ? -1 : 1
                        });
    if (this.selected_shift_duration == 9) {
      all_defined_shifts = all_defined_shifts.sort((a, b) => a.shift_duration - b.shift_duration);
    }

    this.allShiftName = [];
    this.allShiftData = all_defined_shifts;
    this.allShiftData.forEach((shift) => {
      if (shift.sh_include_exclude == 'I' &&
          (Number(this.selected_shift_duration) == 9 ||
          Number(this.selected_shift_duration) != 9 && shift.shift_duration == Number(this.selected_shift_duration))) {
        this.allShiftName.push({
          "shiftName": shift.shiftName,
          "shiftCategory": shift.shiftCategory,
          "shift_StartTime": shift.startTime,
          "shift_category_name": this.shiftCategoryName[shift.shiftCategory - 1],
          "shift_duration": shift.shift_duration,
          "shiftData": String(shift.shiftName) + '-' + String(shift.shift_duration)
        })
      }
    });
    
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(all_defined_shifts)
    );
  }

  isShiftOfType(d,array){
    return array.includes(d.SL)
  }

  getColorClass(shift: string): string {
    const entry = this.dateset.find(item => item.shift.some(s => this.matchShift(s, shift)));
    return entry ? `colors-${entry.color}` : 'colors-nc-rdos';
  }
  
  matchShift(shiftPattern: string, shift: string): boolean {
    return shiftPattern === shift;
  }
  
}
