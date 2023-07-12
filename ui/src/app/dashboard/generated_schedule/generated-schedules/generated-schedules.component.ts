
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, LoadingController, ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { ViewSummaryDayCategoryWisePage } from 'src/app/dashboard/generated_schedule/summary/view-summary-day-category-wise/view-summary-day-category-wise.page';
import { ViewTotalEveShiftLinesDataPage } from 'src/app/dashboard/generated_schedule/summary/view-total-eve-shift-lines-data/view-total-eve-shift-lines-data.page';
import { ViewTotalDayShiftLinesDataPage } from 'src/app/dashboard/generated_schedule/summary/view-total-day-shift-lines-data/view-total-day-shift-lines-data.page';
import { ViewTotalMidShiftLinesDataPage } from 'src/app/dashboard/generated_schedule/summary/view-total-mid-shift-lines-data/view-total-mid-shift-lines-data.page';
import { AddNewShiftLinePage } from 'src/app/dashboard/generated_schedule/add-edit-shift-lines/add-new-shift-line/add-new-shift-line.page';
import { SaveScheduleComponent } from './save-schedule/save-schedule.component';
import { EditScheduleDataPage } from '../add-edit-shift-lines/edit-schedule-data/edit-schedule-data.page';
import { HttpClient } from '@angular/common/http';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { GenerateScheduleHelper } from '../../../helper/schedule.helper';

@Component({
  selector: 'app-generated-schedules',
  templateUrl: './generated-schedules.component.html',
  styleUrls: ['./generated-schedules.component.scss'],
})
export class GeneratedSchedulesComponent implements OnInit {

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
  gDataPattern: any;
  defReqVsGeneData=[]
  generatedComparisonData: any []=[]
  generatedShiftLines:any []=[]
  generatedScheduleData:any []=[]
  requiredEmpData:any
  generatedEmpData
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
  defGeneratedData: any;
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
  ReqVsGeneData=[]
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
  longSwipesRatio:0.1,
  initialSlide: 0,
  spaceBetween: 70,

 }
 defrdosArr=[]
 currentShiftlineScheduleShiftDuration=8
 allScheduleShift
 rowCount=0
 checkBidShceduleInProgress=false
 _nextId
 chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
 _chars
 focusSHiftLineScheduleId
 alldefscheduleShift
 allShiftCategory=[1,2,3,4,5,6]
 checkUserAccess=false
 rdosArr=[]
 maximizeCard: boolean = false;
 day_generate:any;
 total_day_generate:any;
 dateset = [{title:'Sun',color:'sat-sun',shift:['SS', 'FSS', 'FSS-A', 'SS-A']}, {title:'Mon',color:'sun-mon',shift:['SM', 'SMS', 'SMS-A', 'SM-A']},{title:'Tue',color:'mon-tue',shift:['MT', 'SMT', 'SMT-A', 'MT-A']}, {title:'Wed',color:'tue-wed',shift:['TW', 'MTW', 'MTW-A', 'TW-A']}, {title:'Thu',color:'wed-thu',shift:['WT', 'TWT', 'TWT-A', 'WT-A','TWTh','TWTh-A','WTh-A','WTh']}, {title:'Fri',color:'thu-fri',shift:['TF', 'WTF', 'WTF-A', 'TF-A','ThF','WThF','WThF-A','ThF-A']}, {title:'Sat',color:'fri-sat',shift:['FS', 'TFS', 'TFS-A', 'FS-A','ThFS','ThFS-A']}, ];
 constructor(public modalCtrl: ModalController,
              private route:Router,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private headerTitleService: HeaderTitleService,
              public navParams: NavParams,
              public navCtrl: NavController,
              private cdref: ChangeDetectorRef,
              private localData: LocalDataService,
              public http: HttpClient,
              public actionsheetCtrl: ActionSheetController,
              public generateScheduleHelper: GenerateScheduleHelper
              ) {

          this.schedule_id=0

  }
  // ngAfterViewInit() {
  //   this.slides.lockSwipes(this.nextslide);

  // }
  user_data
   ngOnInit() {
     if(sessionStorage.getItem('token')!=undefined){
       this.checkUserAccess=true
     }else{
      this.checkUserAccess=false
     }
    this._chars = this.chars;
    this._nextId = [0];
    this.headerTitleService.setTitle('Generated Shiftline Schedule');
    this.headerTitleService.setDefaultHeader(true)
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    if(this.user_data.role=='bidmanager'){

if(straightlines_io_apis.apis.generated_schedule===String(this.route.url).substr(1)){
  this.headerTitleService.setForwardUrl(null);
  this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');
  this.headerTitleService.setBackUrl(straightlines_io_apis.apis.enter_Work_load);
}else{
  this.headerTitleService.setBackUrl(straightlines_io_apis.apis.enter_Work_load_api);
  this.headerTitleService.setForwardUrl(null);
  this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');
}
}else{
  this.headerTitleService.setBackUrl(straightlines_io_apis.apis.guest_enter_Work_load);
  this.headerTitleService.setForwardUrl(null);
  this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');

}

this.exportData=[]
this.customizeShiftData=[]
     this.customizeScheduleShiftLines=[]
this.defGeneratedData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.defRequiredData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.generatedEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.requiredEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
this.alldefscheduleShift=JSON.parse(this.localData.getItem('defaultScheduleShiftLine'))
this.focusShiftLine=JSON.parse(this.localData.getItem('focusShiftLine'))
this.allShiftData=  JSON.parse(this.localData.getItem('allShiftRequiredData'))
this.currentShiftlineScheduleShiftDuration=this.scheduleShift[0][0].shiftdurationp
if(this.scheduleShift.length<2){
   this.one_generated_schedule=true,this.three_generated_schedule=false
   if(this.currentShiftlineScheduleShiftDuration==undefined){
    this.schedule_title=' Schedule Generated !'
   }else{
    this.schedule_title='('+this.currentShiftlineScheduleShiftDuration+'-Hours) Schedule Generated !'
   }

  //  this.slides.lockSwipes(true)
}
if(this.scheduleShift.length>2){
  if(this.currentShiftlineScheduleShiftDuration==undefined){
    this.schedule_title='3 - Possible Schedules Generated !'
   }else{
    this.schedule_title='3 - Possible ('+this.currentShiftlineScheduleShiftDuration+'-Hours) Schedules Generated !'
   }

   this.one_generated_schedule=false,this.three_generated_schedule=true
   if(this.focusShiftLine!=null || this.focusShiftLine!=undefined){
   this.slideOption.initialSlide=this.focusShiftLine.schedule_id

   this.cdref.detectChanges()
  }else{
    this.slideOption.initialSlide=0
     this.cdref.detectChanges()
  }
  this.cdref.detectChanges()
   if(this.focusShiftLine!=null || this.focusShiftLine!=undefined){
        this.focusSHiftLineScheduleId=this.focusShiftLine.schedule_id
        }
        else{
          this.schedule_id=0
        }
        this.cdref.detectChanges()
    }this.generatedShiftlineScheduleData()
   }
   generatedShiftlineScheduleData(){
    this.exportData=[]
    this.customizeShiftData=[]
         this.customizeScheduleShiftLines=[]
         this.defGeneratedData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.defRequiredData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.generatedEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.requiredEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
this.alldefscheduleShift=JSON.parse(this.localData.getItem('defaultScheduleShiftLine'))
this.focusShiftLine=JSON.parse(this.localData.getItem('focusShiftLine'))
this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
this.allScheduleShift=this.scheduleShift
// console.log(this.scheduleShift)
this.schedule_length=this.scheduleShift.length
if(this.focusShiftLine!=null && this.focusShiftLine!='' && this.focusShiftLine!=undefined){
  this.focusSHiftLineScheduleId=this.focusShiftLine.schedule_id
  this.focusShiftLine=this.focusShiftLine.shift_line.id
 }else{
  this.focusShiftLine=''
  this.focusSHiftLineScheduleId=''
 }


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


this.cdref.detectChanges()
this.allShiftName=[]
this.allShiftName.push({"shiftName":'X',"shiftCategory":'X'})
for(var i=0;i<this.allShiftData.length;i++){
  this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shiftTime":this.allShiftData[i].startTime})
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
this.defscheduleShift=this.alldefscheduleShift[this.schedule_id]
this.scheduleShift=this.allScheduleShift[this.schedule_id]
this.totalCount=0;this.countNC=0
this.countSunSat=0;this.countSunMon=0;this.countMonTue=0;this.countTueWed=0;this.countWedThu=0;this.countThuFri=0;this.countFriSat=0;
this.countFSS=0;this.countSMS=0;this.countSMT=0;this.countMTW=0;this.countTWT=0;this.countWTF=0;this.countTFS=0;

for (let i = 0; i <= this.defscheduleShift.length; i++) {
  const shift = this.defscheduleShift[i];

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
  }
}
this.defrdosArr=[]
if(this.currentShiftlineScheduleShiftDuration==8){
  this.defrdosArr=[{'rdo':'SS','count':this.countSunSat,'rdoInfo':'Sat-Sun'},{'rdo':'SM','count':this.countSunMon,'rdoInfo':'Sun-Mon'},{'rdo':'MT','count':this.countMonTue,'rdoInfo':'Mon-Tue'},
  {'rdo':'TW','count':this.countTueWed,'rdoInfo':'Tue-Wed'},{'rdo':'WTh','count':this.countWedThu,'rdoInfo':'Wed-Thu'},{'rdo':'ThF','count':this.countThuFri,'rdoInfo':'Thu-Fri'},{'rdo':'FS','count':this.countFriSat,'rdoInfo':'Fri-Sat'}]
  if(this.countFSS>0){this.defrdosArr.push({'rdo':'FSS','count':this.countFSS,'rdoInfo':'Fri-Sat-Sun'})}
  if(this.countSMS>0){this.defrdosArr.push({'rdo':'SMS','count':this.countSMS,'rdoInfo':'Sun-Mon-Sat'})}
  if(this.countSMT>0){this.defrdosArr.push({'rdo':'SMT','count':this.countSMT,'rdoInfo':'Sun-Mon-Tue'})}
  if(this.countMTW>0){this.defrdosArr.push({'rdo':'MTW','count':this.countMTW,'rdoInfo':'Mon-Tue-Wed'})}
  if(this.countTWT>0){this.defrdosArr.push({'rdo':'TWTh','count':this.countTWT,'rdoInfo':'Tue-Wed-Thu'})}
  if(this.countWTF>0){this.defrdosArr.push({'rdo':'WThF','count':this.countWTF,'rdoInfo':'Wed-Thu-Fri'})}
  if(this.countTFS>0){this.defrdosArr.push({'rdo':'ThFS','count':this.countTFS,'rdoInfo':'Thu-Fri-Sat'})}
  if(this.countNC>0){this.defrdosArr.push({'rdo':'NC','count':this.countNC,'rdoInfo':'NC'})}
}else{
  this.defrdosArr=[{'rdo':'FSS','count':this.countFSS,'rdoInfo':'Fri-Sat-Sun'},{'rdo':'SMS','count':this.countSMS,'rdoInfo':'Sun-Mon-Sat'},{'rdo':'SMT','count':this.countSMT,'rdoInfo':'Sun-Mon-Tue'},{'rdo':'MTW','count':this.countMTW,'rdoInfo':'Mon-Tue-Wed'},
    {'rdo':'TWTh','count':this.countTWT,'rdoInfo':'Tue-Wed-Thu'},{'rdo':'WThF','count':this.countWTF,'rdoInfo':'Wed-Thu-Fri'},{'rdo':'ThFS','count':this.countTFS,'rdoInfo':'Thu-Fri-Sat'}]
    if(this.countSunSat>0){this.defrdosArr.push({'rdo':'SS','count':this.countSunSat,'rdoInfo':'Sat-Sun'})}
    if(this.countSunMon>0){this.defrdosArr.push({'rdo':'SM','count':this.countSunMon,'rdoInfo':'Sun-Mon'})}
    if(this.countMonTue>0){this.defrdosArr.push({'rdo':'MT','count':this.countMonTue,'rdoInfo':'Mon-Tue'})}
    if(this.countTueWed>0){this.defrdosArr.push({'rdo':'TW','count':this.countTueWed,'rdoInfo':'Tue-Wed'})}
    if(this.countWedThu>0){this.defrdosArr.push({'rdo':'WTh','count':this.countWedThu,'rdoInfo':'Wed-Thu'})}
    if(this.countThuFri>0){this.defrdosArr.push({'rdo':'ThF','count':this.countThuFri,'rdoInfo':'Thu-Fri'})}
    if(this.countFriSat>0){this.defrdosArr.push({'rdo':'FS','count':this.countFriSat,'rdoInfo':'Fri-Sat'})}
    if(this.countNC>0){this.defrdosArr.push({'rdo':'NC','count':this.countNC,'rdoInfo':'NC'})}
}

this.totalCount = 0;
this.countNC = 0;
const countDict = {
  'SS': 0, 'SM': 0, 'MT': 0, 'TW': 0, 'WT': 0, 'TF': 0, 'FS': 0,
  'FSS': 0, 'SMS': 0, 'SMT': 0, 'MTW': 0, 'TWT': 0, 'WTF': 0, 'TFS': 0,'TWTh':0,'WThF':0,'ThFS':0,'ThF':0,'WTh':0
};

this.scheduleShift.forEach((shift) => {
  if (shift) {
    const key = shift.SL.replace(/-A$/, ''); // Remove '-A' suffix if it exists

    if (countDict.hasOwnProperty(key)) {
      countDict[key]++;
    } else {
      this.countNC++;
    }
    this.totalCount++;
  }
});

this.countSunSat = countDict['SS'];
this.countSunMon = countDict['SM'];
this.countMonTue = countDict['MT'];
this.countTueWed = countDict['TW'];
this.countWedThu = countDict['WT'];
this.countThuFri = countDict['TF'];
this.countFriSat = countDict['FS'];
this.countFSS = countDict['FSS'];
this.countSMS = countDict['SMS'];
this.countSMT = countDict['SMT'];
this.countMTW = countDict['MTW'];
this.countTWT = countDict['TWT'];
this.countWTF = countDict['WTF'];
this.countTFS = countDict['TFS'];

this.rdosArr=[]
if(this.currentShiftlineScheduleShiftDuration==8){
  this.rdosArr=[{'rdo':'SS','count':this.countSunSat,'rdoInfo':'Sat-Sun'},{'rdo':'SM','count':this.countSunMon,'rdoInfo':'Sun-Mon'},{'rdo':'MT','count':this.countMonTue,'rdoInfo':'Mon-Tue'},
  {'rdo':'TW','count':this.countTueWed,'rdoInfo':'Tue-Wed'},{'rdo':'WTh','count':this.countWedThu,'rdoInfo':'Wed-Thu'},{'rdo':'ThF','count':this.countThuFri,'rdoInfo':'Thu-Fri'},{'rdo':'FS','count':this.countFriSat,'rdoInfo':'Fri-Sat'}]
  if(this.countFSS>0){this.rdosArr.push({'rdo':'FSS','count':this.countFSS,'rdoInfo':'Fri-Sat-Sun'})}
  if(this.countSMS>0){this.rdosArr.push({'rdo':'SMS','count':this.countSMS,'rdoInfo':'Sun-Mon-Sat'})}
  if(this.countSMT>0){this.rdosArr.push({'rdo':'SMT','count':this.countSMT,'rdoInfo':'Sun-Mon-Tue'})}
  if(this.countMTW>0){this.rdosArr.push({'rdo':'MTW','count':this.countMTW,'rdoInfo':'Mon-Tue-Wed'})}
  if(this.countTWT>0){this.rdosArr.push({'rdo':'TWTh','count':this.countTWT,'rdoInfo':'Tue-Wed-Thu'})}
  if(this.countWTF>0){this.rdosArr.push({'rdo':'WThF','count':this.countWTF,'rdoInfo':'Wed-Thu-Fri'})}
  if(this.countTFS>0){this.rdosArr.push({'rdo':'ThFS','count':this.countTFS,'rdoInfo':'Thu-Fri-Sat'})}
  if(this.countNC>0){this.rdosArr.push({'rdo':'NC','count':this.countNC,'rdoInfo':'NC'})}
}else{
  this.rdosArr=[{'rdo':'FSS','count':this.countFSS,'rdoInfo':'Fri-Sat-Sun'},{'rdo':'SMS','count':this.countSMS,'rdoInfo':'Sun-Mon-Sat'},{'rdo':'SMT','count':this.countSMT,'rdoInfo':'Sun-Mon-Tue'},{'rdo':'MTW','count':this.countMTW,'rdoInfo':'Mon-Tue-Wed'},
    {'rdo':'TWTh','count':this.countTWT,'rdoInfo':'Tue-Wed-Thu'},{'rdo':'WThF','count':this.countWTF,'rdoInfo':'Wed-Thu-Fri'},{'rdo':'ThFS','count':this.countTFS,'rdoInfo':'Thu-Fri-Sat'}]
    if(this.countSunSat>0){this.rdosArr.push({'rdo':'SS','count':this.countSunSat,'rdoInfo':'Sat-Sun'})}
    if(this.countSunMon>0){this.rdosArr.push({'rdo':'SM','count':this.countSunMon,'rdoInfo':'Sun-Mon'})}
    if(this.countMonTue>0){this.rdosArr.push({'rdo':'MT','count':this.countMonTue,'rdoInfo':'Mon-Tue'})}
    if(this.countTueWed>0){this.rdosArr.push({'rdo':'TW','count':this.countTueWed,'rdoInfo':'Tue-Wed'})}
    if(this.countWedThu>0){this.rdosArr.push({'rdo':'WTh','count':this.countWedThu,'rdoInfo':'Wed-Thu'})}
    if(this.countThuFri>0){this.rdosArr.push({'rdo':'ThF','count':this.countThuFri,'rdoInfo':'Thu-Fri'})}
    if(this.countFriSat>0){this.rdosArr.push({'rdo':'FS','count':this.countFriSat,'rdoInfo':'Fri-Sat'})}
    if(this.countNC>0){this.rdosArr.push({'rdo':'NC','count':this.countNC,'rdoInfo':'NC'})}
}
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

this.sundAy=[]
this.mondAy=[]
this.tuedAy=[]
this.weddAy=[]
this.thudAy=[]
this.fridAy=[]
this.satdAy=[]
for(var i=0;i<this.scheduleShift.length;i++){

  if(this.scheduleShift[i].Sun!='X' && this.scheduleShift[i].Sun!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.sundAy.push({"shiftName":this.scheduleShift[i].Sun.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.sundAy.push({"shiftName":this.scheduleShift[i].Sun,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Sun,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Sunshift2 !='X' && this.scheduleShift[i].Sunshift2 !='x' && this.scheduleShift[i].Sunshift2 !=null && this.scheduleShift[i].Sunshift2 !='' && this.scheduleShift[i].Sunshift2 !=undefined){
    this.sundAy.push({"shiftName":this.scheduleShift[i].Sunshift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Sunshift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Sunshift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Sunshift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Mon!='X' && this.scheduleShift[i].Mon!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.mondAy.push({"shiftName":this.scheduleShift[i].Mon.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.mondAy.push({"shiftName":this.scheduleShift[i].Mon,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Mon,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Monshift2 !='X' && this.scheduleShift[i].Monshift2 !='x' && this.scheduleShift[i].Monshift2 !=null && this.scheduleShift[i].Monshift2 !='' && this.scheduleShift[i].Monshift2 !=undefined){
    this.mondAy.push({"shiftName":this.scheduleShift[i].Monshift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Monshift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Monshift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Monshift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Tue!='X' && this.scheduleShift[i].Tue!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.tuedAy.push({"shiftName":this.scheduleShift[i].Tue.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.tuedAy.push({"shiftName":this.scheduleShift[i].Tue,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Tue,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Tueshift2 !='X' && this.scheduleShift[i].Tueshift2 !='x' && this.scheduleShift[i].Tueshift2 !=null && this.scheduleShift[i].Tueshift2 !='' && this.scheduleShift[i].Tueshift2 !=undefined){
    this.tuedAy.push({"shiftName":this.scheduleShift[i].Tueshift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Tueshift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Tueshift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Tueshift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Wed!='X' && this.scheduleShift[i].Wed!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.weddAy.push({"shiftName":this.scheduleShift[i].Wed.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.weddAy.push({"shiftName":this.scheduleShift[i].Wed,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Wed,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Wedshift2 !='X' && this.scheduleShift[i].Wedshift2 !='x' && this.scheduleShift[i].Wedshift2 !=null && this.scheduleShift[i].Wedshift2 !='' && this.scheduleShift[i].Wedshift2 !=undefined){
    this.weddAy.push({"shiftName":this.scheduleShift[i].Wedshift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Wedshift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Wedshift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Wedshift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Thu!='X' && this.scheduleShift[i].Thu!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.thudAy.push({"shiftName":this.scheduleShift[i].Thu.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.thudAy.push({"shiftName":this.scheduleShift[i].Thu,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Thu,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Thushift2 !='X' && this.scheduleShift[i].Thushift2 !='x' && this.scheduleShift[i].Thushift2 !=null && this.scheduleShift[i].Thushift2 !='' && this.scheduleShift[i].Thushift2 !=undefined){
    this.thudAy.push({"shiftName":this.scheduleShift[i].Thushift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Thushift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Thushift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Thushift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Fri!='X' && this.scheduleShift[i].Fri!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.fridAy.push({"shiftName":this.scheduleShift[i].Fri.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.fridAy.push({"shiftName":this.scheduleShift[i].Fri,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Fri,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Frishift2 !='X' && this.scheduleShift[i].Frishift2 !='x' && this.scheduleShift[i].Frishift2 !=null && this.scheduleShift[i].Frishift2 !='' && this.scheduleShift[i].Frishift2 !=undefined){
    this.fridAy.push({"shiftName":this.scheduleShift[i].Frishift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Frishift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Frishift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Frishift2,this.scheduleShift[i].shiftdurationc)})
  }
  if(this.scheduleShift[i].Sat!='X' && this.scheduleShift[i].Sat!='x'){
    if(Number(this.scheduleShift[i].shiftdurationc)==9){
      this.satdAy.push({"shiftName":this.scheduleShift[i].Sat.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc)})
    }else{
      this.satdAy.push({"shiftName":this.scheduleShift[i].Sat,"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Sat,this.scheduleShift[i].shiftdurationc)})
    }
  }
  if(this.scheduleShift[i].Satshift2 !='X' && this.scheduleShift[i].Satshift2 !='x' && this.scheduleShift[i].Satshift2 !=null && this.scheduleShift[i].Satshift2 !='' && this.scheduleShift[i].Satshift2 !=undefined){
    this.satdAy.push({"shiftName":this.scheduleShift[i].Satshift2.split('-')[0],"shiftDefintion":this.convertRDOtoShiftDefintion(this.scheduleShift[i].Satshift2,this.scheduleShift[i].shiftdurationc),"shift_duration":this.getShiftDuration(this.scheduleShift[i].Satshift2,this.scheduleShift[i].shiftdurationc),"shiftCategory":this.getShiftCategory(this.scheduleShift[i].Satshift2,this.scheduleShift[i].shiftdurationc)})
  }
}

function getCountsCustomized(dayData) {
  return [...dayData.reduce((r, e) => {
    let k = `${e.shiftDefintion}|${e.shift_duration}`;
    if (!r.has(k)) r.set(k, { ...e, totalEmp: 1 })
    else r.get(k).totalEmp++
    return r;
  }, new Map).values()];
}
var countsCustomizedSunDay = getCountsCustomized(this.sundAy);
var countsCustomizedMonDay = getCountsCustomized(this.mondAy);
var countsCustomizedTueDay = getCountsCustomized(this.tuedAy);
var countsCustomizedWedDay = getCountsCustomized(this.weddAy);
var countsCustomizedThuDay = getCountsCustomized(this.thudAy);
var countsCustomizedFriDay = getCountsCustomized(this.fridAy);
var countsCustomizedSatDay = getCountsCustomized(this.satdAy);

var isFoundSun,isFoundMon,isFoundTue,isFoundWed,isFoundThu,isFoundFri,isFoundSat
for(var j=0;j<this.allShiftData.length;j++){
  for(var i=0;i<countsCustomizedSunDay.length;i++){
    isFoundSun = countsCustomizedSunDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedMonDay.length;i++){
    isFoundMon = countsCustomizedMonDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedTueDay.length;i++){
    isFoundTue = countsCustomizedTueDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedWedDay.length;i++){
    isFoundWed = countsCustomizedWedDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedThuDay.length;i++){
    isFoundThu = countsCustomizedThuDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedFriDay.length;i++){
    isFoundFri = countsCustomizedFriDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  for(var i=0;i<countsCustomizedSatDay.length;i++){
    isFoundSat = countsCustomizedSatDay.some(element => {if (element.shiftDefintion === this.allShiftData[j].startTime && this.allShiftData[j].shift_duration==element.shift_duration) {return true;}});
  }
  if(this.allShiftData[j].shift_duration!=this.currentShiftlineScheduleShiftDuration && isFoundSun==false && isFoundMon==false && isFoundTue==false && isFoundWed==false&&isFoundThu==false&&isFoundFri==false&&isFoundSat==false){

  }else{
  if(isFoundMon==false){countsCustomizedMonDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundTue==false){countsCustomizedTueDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundWed==false){countsCustomizedWedDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundThu==false){countsCustomizedThuDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundSun==false){countsCustomizedSunDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundFri==false){countsCustomizedFriDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  if(isFoundSat==false){countsCustomizedSatDay.push({"shiftName":this.allShiftData[j].shiftName,"shiftDefintion":this.allShiftData[j].startTime,"shift_duration":this.allShiftData[j].shift_duration,"shiftCategory":this.allShiftData[j].shiftCategory,"totalEmp":0})}
  }
}

this.def_sundAy=[]
this.def_mondAy=[]
this.def_tuedAy=[]
this.def_weddAy=[]
this.def_thudAy=[]
this.def_fridAy=[]
this.def_satdAy=[]
for(var i=0;i<this.defscheduleShift.length;i++){
  if(this.defscheduleShift[i].Sun!='X' && this.defscheduleShift[i].Sun!='x'){
    this.def_sundAy.push({"shiftName":this.defscheduleShift[i].Sun,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Sun,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Sun,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Mon!='X' && this.defscheduleShift[i].Mon!='x'){
    this.def_mondAy.push({"shiftName":this.defscheduleShift[i].Mon,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Mon,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Mon,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Tue!='X' && this.defscheduleShift[i].Tue!='x'){
    this.def_tuedAy.push({"shiftName":this.defscheduleShift[i].Tue,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Tue,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Tue,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Wed!='X' && this.defscheduleShift[i].Wed!='x'){
    this.def_weddAy.push({"shiftName":this.defscheduleShift[i].Wed,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Wed,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Wed,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Thu!='X' && this.defscheduleShift[i].Thu!='x'){
    this.def_thudAy.push({"shiftName":this.defscheduleShift[i].Thu,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Thu,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Thu,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Fri!='X' && this.defscheduleShift[i].Fri!='x'){
    this.def_fridAy.push({"shiftName":this.defscheduleShift[i].Fri,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Fri,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Fri,this.defscheduleShift[i].shiftdurationc)})
  }
  if(this.defscheduleShift[i].Sat!='X' && this.defscheduleShift[i].Sat!='x'){
    this.def_satdAy.push({"shiftName":this.defscheduleShift[i].Sat,"shiftDefintion":this.convertRDOtoShiftDefintion(this.defscheduleShift[i].Sat,this.defscheduleShift[i].shiftdurationc),"shift_duration":this.defscheduleShift[i].shiftdurationc,"shiftCategory":this.getShiftCategory(this.defscheduleShift[i].Sat,this.defscheduleShift[i].shiftdurationc)})
  }
}
var countsCustomizedDefSunDay = getCountsCustomized(this.def_sundAy);
var countsCustomizedDefMonDay = getCountsCustomized(this.def_mondAy);
var countsCustomizedDefTueDay = getCountsCustomized(this.def_tuedAy);
var countsCustomizedDefWedDay = getCountsCustomized(this.def_weddAy);
var countsCustomizedDefThuDay = getCountsCustomized(this.def_thudAy);
var countsCustomizedDefFriDay = getCountsCustomized(this.def_fridAy);
var countsCustomizedDefSatDay = getCountsCustomized(this.def_satdAy);
const dayCounts = [
  countsCustomizedDefSunDay,
  countsCustomizedDefMonDay,
  countsCustomizedDefTueDay,
  countsCustomizedDefWedDay,
  countsCustomizedDefThuDay,
  countsCustomizedDefFriDay,
  countsCustomizedDefSatDay
];

const isShiftFound = (shiftData, dayCount) => {
  return dayCount.some(element => {
    return element.shiftDefintion === shiftData.startTime && shiftData.shift_duration === element.shift_duration;
  });
};

for (let j = 0; j < this.allShiftData.length; j++) {
  const shift = this.allShiftData[j];
  let isFound = dayCounts.map(dayCount => isShiftFound(shift, dayCount));

  if (shift.shift_duration === this.currentShiftlineScheduleShiftDuration || isFound.includes(false)) {
    isFound.forEach((found, index) => {
      if (!found) {
        dayCounts[index].push({
          "shiftName": shift.shiftName,
          "shiftDefintion": shift.startTime,
          "shift_duration": shift.shift_duration,
          "shiftCategory": shift.shiftCategory,
          "totalEmp": 0
        });
      }
    });
  }
}

const weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const shiftCategories = {
  '1': 'mid',
  '3': 'day',
  '2': 'eve',
  '4': 'mid_day',
  '5': 'day_eve',
  '6': 'eve_mid'
};

for (const day of weeks) {
  for (const key in shiftCategories) {
    this[`def_${day}_${shiftCategories[key]}`] = 0;
    this[`${day}_${shiftCategories[key]}`]=0;
  }
}

function processCounts(counts,week) {
  const results = {};

  for (const count of counts) {
    const key =week+'_'+ shiftCategories[count.shiftCategory];
    if (!results[key]) {
      results[key] = 0;
    }
    results[key] += +count.totalEmp;
  }

  return results;
}

Object.assign(this, 
  processCounts(countsCustomizedDefSunDay,'def_sun'), processCounts(countsCustomizedDefMonDay,'def_mon'), processCounts(countsCustomizedDefTueDay,'def_tue'), processCounts(countsCustomizedDefWedDay,'def_wed'), processCounts(countsCustomizedDefThuDay,'def_thu'), processCounts(countsCustomizedDefFriDay,'def_fri'), processCounts(countsCustomizedDefSatDay,'def_sat'),
  processCounts(countsCustomizedSunDay,'sun'), processCounts(countsCustomizedMonDay,'mon'), processCounts(countsCustomizedTueDay,'tue'), processCounts(countsCustomizedWedDay,'wed'), processCounts(countsCustomizedThuDay,'thu'), processCounts(countsCustomizedFriDay,'fri'), processCounts(countsCustomizedSatDay,'sat'));
console.log('this.sun_day' ,this.sun_day)
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
  const required = daySuffixes.map(suffix => this.requiredEmpData[day+suffix]);
  const defGenerated = daySuffixes.map(suffix => this.defGeneratedData[day + suffix]);
  const defRequired = daySuffixes.map(suffix => this.defRequiredData[day + suffix]);
  const upperDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  this[upperDay + 'DayGenerated'] = generated;
  this[upperDay + 'DayRequired'] = required;
  
  this['total' + upperDay + 'Generated'] = generated.reduce((acc, curr) => acc + curr, 0);
  this['total' + upperDay + 'Required'] = required.reduce((acc, curr) => acc + curr, 0);
  const id = [0,3,1,4,2,5]
  this.day_generate.push({title:this[upperDay+'DayGenerated'],require: this[upperDay + 'DayRequired'],data:[],id});
  this['default' + upperDay + 'DayRequired'] = defRequired;
  this['default' + upperDay + 'DayGenerated'] = defGenerated;
  this['defaultTotal' + upperDay + 'Generated'] = defGenerated.reduce((acc, curr) => acc + curr, 0);
  this['defaultTotal' + upperDay + 'Required'] = defRequired.reduce((acc, curr) => acc + curr, 0);
  var temp:any = [];
  suffWithoutUnderline.forEach((suff,index) => {
    this['diff'+upperDay+suff] = this[upperDay + 'DayGenerated'][index] - this[ upperDay + 'DayRequired'][index]
    temp.push(this['diff'+upperDay+suff]);
  });
  var temp1 = []
  id.forEach((item,i) => {
    temp1[i]=temp[`${item}`];
  })
  this.day_generate[index].data = temp1;
  this['total'+upperDay+'diff'] =  this['total' + upperDay + 'Generated']-this['total' + upperDay + 'Required'];
  this.total_day_generate.push({require:this['total'+upperDay+'Required'],total:this['total' + upperDay + 'Generated'],diff:this['total'+upperDay+'diff']});
});


this.reqData=[]
for(var i=0;i<this.allShiftData.length;i++){
  this.req_shift_1_data={"shiftTime":this.allShiftData[i].startTime,"sun":this.allShiftData[i].Sun,"mon":this.allShiftData[i].Mon,"tue":this.allShiftData[i].Tue,"wed":this.allShiftData[i].Wed,"thu":this.allShiftData[i].Thu,"fri":this.allShiftData[i].Fri,"sat":this.allShiftData[i].Sat}
  this.reqData.push(this.req_shift_1_data)
}

this.reqvsgenDataShiftTime=[];this.reqvsgenDataSun=[];this.reqvsgenDataMon=[];this.reqvsgenDataTue=[];this.reqvsgenDataWed=[];this.reqvsgenDataThu=[];this.reqvsgenDataFri=[];this.reqvsgenDataSat=[];
this.reqvsgenDataShiftTime.push({"shift_start":"Shifts","shift_length":"Duration","shift_name":"Shift Name"})
// this.reqvsgenDataShiftTime.push("Shifts")
this.reqvsgenDataSun.push("Sun")
this.reqvsgenDataMon.push("Mon")
this.reqvsgenDataTue.push("Tue")
this.reqvsgenDataWed.push("Wed")
this.reqvsgenDataThu.push("Thu")
this.reqvsgenDataFri.push("Fri")
this.reqvsgenDataSat.push("Sat")
function processShiftData(shiftData) {
  let r = [], r1 = [];

  shiftData.forEach((e) => {
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

countsCustomizedSunDay = processShiftData(countsCustomizedSunDay);
countsCustomizedMonDay = processShiftData(countsCustomizedMonDay);
countsCustomizedTueDay = processShiftData(countsCustomizedTueDay);
countsCustomizedWedDay = processShiftData(countsCustomizedWedDay);
countsCustomizedThuDay = processShiftData(countsCustomizedThuDay);
countsCustomizedFriDay = processShiftData(countsCustomizedFriDay);
countsCustomizedSatDay = processShiftData(countsCustomizedSatDay);
      for(var i=0;i<this.allShiftData.length;i++){

        for(var j=0;j<countsCustomizedSunDay.length;j++){
          if(Number(this.allShiftData[i].startTime)===Number(countsCustomizedSunDay[j].shiftDefintion) && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
          this.reqvsgenDataShiftTime.push({"shift_start":String(this.allShiftData[i].startTime),"shift_length":String(this.allShiftData[i].shift_duration),"shift_name":String(this.allShiftData[i].shiftName)})
          }
        }
      for(var j=0;j<countsCustomizedSunDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedSunDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
          if(Number(countsCustomizedSunDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataSun.push(0+ '/' + Number(countsCustomizedSunDay[j].totalEmp))
          }else{
            this.reqvsgenDataSun.push(Number(this.allShiftData[i].Sun)+ '/' + Number(countsCustomizedSunDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedMonDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedMonDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedMonDay[j].shift_duration)){
          if(Number(countsCustomizedMonDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataMon.push(0+ '/' + Number(countsCustomizedMonDay[j].totalEmp))
          }else{
            this.reqvsgenDataMon.push(Number(this.allShiftData[i].Mon)+ '/' + Number(countsCustomizedMonDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedTueDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedTueDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedTueDay[j].shift_duration)){
          if(Number(countsCustomizedTueDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataTue.push(0+ '/' + Number(countsCustomizedTueDay[j].totalEmp))
          }else{
            this.reqvsgenDataTue.push(Number(this.allShiftData[i].Tue)+ '/' + Number(countsCustomizedTueDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedWedDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedWedDay[j].shiftDefintion&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedWedDay[j].shift_duration)){
          if(Number(countsCustomizedWedDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataWed.push(0+ '/' + Number(countsCustomizedWedDay[j].totalEmp))
          }else{
            this.reqvsgenDataWed.push(Number(this.allShiftData[i].Wed)+ '/' + Number(countsCustomizedWedDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedThuDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedThuDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedThuDay[j].shift_duration)){
          if(Number(countsCustomizedThuDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataThu.push(0+ '/' + Number(countsCustomizedThuDay[j].totalEmp))
          }else{
            this.reqvsgenDataThu.push(Number(this.allShiftData[i].Thu)+ '/' + Number(countsCustomizedThuDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedFriDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedFriDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedFriDay[j].shift_duration)){
          if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataFri.push(0+ '/' + Number(countsCustomizedFriDay[j].totalEmp))
          }else{
            this.reqvsgenDataFri.push(Number(this.allShiftData[i].Fri)+ '/' + Number(countsCustomizedFriDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedSatDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedSatDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSatDay[j].shift_duration)){
          if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataSat.push(0+ '/' + Number(countsCustomizedSatDay[j].totalEmp))
          }else{
            this.reqvsgenDataSat.push(Number(this.allShiftData[i].Sat)+ '/' + Number(countsCustomizedSatDay[j].totalEmp))
          }
        }
      }
    }


    this.reqvsgenDefDataShiftTime=[];this.reqvsgenDefDataSun=[];this.reqvsgenDefDataMon=[];this.reqvsgenDefDataTue=[];this.reqvsgenDefDataWed=[];this.reqvsgenDefDataThu=[];this.reqvsgenDefDataFri=[];this.reqvsgenDefDataSat=[];
    this.reqvsgenDefDataShiftTime.push({"shift_start":"Shifts","shift_length":"Duration","shift_name":"Shift Name"})
    this.reqvsgenDefDataSun.push("Sun");this.reqvsgenDefDataMon.push("Mon");this.reqvsgenDefDataTue.push("Tue");this.reqvsgenDefDataWed.push("Wed");this.reqvsgenDefDataThu.push("Thu");this.reqvsgenDefDataFri.push("Fri");this.reqvsgenDefDataSat.push("Sat");
    countsCustomizedDefSunDay = processShiftData(countsCustomizedDefSunDay);
    countsCustomizedDefMonDay = processShiftData(countsCustomizedDefMonDay);
    countsCustomizedDefTueDay = processShiftData(countsCustomizedDefTueDay);
    countsCustomizedDefWedDay = processShiftData(countsCustomizedDefWedDay);
    countsCustomizedDefThuDay = processShiftData(countsCustomizedDefThuDay);
    countsCustomizedDefFriDay = processShiftData(countsCustomizedDefFriDay);
    countsCustomizedDefSatDay = processShiftData(countsCustomizedDefSatDay);
      for(var i=0;i<this.allShiftData.length;i++){

        for(var j=0;j<countsCustomizedDefSunDay.length;j++){
          if(Number(this.allShiftData[i].startTime)===Number(countsCustomizedDefSunDay[j].shiftDefintion) && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefSunDay[j].shift_duration)){
          this.reqvsgenDefDataShiftTime.push({"shift_start":String(this.allShiftData[i].startTime),"shift_length":String(this.allShiftData[i].shift_duration),"shift_name":String(this.allShiftData[i].shiftName)})
          }
        }
      for(var j=0;j<countsCustomizedDefSunDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefSunDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefSunDay[j].shift_duration)){
          if(Number(countsCustomizedDefSunDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataSun.push(0+ '/' + Number(countsCustomizedDefSunDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataSun.push(Number(this.allShiftData[i].Sun)+ '/' + Number(countsCustomizedDefSunDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefMonDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefMonDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefMonDay[j].shift_duration)){
          if(Number(countsCustomizedDefMonDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataMon.push(0+ '/' + Number(countsCustomizedDefMonDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataMon.push(Number(this.allShiftData[i].Mon)+ '/' + Number(countsCustomizedDefMonDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefTueDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefTueDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefTueDay[j].shift_duration)){
          if(Number(countsCustomizedDefTueDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataTue.push(0+ '/' + Number(countsCustomizedDefTueDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataTue.push(Number(this.allShiftData[i].Tue)+ '/' + Number(countsCustomizedDefTueDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefWedDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefWedDay[j].shiftDefintion&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefWedDay[j].shift_duration)){
          if(Number(countsCustomizedDefWedDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataWed.push(0+ '/' + Number(countsCustomizedDefWedDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataWed.push(Number(this.allShiftData[i].Wed)+ '/' + Number(countsCustomizedDefWedDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefThuDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefThuDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefThuDay[j].shift_duration)){
          if(Number(countsCustomizedDefThuDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataThu.push(0+ '/' + Number(countsCustomizedDefThuDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataThu.push(Number(this.allShiftData[i].Thu)+ '/' + Number(countsCustomizedDefThuDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefFriDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefFriDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefFriDay[j].shift_duration)){
          if(Number(countsCustomizedDefFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataFri.push(0+ '/' + Number(countsCustomizedDefFriDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataFri.push(Number(this.allShiftData[i].Fri)+ '/' + Number(countsCustomizedDefFriDay[j].totalEmp))
          }
        }
      }
      for(var j=0;j<countsCustomizedDefSatDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedDefSatDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedDefSatDay[j].shift_duration)){
          if(Number(countsCustomizedDefFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDefDataSat.push(0+ '/' + Number(countsCustomizedDefSatDay[j].totalEmp))
          }else{
            this.reqvsgenDefDataSat.push(Number(this.allShiftData[i].Sat)+ '/' + Number(countsCustomizedDefSatDay[j].totalEmp))
          }
        }
      }
    }

    this.ReqVsGeneData=[]
      this.ReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
      this.ReqVsGeneData.push(["MID",this.requiredEmpData.SUN_MID+'/'+this.generatedEmpData.SUN_MID,this.requiredEmpData.MON_MID+'/'+this.generatedEmpData.MON_MID,this.requiredEmpData.TUE_MID+'/'+this.generatedEmpData.TUE_MID,this.requiredEmpData.WED_MID+'/'+this.generatedEmpData.WED_MID,this.requiredEmpData.THU_MID+'/'+this.generatedEmpData.THU_MID,this.requiredEmpData.FRI_MID+'/'+this.generatedEmpData.FRI_MID,this.requiredEmpData.SAT_MID+'/'+this.generatedEmpData.SAT_MID])
      this.ReqVsGeneData.push(["DAY",this.requiredEmpData.SUN_DAY+'/'+this.generatedEmpData.SUN_DAY,this.requiredEmpData.MON_DAY+'/'+this.generatedEmpData.MON_DAY,this.requiredEmpData.TUE_DAY+'/'+this.generatedEmpData.TUE_DAY,this.requiredEmpData.WED_DAY+'/'+this.generatedEmpData.WED_DAY,this.requiredEmpData.THU_DAY+'/'+this.generatedEmpData.THU_DAY,this.requiredEmpData.FRI_DAY+'/'+this.generatedEmpData.FRI_DAY,this.requiredEmpData.SAT_DAY+'/'+this.generatedEmpData.SAT_DAY])
      this.ReqVsGeneData.push(["EVE",this.requiredEmpData.SUN_EVE+'/'+this.generatedEmpData.SUN_EVE,this.requiredEmpData.MON_EVE+'/'+this.generatedEmpData.MON_EVE,this.requiredEmpData.TUE_EVE+'/'+this.generatedEmpData.TUE_EVE,this.requiredEmpData.WED_EVE+'/'+this.generatedEmpData.WED_EVE,this.requiredEmpData.THU_EVE+'/'+this.generatedEmpData.THU_EVE,this.requiredEmpData.FRI_EVE+'/'+this.generatedEmpData.FRI_EVE,this.requiredEmpData.SAT_EVE+'/'+this.generatedEmpData.SAT_EVE])
      this.ReqVsGeneData.push(["MID-DAY",this.requiredEmpData.SUN_MID_DAY+'/'+this.generatedEmpData.SUN_MID_DAY,this.requiredEmpData.MON_MID_DAY+'/'+this.generatedEmpData.MON_MID_DAY,this.requiredEmpData.TUE_MID_DAY+'/'+this.generatedEmpData.TUE_MID_DAY,this.requiredEmpData.WED_MID_DAY+'/'+this.generatedEmpData.WED_MID_DAY,this.requiredEmpData.THU_MID_DAY+'/'+this.generatedEmpData.THU_MID_DAY,this.requiredEmpData.FRI_MID_DAY+'/'+this.generatedEmpData.FRI_MID_DAY,this.requiredEmpData.SAT_MID_DAY+'/'+this.generatedEmpData.SAT_MID_DAY])
      this.ReqVsGeneData.push(["DAY-EVE",this.requiredEmpData.SUN_DAY_EVE+'/'+this.generatedEmpData.SUN_DAY_EVE,this.requiredEmpData.MON_DAY_EVE+'/'+this.generatedEmpData.MON_DAY_EVE,this.requiredEmpData.TUE_DAY_EVE+'/'+this.generatedEmpData.TUE_DAY_EVE,this.requiredEmpData.WED_DAY_EVE+'/'+this.generatedEmpData.WED_DAY_EVE,this.requiredEmpData.THU_DAY_EVE+'/'+this.generatedEmpData.THU_DAY_EVE,this.requiredEmpData.FRI_DAY_EVE+'/'+this.generatedEmpData.FRI_DAY_EVE,this.requiredEmpData.SAT_DAY_EVE+'/'+this.generatedEmpData.SAT_DAY_EVE])
      this.ReqVsGeneData.push(["EVE-MID",this.requiredEmpData.SUN_EVE_MID+'/'+this.generatedEmpData.SUN_EVE_MID,this.requiredEmpData.MON_EVE_MID+'/'+this.generatedEmpData.MON_EVE_MID,this.requiredEmpData.TUE_EVE_MID+'/'+this.generatedEmpData.TUE_EVE_MID,this.requiredEmpData.WED_EVE_MID+'/'+this.generatedEmpData.WED_EVE_MID,this.requiredEmpData.THU_EVE_MID+'/'+this.generatedEmpData.THU_EVE_MID,this.requiredEmpData.FRI_EVE_MID+'/'+this.generatedEmpData.FRI_EVE_MID,this.requiredEmpData.SAT_EVE_MID+'/'+this.generatedEmpData.SAT_EVE_MID])
      this.ReqVsGeneData.push(["",this.totalSunRequired+'/'+ this.totalSunGenerated,this.totalMonRequired+'/'+ this.totalMonGenerated,this.totalTueRequired+'/'+ this.totalTueGenerated,this.totalWedRequired+'/'+ this.totalWedGenerated,this.totalThuRequired+'/'+ this.totalThuGenerated,this.totalFriRequired+'/'+ this.totalFriGenerated,this.totalSatRequired+'/'+ this.totalSatGenerated])
      this.defReqVsGeneData=[]
      this.defReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
      this.defReqVsGeneData.push(["MID",this.defRequiredData.SUN_MID+'/'+this.defGeneratedData.SUN_MID,this.defRequiredData.MON_MID+'/'+this.defGeneratedData.MON_MID,this.defRequiredData.TUE_MID+'/'+this.defGeneratedData.TUE_MID,this.defRequiredData.WED_MID+'/'+this.defGeneratedData.WED_MID,this.defRequiredData.THU_MID+'/'+this.defGeneratedData.THU_MID,this.defRequiredData.FRI_MID+'/'+this.defGeneratedData.FRI_MID,this.defRequiredData.SAT_MID+'/'+this.defGeneratedData.SAT_MID])
      this.defReqVsGeneData.push(["DAY",this.defRequiredData.SUN_DAY+'/'+this.defGeneratedData.SUN_DAY,this.defRequiredData.MON_DAY+'/'+this.defGeneratedData.MON_DAY,this.defRequiredData.TUE_DAY+'/'+this.defGeneratedData.TUE_DAY,this.defRequiredData.WED_DAY+'/'+this.defGeneratedData.WED_DAY,this.defRequiredData.THU_DAY+'/'+this.defGeneratedData.THU_DAY,this.defRequiredData.FRI_DAY+'/'+this.defGeneratedData.FRI_DAY,this.defRequiredData.SAT_DAY+'/'+this.defGeneratedData.SAT_DAY])
      this.defReqVsGeneData.push(["EVE",this.defRequiredData.SUN_EVE+'/'+this.defGeneratedData.SUN_EVE,this.defRequiredData.MON_EVE+'/'+this.defGeneratedData.MON_EVE,this.defRequiredData.TUE_EVE+'/'+this.defGeneratedData.TUE_EVE,this.defRequiredData.WED_EVE+'/'+this.defGeneratedData.WED_EVE,this.defRequiredData.THU_EVE+'/'+this.defGeneratedData.THU_EVE,this.defRequiredData.FRI_EVE+'/'+this.defGeneratedData.FRI_EVE,this.defRequiredData.SAT_EVE+'/'+this.defGeneratedData.SAT_EVE])
      this.defReqVsGeneData.push(["MID-DAY",this.defRequiredData.SUN_MID_DAY+'/'+this.defGeneratedData.SUN_MID_DAY,this.defRequiredData.MON_MID_DAY+'/'+this.defGeneratedData.MON_MID_DAY,this.defRequiredData.TUE_MID_DAY+'/'+this.defGeneratedData.TUE_MID_DAY,this.defRequiredData.WED_MID_DAY+'/'+this.defGeneratedData.WED_MID_DAY,this.defRequiredData.THU_MID_DAY+'/'+this.defGeneratedData.THU_MID_DAY,this.defRequiredData.FRI_MID_DAY+'/'+this.defGeneratedData.FRI_MID_DAY,this.defRequiredData.SAT_MID_DAY+'/'+this.defGeneratedData.SAT_MID_DAY])
      this.defReqVsGeneData.push(["DAY-EVE",this.defRequiredData.SUN_DAY_EVE+'/'+this.defGeneratedData.SUN_DAY_EVE,this.defRequiredData.MON_DAY_EVE+'/'+this.defGeneratedData.MON_DAY_EVE,this.defRequiredData.TUE_DAY_EVE+'/'+this.defGeneratedData.TUE_DAY_EVE,this.defRequiredData.WED_DAY_EVE+'/'+this.defGeneratedData.WED_DAY_EVE,this.defRequiredData.THU_DAY_EVE+'/'+this.defGeneratedData.THU_DAY_EVE,this.defRequiredData.FRI_DAY_EVE+'/'+this.defGeneratedData.FRI_DAY_EVE,this.defRequiredData.SAT_DAY_EVE+'/'+this.defGeneratedData.SAT_DAY_EVE])
      this.defReqVsGeneData.push(["EVE-MID",this.defRequiredData.SUN_EVE_MID+'/'+this.defGeneratedData.SUN_EVE_MID,this.defRequiredData.MON_EVE_MID+'/'+this.defGeneratedData.MON_EVE_MID,this.defRequiredData.TUE_EVE_MID+'/'+this.defGeneratedData.TUE_EVE_MID,this.defRequiredData.WED_EVE_MID+'/'+this.defGeneratedData.WED_EVE_MID,this.defRequiredData.THU_EVE_MID+'/'+this.defGeneratedData.THU_EVE_MID,this.defRequiredData.FRI_EVE_MID+'/'+this.defGeneratedData.FRI_EVE_MID,this.defRequiredData.SAT_EVE_MID+'/'+this.defGeneratedData.SAT_EVE_MID])
      this.defReqVsGeneData.push(["",this.defaultTotalSunRequired+'/'+ this.defaultTotalSunGenerated,this.defaultTotalMonRequired+'/'+ this.defaultTotalMonGenerated,this.defaultTotalTueRequired+'/'+ this.defaultTotalTueGenerated,this.defaultTotalWedRequired+'/'+ this.defaultTotalWedGenerated,this.defaultTotalThuRequired+'/'+ this.defaultTotalThuGenerated,this.defaultTotalFriRequired+'/'+ this.defaultTotalFriGenerated,this.defaultTotalSatRequired+'/'+ this.defaultTotalSatGenerated])

          this.totalDefaultScheduleLine=i

        this.totalShiftLine=String(this.defscheduleShift.length)
        this.totalCustomizeShiftLine=this.scheduleShift.length
        this.required_title={"Required Workforce":"Required Workforce"}
        this.generated_title={'System Generated Workforce':'System Generated Workforc'}
        this.required_vs_generated_title={"Required vs System Generated Workforce":"Required vs System Generated Workforce"}

        this.defaultScheduleShift.push(this.totalShiftLine)

        return this.totalCount,this.countSunSat,this.countSunMon,this.countMonTue,this.countTueWed,this.countWedThu,this.countThuFri,this.countFriSat,this.SunSat,this.SunMon,this.MonTue,this.TueWed,this.WedThu,this.ThuFri,this.FriSat


  }
  goBack(){
    this.navCtrl.navigateBack([straightlines_io_apis.apis.enter_Work_load_api])
  }
  convertRDOtoShiftDefintion(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{
      for(var i=0;i<this.allShiftData.length;i++){
        if(Number(shiftlength)==9){
          if(String(this.allShiftData[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(this.allShiftData[i].shift_duration)){
            return String(this.allShiftData[i].startTime)
          }
        }
        else{
          if((String(this.allShiftData[i].shiftName)==String(rdo) || String(this.allShiftData[i].shiftName)== (String(rdo) + 't') ) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
            return String(this.allShiftData[i].startTime)
          }
        }
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


  async saveInDataBase(){
    const modal = await this.modalCtrl.create({
      component: SaveScheduleComponent,
      cssClass: 'saveSchedule',
      componentProps: { saveSchedule:this.scheduleShift,schedule:[]},
      swipeToClose:true
    });
    return await modal.present();
  }
    async addNewShiftLine(){
      const modal = await this.modalCtrl.create({
        component: AddNewShiftLinePage,
        cssClass: 'addNewShiftLine',
        swipeToClose:true,
       componentProps: { schedule_id:this.schedule_id }

      });
      modal.onDidDismiss().then(()=>{
        this.generatedShiftlineScheduleData()
      })
      // // this.scheduleShift=EditScheduleDataPage.data5
      //
      return await modal.present();

    }
    async midShiftsDetails(){
      const modal = await this.modalCtrl.create({
        component: ViewTotalMidShiftLinesDataPage,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { schedule_id:this.schedule_id }

      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }

    async dayShiftsDetails(){
      const modal = await this.modalCtrl.create({
        component: ViewTotalDayShiftLinesDataPage,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { schedule_id:this.schedule_id }
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }

    async eveShiftsDetails(){
      const modal = await this.modalCtrl.create({
        component: ViewTotalEveShiftLinesDataPage,
        cssClass: 'viewShiftData',
        swipeToClose:true,
        componentProps: { schedule_id:this.schedule_id }
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }
    async daySummary(day_summary){

      const modal = await this.modalCtrl.create({
        component: ViewSummaryDayCategoryWisePage,
        componentProps: { days: day_summary,schedule_id:this.schedule_id },
        cssClass: 'daySummaryData',
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
    change(){
      // IonSlides.

      // if(   this.schedule_title=='Schedule Generated !'){
      //   this.slides.lockSwipes(true)
      // }else{
      this.slides.getActiveIndex().then(index => {

        this.schedule_id=index
        this.cdref.detectChanges()
        this.generatedShiftlineScheduleData()
    })}
    // }
    checkDisablepopup=false
myFunction() {
  this.checkDisablepopup=false
  if(this.checkDisablepopup==false){
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
    if(popupshowsummaryInfo.classList.contains("showsummaryInfo")==true){
      popupshowsummaryInfo.classList.toggle("showsummaryInfo");
    }
    if(this.oldrdoIndex!=undefined){
      var popup = document.getElementById("popupRdo"+this.oldrdoIndex);
      if(popup.classList.contains("showrdo")==true){
        popup.classList.toggle("showrdo");
      }
      this.oldrdoIndex=undefined
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
  }
  this.checkDisablepopup=true
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
    var popupshowsummaryInfo = document.getElementById("myPopupsummaryInfo");
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
async edit(scheduleShift) {

      const modal = await this.modalCtrl.create({
        component: EditScheduleDataPage,
        cssClass: 'editSchedule',
        componentProps: { scheduleData: scheduleShift ,schedule_id:this.schedule_id},
        swipeToClose:true
      })
      modal.onDidDismiss().then(()=>{
        this.generatedShiftlineScheduleData()
      })

      return await modal.present();

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
    expandlistSlide(i, id, j, l,index) {
      const temp = i + j;
      const tempArray = Array.from(temp);
      const tempLength = tempArray.length;
      const isFocused = (Number(this.focusShiftLine) + 1) === id && index === this.focusSHiftLineScheduleId;
      const hasW = tempArray[0] === 'W' || tempArray[1] === 'W' || tempArray[2] === 'W';
    
      let className = 'ion-text-center ion-no-padding ion-no-margin font-size';
    
      if (isFocused) {
        className = 'title-background-color ' + className;
      }
    
      if (tempLength >= 4 && tempLength <= 7 && hasW && !isFocused) {
        return className;
      }
    
      if (tempLength < 8 || isFocused) {
        return className;
      }
    
      return className;
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

  shiftline_schedule_name="new shiftline schedule"

  async export() {
    let loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner:'bubbles',
      message: 'Please Wait...',
      duration: 10000,

    });
    await loading.present();
    await this.generateScheduleHelper.export(
      this.allShiftData,
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
      this.fileName,true
    )
    this.modalCtrl.dismiss()
    await loading.dismiss();
  }

  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
  getColorClass(shift: string): string {
    const entry = this.dateset.find(item => item.shift.some(s => this.matchShift(s, shift)));
    return entry ? `colors-${entry.color}` : 'colors-nc-rdos';
  }
  
  matchShift(shiftPattern: string, shift: string): boolean {
    return shiftPattern ==shift;
  }
}
