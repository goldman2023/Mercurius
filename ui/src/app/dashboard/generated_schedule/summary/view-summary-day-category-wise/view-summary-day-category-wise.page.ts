import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, LoadingController, PopoverController, NavController, NavParams, ActionSheetController } from '@ionic/angular';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { HeaderTitleForModalPageService } from 'src/app/dashboard/nav-bar-footer/header-title-for-modal-page.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { RequiredWorkforceService } from 'src/app/services/required-workforce.service';
import { ScheduleDataService } from 'src/app/services/schedule-data.service';
import { FullscreenChartPage } from './fullscreen-chart/fullscreen-chart.page';



@Component({
  selector: 'app-view-summary-day-category-wise',
  templateUrl: './view-summary-day-category-wise.page.html',
  styleUrls: ['./view-summary-day-category-wise.page.scss'],
})
export class ViewSummaryDayCategoryWisePage implements OnInit {

  currentShiftlineScheduleShiftDuration=8
hideChart=false
hide_chart_and_plot=false
  result1:any=[];
  result2:any=[];
  gData:any=[]
  totalShiftLine:any=[]
  ishidden = true;
  countSunSat=0;countSunMon=0;countMonTue=0;countTueWed=0;countWedThu=0;countThuFri=0;countFriSat=0;
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


  exportData=[] as any
  exportScheduleData=[] as any
  sunDay=[] as any
  defscheduleShift: any;
  sundAy= [] as any;mondAy= [] as any;tuedAy= [] as any;weddAy= [] as any;thudAy= [] as any;fridAy= [] as any;satdAy= [] as any;
  def_sundAy= [] as any;def_mondAy= [] as any;def_tuedAy= [] as any;def_weddAy= [] as any;def_thudAy= [] as any;def_fridAy= [] as any;def_satdAy= [] as any;
  req: number=0;
  mon_1=0;mon_2=0;mon_3=0;mon_4=0;mon_5=0;
  tue_1=0;tue_2=0;tue_3=0;tue_4=0;tue_5=0;
  wed_1=0;wed_2=0;wed_3=0;wed_4=0;wed_5=0;
  thu_1=0;thu_2=0;thu_3=0;thu_4=0;thu_5=0;
  fri_1=0;fri_2=0;fri_3=0;fri_4=0;fri_5=0;
  sat_1=0;sat_2=0;sat_3=0;sat_4=0;sat_5=0;
  sun_1=0;sun_2=0;sun_3=0;sun_4=0;sun_5=0;
  def_mon_1=0;def_mon_2=0;def_mon_3=0;def_mon_4=0;def_mon_5=0;
  def_tue_1=0;def_tue_2=0;def_tue_3=0;def_tue_4=0;def_tue_5=0;
  def_wed_1=0;def_wed_2=0;def_wed_3=0;def_wed_4=0;def_wed_5=0;
  def_thu_1=0;def_thu_2=0;def_thu_3=0;def_thu_4=0;def_thu_5=0;
  def_fri_1=0;def_fri_2=0;def_fri_3=0;def_fri_4=0;def_fri_5=0;
  def_sat_1=0;def_sat_2=0;def_sat_3=0;def_sat_4=0;def_sat_5=0;
  def_sun_1=0;def_sun_2=0;def_sun_3=0;def_sun_4=0;def_sun_5=0;
  sun_mid: number=0;sun_day: number=0;sun_eve: number=0;
  mon_mid: number=0;mon_day: number=0;mon_eve: number=0;
  tue_mid: number=0;tue_day: number=0;tue_eve: number=0;
  wed_mid: number=0;wed_day: number=0;wed_eve: number=0;
  thu_mid: number=0;thu_day: number=0;thu_eve: number=0;
  fri_mid: number=0;fri_day: number=0;fri_eve: number=0;
  sat_mid: number=0;sat_day: number=0;sat_eve: number=0;
  sun_mid_day: number=0;sun_day_eve: number=0;sun_eve_mid: number=0;
  mon_mid_day: number=0;mon_day_eve: number=0;mon_eve_mid: number=0;
  tue_mid_day: number=0;tue_day_eve: number=0;tue_eve_mid: number=0;
  wed_mid_day: number=0;wed_day_eve: number=0;wed_eve_mid: number=0;
  thu_mid_day: number=0;thu_day_eve: number=0;thu_eve_mid: number=0;
  fri_mid_day: number=0;fri_day_eve: number=0;fri_eve_mid: number=0;
  sat_mid_day: number=0;sat_day_eve: number=0;sat_eve_mid: number=0;

  workLoadData: any;
  shift: any;
  defRequiredData: any;
  defGeneratedData: any;
  ReqVsGeneTotalData;ReqVsGeneMidData: any;ReqVsGeneDayData: any;ReqVsGeneEveData: any;dayTitleforExcel:any;
  req_shift_1_data;req_shift_2_data;req_shift_3_data;req_shift_4_data;req_shift_5_data;
  gen_shift_1_data;gen_shift_2_data;gen_shift_3_data;gen_shift_4_data;gen_shift_5_data;
  defReqVsGeneTotalData;defReqVsGeneMidData: any;defReqVsGeneDayData: any;defReqVsGeneEveData: any;
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
 day_summary
 default_value=0
 static urlArray;
 current_day_summary_data:any=[]
 total_current_day_summary_data
 total_current_day_req
 total_current_day_gen
 total_current_day_diff
 addShiftData: any
 gShift: any;
  summary_day_data: any;
  // HighlightRow : Number;
  // ClickedRow:any;
  schedule_id

  chart_data_R=[]
  chart_data_G=[]
  result_R_G=[]
  Req=[]
  Gen=[]
  Shift=[]
  final_dataset=[]

  current_day
  constructor(public modalCtrl: ModalController,
              private route:Router,
              private headerTitleService: HeaderTitleForModalPageService,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private scheduleService: ScheduleDataService,
              public navCtrl: NavController,
              public alertController: AlertController,
              public navParams: NavParams,
              private localData: LocalDataService,
              private requiredWorkforce: RequiredWorkforceService,
              public actionsheetCtrl: ActionSheetController,
              public dataService:ScheduleDataService,
              ) {
                // this.ClickedRow = function(index){
                //   this.HighlightRow = index;
              // }
              ViewSummaryDayCategoryWisePage.urlArray="false"
              this.day_summary=navParams.get('days')
              this.schedule_id=navParams.get('schedule_id')

              if(this.day_summary.id==0){
                this.current_day='Sunday'
              }
              else if(this.day_summary.id==1){
                this.current_day='Monday'
              }
              else if(this.day_summary.id==2){
                this.current_day='Tuesday'
              }
              else if(this.day_summary.id==3){
                this.current_day='Wednesday'
              }
              else if(this.day_summary.id==4){
                this.current_day='Thursday'
              }
              else if(this.day_summary.id==5){
                this.current_day='Friday'
              }
              else if(this.day_summary.id==6){
                this.current_day='Saturday'
              }
              this.headerTitleService.setTitle(this.current_day);
                  // }

              }


   ngOnInit() {

this.exportData=[]
this.customizeShiftData=[]
     this.customizeScheduleShiftLines=[]
     this.defGeneratedData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.defRequiredData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.generatedEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.requiredEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
     this.defscheduleShift=JSON.parse(this.localData.getItem('defaultScheduleShiftLine'))
     // this.workLoadData=JSON.parse(this.localData.getItem('workLoadData'))
     this.focusShiftLine=JSON.parse(this.localData.getItem('focusShiftLine'))
     this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
this.scheduleShift=this.scheduleShift[this.schedule_id]
  this.defscheduleShift=this.defscheduleShift[this.schedule_id]
  this.currentShiftlineScheduleShiftDuration=this.scheduleShift[0].shiftdurationp
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

    this.shift=['M',6,7,1,3]

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
    var countsCustomizedSunDay =[]
    countsCustomizedSunDay=[...this.sundAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]
    var countsCustomizedMonDay=[]
    countsCustomizedMonDay =[...this.mondAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]

    var countsCustomizedTueDay=[]
    countsCustomizedTueDay =[...this.tuedAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]

    var countsCustomizedWedDay = [];
    countsCustomizedWedDay=[...this.weddAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]

    var countsCustomizedThuDay = [];
    countsCustomizedThuDay=[...this.thudAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]
    var countsCustomizedFriDay = [];
    countsCustomizedFriDay=[...this.fridAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]
    var countsCustomizedSatDay = [];
    countsCustomizedSatDay=[...this.satdAy.reduce((r, e) => {
      let k = `${e.shiftDefintion}|${e.shift_duration}`;
      if(!r.has(k)) r.set(k, {...e, totalEmp: 1})
      else r.get(k).totalEmp++
      return r;
    }, new Map).values()]

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
    let sunTotalEmp=[];let monTotalEmp=[];let tueTotalEmp=[];let wedTotalEmp=[];let thuTotalEmp=[];let friTotalEmp=[];let satTotalEmp=[]
    this.sun_mid=0;this.sun_day=0;this.sun_eve=0;
    this.mon_mid=0;this.mon_day=0;this.mon_eve=0;
    this.tue_mid=0;this.tue_day=0;this.tue_eve=0;
    this.wed_mid=0;this.wed_day=0;this.wed_eve=0;
    this.thu_mid=0;this.thu_day=0;this.thu_eve=0;
    this.fri_mid=0;this.fri_day=0;this.fri_eve=0;
    this.sat_mid=0;this.sat_day=0;this.sat_eve=0;
    for(var i=0;i<countsCustomizedSunDay.length;i++){
      if(countsCustomizedSunDay[i].shiftCategory=='1'){
        this.sun_mid=this.sun_mid+ + +countsCustomizedSunDay[i].totalEmp
      }
      else if(countsCustomizedSunDay[i].shiftCategory=='3'){
        this.sun_day=this.sun_day+ + +countsCustomizedSunDay[i].totalEmp
      }
      else if(countsCustomizedSunDay[i].shiftCategory=='2'){
        this.sun_eve=this.sun_eve+ + +countsCustomizedSunDay[i].totalEmp
      }
    }

    // Mon
    for(var i=0;i<countsCustomizedMonDay.length;i++){
      if(countsCustomizedMonDay[i].shiftCategory=='1'){
        this.mon_mid=this.mon_mid+ + +countsCustomizedMonDay[i].totalEmp
      }
      else if(countsCustomizedMonDay[i].shiftCategory=='3'){
        this.mon_day=this.mon_day+ + +countsCustomizedMonDay[i].totalEmp
      }
      else if(countsCustomizedMonDay[i].shiftCategory=='2'){
        this.mon_eve=this.mon_eve+ + +countsCustomizedMonDay[i].totalEmp
      }
    }
    // Tue
    for(var i=0;i<countsCustomizedTueDay.length;i++){
      if(countsCustomizedTueDay[i].shiftCategory=='1'){
        this.tue_mid=this.tue_mid+ + +countsCustomizedTueDay[i].totalEmp
      }
      else if(countsCustomizedTueDay[i].shiftCategory=='3'){
        this.tue_day=this.tue_day+ + +countsCustomizedTueDay[i].totalEmp
      }
      else if(countsCustomizedTueDay[i].shiftCategory=='2'){
        this.tue_eve=this.tue_eve+ + +countsCustomizedTueDay[i].totalEmp
      }
    }


    // Wed
    for(var i=0;i<countsCustomizedWedDay.length;i++){
      if(countsCustomizedWedDay[i].shiftCategory=='1'){
        this.wed_mid=this.wed_mid+ + +countsCustomizedWedDay[i].totalEmp
      }
      else if(countsCustomizedWedDay[i].shiftCategory=='3'){
        this.wed_day=this.wed_day+ + +countsCustomizedWedDay[i].totalEmp
      }
      else if(countsCustomizedWedDay[i].shiftCategory=='2'){
        this.wed_eve=this.wed_eve+ + +countsCustomizedWedDay[i].totalEmp
      }
    }

    // Thu
    for(var i=0;i<countsCustomizedThuDay.length;i++){
      if(countsCustomizedThuDay[i].shiftCategory=='1'){
        this.thu_mid=this.thu_mid+ + +countsCustomizedThuDay[i].totalEmp
      }
      else if(countsCustomizedThuDay[i].shiftCategory=='3'){
        this.thu_day=this.thu_day+ + +countsCustomizedThuDay[i].totalEmp
      }
      else if(countsCustomizedThuDay[i].shiftCategory=='2'){
        this.thu_eve=this.thu_eve+ + +countsCustomizedThuDay[i].totalEmp
      }
    }

    // Fri
    for(var i=0;i<countsCustomizedFriDay.length;i++){
      if(countsCustomizedFriDay[i].shiftCategory=='1'){
        this.fri_mid=this.fri_mid+ + +countsCustomizedFriDay[i].totalEmp
      }
      else if(countsCustomizedFriDay[i].shiftCategory=='3'){
        this.fri_day=this.fri_day+ + +countsCustomizedFriDay[i].totalEmp
      }
      else if(countsCustomizedFriDay[i].shiftCategory=='2'){
        this.fri_eve=this.fri_eve+ + +countsCustomizedFriDay[i].totalEmp
      }
    }

    //Sat
    for(var i=0;i<countsCustomizedSatDay.length;i++){
      if(countsCustomizedSatDay[i].shiftCategory=='1'){
        this.sat_mid=this.sat_mid+ + +countsCustomizedSatDay[i].totalEmp
      }
      else if(countsCustomizedSatDay[i].shiftCategory=='3'){
        this.sat_day=this.sat_day+ + +countsCustomizedSatDay[i].totalEmp
      }
      else if(countsCustomizedSatDay[i].shiftCategory=='2'){
        this.sat_eve=this.sat_eve+ + +countsCustomizedSatDay[i].totalEmp
      }
    }
    this.reqvsgenDataShiftTime=[];this.reqvsgenDataSun=[];this.reqvsgenDataMon=[];this.reqvsgenDataTue=[];this.reqvsgenDataWed=[];this.reqvsgenDataThu=[];this.reqvsgenDataFri=[];this.reqvsgenDataSat=[];

          var r = [],r1=[]
          countsCustomizedSunDay.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedSunDay=r1.concat(r);
          countsCustomizedSunDay=countsCustomizedSunDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));

          r = [],r1=[],r2=[],r3=[]
          countsCustomizedMonDay.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedMonDay=r1.concat(r);
          countsCustomizedMonDay=countsCustomizedMonDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
          r = [],r1=[]
          countsCustomizedTueDay.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedTueDay=r1.concat(r);
          countsCustomizedTueDay=countsCustomizedTueDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
          r = [],r1=[]
          countsCustomizedWedDay.forEach((e)=>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedWedDay=r1.concat(r);
          countsCustomizedWedDay=countsCustomizedWedDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
          r = [],r1=[]
          countsCustomizedThuDay.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedThuDay=r1.concat(r);
          countsCustomizedThuDay=countsCustomizedThuDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
          r = [],r1=[]
          countsCustomizedFriDay.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedFriDay=r1.concat(r);
          countsCustomizedFriDay=countsCustomizedFriDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
          r = [],r1=[]
          countsCustomizedSatDay.forEach((e) => {if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
          r1=r1.sort((a,b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
          r=r.sort((a,b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
          countsCustomizedSatDay=r1.concat(r);
          countsCustomizedSatDay=countsCustomizedSatDay.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
    var tempObj

this.reqvsgenDataShiftTime.push("")
this.reqvsgenDataSun.push("Sun")
this.reqvsgenDataMon.push("Mon")
this.reqvsgenDataTue.push("Tue")
this.reqvsgenDataWed.push("Wed")
this.reqvsgenDataThu.push("Thu")
this.reqvsgenDataFri.push("Fri")
this.reqvsgenDataSat.push("Sat")
for(var i=0;i<this.allShiftData.length;i++){

    for(var j=0;j<countsCustomizedSunDay.length;j++){
      if(Number(this.allShiftData[i].startTime)===Number(countsCustomizedSunDay[j].shiftDefintion) && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
      this.reqvsgenDataShiftTime.push({"sd":String(this.allShiftData[i].startTime),"sdu":this.allShiftData[i].shift_duration})
      }
    }
  for(var j=0;j<countsCustomizedSunDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedSunDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
      if(Number(countsCustomizedSunDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataSun.push({"R":0,"G":Number(countsCustomizedSunDay[j].totalEmp),"day":"Sun"})
      }else{
        this.reqvsgenDataSun.push({"R":Number(this.allShiftData[i].Sun),"G":Number(countsCustomizedSunDay[j].totalEmp),"day":"Sun"})
      }
    }
  }
  for(var j=0;j<countsCustomizedMonDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedMonDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedMonDay[j].shift_duration)){
      if(Number(countsCustomizedMonDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataMon.push({"R":0,"G":Number(countsCustomizedMonDay[j].totalEmp),"day":"Mon"})
      }else{
        this.reqvsgenDataMon.push({"R":Number(this.allShiftData[i].Mon),"G":Number(countsCustomizedMonDay[j].totalEmp),"day":"Mon"})
      }
    }
  }
  for(var j=0;j<countsCustomizedTueDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedTueDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedTueDay[j].shift_duration)){
      if(Number(countsCustomizedTueDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataTue.push({"R":0,"G":Number(countsCustomizedTueDay[j].totalEmp),"day":"Tue"})
      }else{
        this.reqvsgenDataTue.push({"R":Number(this.allShiftData[i].Tue),"G":Number(countsCustomizedTueDay[j].totalEmp),"day":"Tue"})
      }
    }
  }
  for(var j=0;j<countsCustomizedWedDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedWedDay[j].shiftDefintion&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedWedDay[j].shift_duration)){
      if(Number(countsCustomizedWedDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataWed.push({"R":0,"G":Number(countsCustomizedWedDay[j].totalEmp),"day":"Wed"})
      }else{
        this.reqvsgenDataWed.push({"R":Number(this.allShiftData[i].Wed),"G":Number(countsCustomizedWedDay[j].totalEmp),"day":"Wed"})
      }
    }
  }
  for(var j=0;j<countsCustomizedThuDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedThuDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedThuDay[j].shift_duration)){
      if(Number(countsCustomizedThuDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataThu.push({"R":0,"G":Number(countsCustomizedThuDay[j].totalEmp),"day":"Thu"})
      }else{
        this.reqvsgenDataThu.push({"R":Number(this.allShiftData[i].Thu),"G":Number(countsCustomizedThuDay[j].totalEmp),"day":"Thu"})
      }
    }
  }
  for(var j=0;j<countsCustomizedFriDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedFriDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedFriDay[j].shift_duration)){
      if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataFri.push({"R":0,"G":Number(countsCustomizedFriDay[j].totalEmp),"day":"Fri"})
      }else{
        this.reqvsgenDataFri.push({"R":Number(this.allShiftData[i].Fri),"G":Number(countsCustomizedFriDay[j].totalEmp),"day":"Fri"})
      }
    }
  }
  for(var j=0;j<countsCustomizedSatDay.length;j++){
    if(this.allShiftData[i].startTime===countsCustomizedSatDay[j].shiftDefintion && Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSatDay[j].shift_duration)){
      if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
        this.reqvsgenDataSat.push({"R":0,"G":Number(countsCustomizedSatDay[j].totalEmp),"day":"Sat"})
      }else{
        this.reqvsgenDataSat.push({"R":Number(this.allShiftData[i].Sat),"G":Number(countsCustomizedSatDay[j].totalEmp),"day":"Sat"})
      }
    }
  }
}

this.generatedEmpData.SUN_MID=this.sun_mid
this.generatedEmpData.SUN_DAY=this.sun_day
this.generatedEmpData.SUN_EVE=this.sun_eve
this.generatedEmpData.SUN_MID_DAY=this.sun_mid_day
this.generatedEmpData.SUN_DAY_EVE=this.sun_day_eve
this.generatedEmpData.SUN_EVE_MID=this.sun_eve_mid
this.generatedEmpData.MON_MID=this.mon_mid
this.generatedEmpData.MON_DAY=this.mon_day
this.generatedEmpData.MON_EVE=this.mon_eve
this.generatedEmpData.MON_MID_DAY=this.mon_mid_day
this.generatedEmpData.MON_DAY_EVE=this.mon_day_eve
this.generatedEmpData.MON_EVE_MID=this.mon_eve_mid
this.generatedEmpData.TUE_MID=this.tue_mid
this.generatedEmpData.TUE_DAY=this.tue_day

this.generatedEmpData.TUE_EVE=this.tue_eve
this.generatedEmpData.TUE_MID_DAY=this.tue_mid_day
this.generatedEmpData.TUE_DAY_EVE=this.tue_day_eve
this.generatedEmpData.TUE_EVE_MID=this.tue_eve_mid
this.generatedEmpData.WED_MID=this.wed_mid
this.generatedEmpData.WED_DAY=this.wed_day
this.generatedEmpData.WED_EVE=this.wed_eve
this.generatedEmpData.WED_MID_DAY=this.wed_mid_day
this.generatedEmpData.WED_DAY_EVE=this.wed_day_eve
this.generatedEmpData.WED_EVE_MID=this.wed_eve_mid
this.generatedEmpData.THU_MID=this.thu_mid
this.generatedEmpData.THU_DAY=this.thu_day
this.generatedEmpData.THU_EVE=this.thu_eve
this.generatedEmpData.THU_MID_DAY=this.thu_mid_day
this.generatedEmpData.THU_DAY_EVE=this.thu_day_eve
this.generatedEmpData.THU_EVE_MID=this.thu_eve_mid
this.generatedEmpData.FRI_MID=this.fri_mid
this.generatedEmpData.FRI_DAY=this.fri_day
this.generatedEmpData.FRI_EVE=this.fri_eve
this.generatedEmpData.FRI_MID_DAY=this.fri_mid_day
this.generatedEmpData.FRI_DAY_EVE=this.fri_day_eve
this.generatedEmpData.FRI_EVE_MID=this.fri_eve_mid
this.generatedEmpData.SAT_MID=this.sat_mid
this.generatedEmpData.SAT_DAY=this.sat_day
this.generatedEmpData.SAT_EVE=this.sat_eve
this.generatedEmpData.SAT_MID_DAY=this.sat_mid_day
this.generatedEmpData.SAT_DAY_EVE=this.sat_day_eve
this.generatedEmpData.SAT_EVE_MID=this.sat_eve_mid


this.SunDayRequired.push(this.requiredEmpData.SUN_MID)
this.SunDayRequired.push(this.requiredEmpData.SUN_DAY)
this.SunDayRequired.push(this.requiredEmpData.SUN_EVE)
this.SunDayRequired.push(this.requiredEmpData.SUN_MID_DAY)
this.SunDayRequired.push(this.requiredEmpData.SUN_DAY_EVE)
this.SunDayRequired.push(this.requiredEmpData.SUN_EVE_MID)
this.SunDayGenerated.push(this.generatedEmpData.SUN_MID)
this.SunDayGenerated.push(this.generatedEmpData.SUN_DAY)
this.SunDayGenerated.push(this.generatedEmpData.SUN_EVE)
this.SunDayGenerated.push(this.generatedEmpData.SUN_MID_DAY)
this.SunDayGenerated.push(this.generatedEmpData.SUN_DAY_EVE)
this.SunDayGenerated.push(this.generatedEmpData.SUN_EVE_MID)
this.diffSunMid=this.SunDayGenerated[0] + - + this.SunDayRequired[0]
this.diffSunDay=this.SunDayGenerated[1] + - + this.SunDayRequired[1]
this.diffSunEve=this.SunDayGenerated[2] + - + this.SunDayRequired[2]
this.diffSunMidDay=this.SunDayGenerated[3] + - + this.SunDayRequired[3]
this.diffSunDayEve=this.SunDayGenerated[4] + - + this.SunDayRequired[4]
this.diffSunEveMid=this.SunDayGenerated[5] + - + this.SunDayRequired[5]
this.totalSunRequired= this.SunDayRequired[0] + + + this.SunDayRequired[1] + + + this.SunDayRequired[2]+ + +this.SunDayRequired[3] + + + this.SunDayRequired[4] + + + this.SunDayRequired[5]
this.totalSunGenerated= this.SunDayGenerated[0] + + + this.SunDayGenerated[1] + + + this.SunDayGenerated[2]+ + +this.SunDayGenerated[3] + + + this.SunDayGenerated[4] + + + this.SunDayGenerated[5]
this.totalSundiff=this.totalSunGenerated+ - + this.totalSunRequired

this.MonDayRequired.push(this.requiredEmpData.MON_MID)
this.MonDayRequired.push(this.requiredEmpData.MON_DAY)
this.MonDayRequired.push(this.requiredEmpData.MON_EVE)
this.MonDayGenerated.push(this.generatedEmpData.MON_MID)
this.MonDayGenerated.push(this.generatedEmpData.MON_DAY)
this.MonDayGenerated.push(this.generatedEmpData.MON_EVE)
this.MonDayRequired.push(this.requiredEmpData.MON_MID_DAY)
this.MonDayRequired.push(this.requiredEmpData.MON_DAY_EVE)
this.MonDayRequired.push(this.requiredEmpData.MON_EVE_MID)
this.MonDayGenerated.push(this.generatedEmpData.MON_MID_DAY)
this.MonDayGenerated.push(this.generatedEmpData.MON_DAY_EVE)
this.MonDayGenerated.push(this.generatedEmpData.MON_EVE_MID)
this.diffMonMid=this.MonDayGenerated[0] + - + this.MonDayRequired[0]
this.diffMonDay=this.MonDayGenerated[1] + - + this.MonDayRequired[1]
this.diffMonEve=this.MonDayGenerated[2] + - + this.MonDayRequired[2]
this.diffMonMidDay=this.MonDayGenerated[3] + - + this.MonDayRequired[3]
this.diffMonDayEve=this.MonDayGenerated[4] + - + this.MonDayRequired[4]
this.diffMonEveMid=this.MonDayGenerated[5] + - + this.MonDayRequired[5]
this.totalMonRequired= this.MonDayRequired[0] + + + this.MonDayRequired[1] + + + this.MonDayRequired[2]+ + +this.MonDayRequired[3] + + + this.MonDayRequired[4] + + + this.MonDayRequired[5]
this.totalMonGenerated= this.MonDayGenerated[0] + + + this.MonDayGenerated[1] + + + this.MonDayGenerated[2]+ + +this.MonDayGenerated[3] + + + this.MonDayGenerated[4] + + + this.MonDayGenerated[5]
this.totalMondiff=this.totalMonGenerated+ - + this.totalMonRequired

this.TueDayRequired.push(this.requiredEmpData.TUE_MID)
this.TueDayRequired.push(this.requiredEmpData.TUE_DAY)
this.TueDayRequired.push(this.requiredEmpData.TUE_EVE)
this.TueDayGenerated.push(this.generatedEmpData.TUE_MID)
this.TueDayGenerated.push(this.generatedEmpData.TUE_DAY)
this.TueDayGenerated.push(this.generatedEmpData.TUE_EVE)
this.TueDayRequired.push(this.requiredEmpData.TUE_MID_DAY)
this.TueDayRequired.push(this.requiredEmpData.TUE_DAY_EVE)
this.TueDayRequired.push(this.requiredEmpData.TUE_EVE_MID)
this.TueDayGenerated.push(this.generatedEmpData.TUE_MID_DAY)
this.TueDayGenerated.push(this.generatedEmpData.TUE_DAY_EVE)
this.TueDayGenerated.push(this.generatedEmpData.TUE_EVE_MID)
this.diffTueMid=this.TueDayGenerated[0] + - + this.TueDayRequired[0]
this.diffTueDay=this.TueDayGenerated[1] + - + this.TueDayRequired[1]
this.diffTueEve=this.TueDayGenerated[2] + - + this.TueDayRequired[2]
this.diffTueMidDay=this.TueDayGenerated[3] + - + this.TueDayRequired[3]
this.diffTueDayEve=this.TueDayGenerated[4] + - + this.TueDayRequired[4]
this.diffTueEveMid=this.TueDayGenerated[5] + - + this.TueDayRequired[5]
this.totalTueRequired= this.TueDayRequired[0] + + + this.TueDayRequired[1] + + + this.TueDayRequired[2]+ + +this.TueDayRequired[3] + + + this.TueDayRequired[4] + + + this.TueDayRequired[5]
this.totalTueGenerated= this.TueDayGenerated[0] + + + this.TueDayGenerated[1] + + + this.TueDayGenerated[2]+ + +this.TueDayGenerated[3] + + + this.TueDayGenerated[4] + + + this.TueDayGenerated[5]
this.totalTuediff=this.totalTueGenerated+ - + this.totalTueRequired

this.WedDayRequired.push(this.requiredEmpData.WED_MID)
this.WedDayRequired.push(this.requiredEmpData.WED_DAY)
this.WedDayRequired.push(this.requiredEmpData.WED_EVE)
this.WedDayGenerated.push(this.generatedEmpData.WED_MID)
this.WedDayGenerated.push(this.generatedEmpData.WED_DAY)
this.WedDayGenerated.push(this.generatedEmpData.WED_EVE)
this.WedDayRequired.push(this.requiredEmpData.WED_MID_DAY)
this.WedDayRequired.push(this.requiredEmpData.WED_DAY_EVE)
this.WedDayRequired.push(this.requiredEmpData.WED_EVE_MID)
this.WedDayGenerated.push(this.generatedEmpData.WED_MID_DAY)
this.WedDayGenerated.push(this.generatedEmpData.WED_DAY_EVE)
this.WedDayGenerated.push(this.generatedEmpData.WED_EVE_MID)
this.diffWedMid=this.WedDayGenerated[0] + - + this.WedDayRequired[0]
this.diffWedDay=this.WedDayGenerated[1] + - + this.WedDayRequired[1]
this.diffWedEve=this.WedDayGenerated[2] + - + this.WedDayRequired[2]
this.diffWedMidDay=this.WedDayGenerated[3] + - + this.WedDayRequired[3]
this.diffWedDayEve=this.WedDayGenerated[4] + - + this.WedDayRequired[4]
this.diffWedEveMid=this.WedDayGenerated[5] + - + this.WedDayRequired[5]
this.totalWedRequired= this.WedDayRequired[0] + + + this.WedDayRequired[1] + + + this.WedDayRequired[2]+ + +this.WedDayRequired[3] + + + this.WedDayRequired[4] + + + this.WedDayRequired[5]
this.totalWedGenerated= this.WedDayGenerated[0] + + + this.WedDayGenerated[1] + + + this.WedDayGenerated[2]+ + +this.WedDayGenerated[3] + + + this.WedDayGenerated[4] + + + this.WedDayGenerated[5]
this.totalWeddiff=this.totalWedGenerated+ - + this.totalWedRequired

this.ThuDayRequired.push(this.requiredEmpData.THU_MID)
this.ThuDayRequired.push(this.requiredEmpData.THU_DAY)
this.ThuDayRequired.push(this.requiredEmpData.THU_EVE)
this.ThuDayGenerated.push(this.generatedEmpData.THU_MID)
this.ThuDayGenerated.push(this.generatedEmpData.THU_DAY)
this.ThuDayGenerated.push(this.generatedEmpData.THU_EVE)
this.ThuDayRequired.push(this.requiredEmpData.THU_MID_DAY)
this.ThuDayRequired.push(this.requiredEmpData.THU_DAY_EVE)
this.ThuDayRequired.push(this.requiredEmpData.THU_EVE_MID)
this.ThuDayGenerated.push(this.generatedEmpData.THU_MID_DAY)
this.ThuDayGenerated.push(this.generatedEmpData.THU_DAY_EVE)
this.ThuDayGenerated.push(this.generatedEmpData.THU_EVE_MID)
this.diffThuMid=this.ThuDayGenerated[0] + - + this.ThuDayRequired[0]
this.diffThuDay=this.ThuDayGenerated[1] + - + this.ThuDayRequired[1]
this.diffThuEve=this.ThuDayGenerated[2] + - + this.ThuDayRequired[2]
this.diffThuMidDay=this.ThuDayGenerated[3] + - + this.ThuDayRequired[3]
this.diffThuDayEve=this.ThuDayGenerated[4] + - + this.ThuDayRequired[4]
this.diffThuEveMid=this.ThuDayGenerated[5] + - + this.ThuDayRequired[5]
this.totalThuRequired= this.ThuDayRequired[0] + + + this.ThuDayRequired[1] + + + this.ThuDayRequired[2]+ + +this.ThuDayRequired[3] + + + this.ThuDayRequired[4] + + + this.ThuDayRequired[5]
this.totalThuGenerated= this.ThuDayGenerated[0] + + + this.ThuDayGenerated[1] + + + this.ThuDayGenerated[2]+ + +this.ThuDayGenerated[3] + + + this.ThuDayGenerated[4] + + + this.ThuDayGenerated[5]
this.totalThudiff=this.totalThuGenerated+ - + this.totalThuRequired

this.FriDayRequired.push(this.requiredEmpData.FRI_MID)
this.FriDayRequired.push(this.requiredEmpData.FRI_DAY)
this.FriDayRequired.push(this.requiredEmpData.FRI_EVE)
this.FriDayGenerated.push(this.generatedEmpData.FRI_MID)
this.FriDayGenerated.push(this.generatedEmpData.FRI_DAY)
this.FriDayGenerated.push(this.generatedEmpData.FRI_EVE)
this.FriDayRequired.push(this.requiredEmpData.FRI_MID_DAY)
this.FriDayRequired.push(this.requiredEmpData.FRI_DAY_EVE)
this.FriDayRequired.push(this.requiredEmpData.FRI_EVE_MID)
this.FriDayGenerated.push(this.generatedEmpData.FRI_MID_DAY)
this.FriDayGenerated.push(this.generatedEmpData.FRI_DAY_EVE)
this.FriDayGenerated.push(this.generatedEmpData.FRI_EVE_MID)
this.diffFriMid=this.FriDayGenerated[0] + - + this.FriDayRequired[0]
this.diffFriDay=this.FriDayGenerated[1] + - + this.FriDayRequired[1]
this.diffFriEve=this.FriDayGenerated[2] + - + this.FriDayRequired[2]
this.diffFriMidDay=this.FriDayGenerated[3] + - + this.FriDayRequired[3]
this.diffFriDayEve=this.FriDayGenerated[4] + - + this.FriDayRequired[4]
this.diffFriEveMid=this.FriDayGenerated[5] + - + this.FriDayRequired[5]
this.totalFriRequired= this.FriDayRequired[0] + + + this.FriDayRequired[1] + + + this.FriDayRequired[2]+ + +this.FriDayRequired[3] + + + this.FriDayRequired[4] + + + this.FriDayRequired[5]
this.totalFriGenerated= this.FriDayGenerated[0] + + + this.FriDayGenerated[1] + + + this.FriDayGenerated[2]+ + +this.FriDayGenerated[3] + + + this.FriDayGenerated[4] + + + this.FriDayGenerated[5]
this.totalFridiff=this.totalFriGenerated+ - + this.totalFriRequired

this.SatDayRequired.push(this.requiredEmpData.SAT_MID)
this.SatDayRequired.push(this.requiredEmpData.SAT_DAY)
this.SatDayRequired.push(this.requiredEmpData.SAT_EVE)
this.SatDayGenerated.push(this.generatedEmpData.SAT_MID)
this.SatDayGenerated.push(this.generatedEmpData.SAT_DAY)
this.SatDayGenerated.push(this.generatedEmpData.SAT_EVE)
this.SatDayRequired.push(this.requiredEmpData.SAT_MID_DAY)
this.SatDayRequired.push(this.requiredEmpData.SAT_DAY_EVE)
this.SatDayRequired.push(this.requiredEmpData.SAT_EVE_MID)
this.SatDayGenerated.push(this.generatedEmpData.SAT_MID_DAY)
this.SatDayGenerated.push(this.generatedEmpData.SAT_DAY_EVE)
this.SatDayGenerated.push(this.generatedEmpData.SAT_EVE_MID)
this.diffSatMid=this.SatDayGenerated[0] + - + this.SatDayRequired[0]
this.diffSatDay=this.SatDayGenerated[1] + - + this.SatDayRequired[1]
this.diffSatEve=this.SatDayGenerated[2] + - + this.SatDayRequired[2]
this.diffSatMidDay=this.SatDayGenerated[3] + - + this.SatDayRequired[3]
this.diffSatDayEve=this.SatDayGenerated[4] + - + this.SatDayRequired[4]
this.diffSatEveMid=this.SatDayGenerated[5] + - + this.SatDayRequired[5]
this.totalSatRequired= this.SatDayRequired[0] + + + this.SatDayRequired[1] + + + this.SatDayRequired[2]+ + +this.SatDayRequired[3] + + + this.SatDayRequired[4] + + + this.SatDayRequired[5]
this.totalSatGenerated= this.SatDayGenerated[0] + + + this.SatDayGenerated[1] + + + this.SatDayGenerated[2]+ + +this.SatDayGenerated[3] + + + this.SatDayGenerated[4] + + + this.SatDayGenerated[5]
this.totalSatdiff=this.totalSatGenerated+ - + this.totalSatRequired


// this.dData=[]
// this.dData.push(this.defRequiredData.SUN_MID)
//       this.dayTitleforExcel={"":"","sun":"SUN","mon":"MON","tue":"TUE","wed":"WED","thu":"THU","fri":"FRI","sat":"SAT"}

      this.def_gen_shift_1_data={"":this.shift[0],"sun":this.def_sun_1,"mon":this.def_mon_1,"tue":this.def_tue_1,"wed":this.def_wed_2,"thu":this.def_thu_1,"fri":this.def_fri_1,"sat":this.def_sat_1}
      this.def_gen_shift_2_data={"":this.shift[1],"sun":this.def_sun_2,"mon":this.def_mon_2,"tue":this.def_tue_2,"wed":this.def_wed_2,"thu":this.def_thu_2,"fri":this.def_fri_2,"sat":this.def_sat_2,}
      this.def_gen_shift_3_data={"":this.shift[2],"sun":this.def_sun_3,"mon":this.def_mon_3,"tue":this.def_tue_3,"wed":this.def_wed_3,"thu":this.def_thu_3,"fri":this.def_fri_3,"sat":this.def_sat_3,}
      this.def_gen_shift_4_data={"":this.shift[3],"sun":this.def_sun_4,"mon":this.def_mon_4,"tue":this.def_tue_4,"wed":this.def_wed_4,"thu":this.def_thu_4,"fri":this.def_fri_4,"sat":this.def_sat_4,}
      this.def_gen_shift_5_data={"":this.shift[4],"sun":this.def_sun_5,"mon":this.def_mon_5,"tue":this.def_tue_5,"wed":this.def_wed_5,"thu":this.def_thu_5,"fri":this.def_fri_5,"sat":this.def_sat_5,}


      for(var i=0;i<this.allShiftData.length;i++){
  this.req_shift_1_data={"shiftTime":this.allShiftData[i].startTime,"sun":this.allShiftData[i].Sun,"mon":this.allShiftData[i].Mon,"tue":this.allShiftData[i].Tue,"wed":this.allShiftData[i].Wed,"thu":this.allShiftData[i].Thu,"fri":this.allShiftData[i].Fri,"sat":this.allShiftData[i].Sat}
  this.reqData.push(this.req_shift_1_data)
}








if(this.day_summary.day=='Sun'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){

    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataSun[i],"diff":Number(this.reqvsgenDataSun[i].G)+ - +Number(this.reqvsgenDataSun[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }


      this.total_current_day_req= this.SunDayRequired[0] + + + this.SunDayRequired[1] + + + this.SunDayRequired[2]
      this.total_current_day_gen= this.SunDayGenerated[0] + + + this.SunDayGenerated[1] + + + this.SunDayGenerated[2]
      this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req
}else if(this.day_summary.day=='Mon'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataMon[i],"diff":Number(this.reqvsgenDataMon[i].G)+ - +Number(this.reqvsgenDataMon[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.MonDayRequired[0] + + + this.MonDayRequired[1] + + + this.MonDayRequired[2]
  this.total_current_day_gen= this.MonDayGenerated[0] + + + this.MonDayGenerated[1] + + + this.MonDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req

}else if(this.day_summary.day=='Tue'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataTue[i],"diff":Number(this.reqvsgenDataTue[i].G)+ - +Number(this.reqvsgenDataTue[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.TueDayRequired[0] + + + this.TueDayRequired[1] + + + this.TueDayRequired[2]
  this.total_current_day_gen= this.TueDayGenerated[0] + + + this.TueDayGenerated[1] + + + this.TueDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req

}else if(this.day_summary.day=='Wed'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataWed[i],"diff":Number(this.reqvsgenDataWed[i].G)+ - +Number(this.reqvsgenDataWed[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.WedDayRequired[0] + + + this.WedDayRequired[1] + + + this.WedDayRequired[2]
  this.total_current_day_gen= this.WedDayGenerated[0] + + + this.WedDayGenerated[1] + + + this.WedDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req

}else if(this.day_summary.day=='Thu'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataThu[i],"diff":Number(this.reqvsgenDataThu[i].G)+ - +Number(this.reqvsgenDataThu[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.ThuDayRequired[0] + + + this.ThuDayRequired[1] + + + this.ThuDayRequired[2]
  this.total_current_day_gen= this.ThuDayGenerated[0] + + + this.ThuDayGenerated[1] + + + this.ThuDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req

}else if(this.day_summary.day=='Fri'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataFri[i],"diff":Number(this.reqvsgenDataFri[i].G)+ - +Number(this.reqvsgenDataFri[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.FriDayRequired[0] + + + this.FriDayRequired[1] + + + this.FriDayRequired[2]
  this.total_current_day_gen= this.FriDayGenerated[0] + + + this.FriDayGenerated[1] + + + this.FriDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req
}else if(this.day_summary.day=='Sat'){
  this.current_day_summary_data=[]
  for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
    this.summary_day_data={"shiftName":this.reqvsgenDataShiftTime[i].sd,"shift_duration":this.reqvsgenDataShiftTime[i].sdu,"shiftData":this.reqvsgenDataSat[i],"diff":Number(this.reqvsgenDataSat[i].G)+ - +Number(this.reqvsgenDataSat[i].R)}
    this.current_day_summary_data.push(this.summary_day_data)
  }
  this.total_current_day_req= this.SatDayRequired[0] + + + this.SatDayRequired[1] + + + this.SatDayRequired[2]
  this.total_current_day_gen= this.SatDayGenerated[0] + + + this.SatDayGenerated[1] + + + this.SatDayGenerated[2]
  this.total_current_day_diff=this.total_current_day_gen+ - + this.total_current_day_req
}




      this.gen_shift_1_data={"":this.shift[0],"sun":this.sun_1,"mon":this.mon_1,"tue":this.tue_1,"wed":this.wed_2,"thu":this.thu_1,"fri":this.fri_1,"sat":this.sat_1}
      this.gen_shift_2_data={"":this.shift[1],"sun":this.sun_2,"mon":this.mon_2,"tue":this.tue_2,"wed":this.wed_2,"thu":this.thu_2,"fri":this.fri_2,"sat":this.sat_2,}
      this.gen_shift_3_data={"":this.shift[2],"sun":this.sun_3,"mon":this.mon_3,"tue":this.tue_3,"wed":this.wed_3,"thu":this.thu_3,"fri":this.fri_3,"sat":this.sat_3,}
      this.gen_shift_4_data={"":this.shift[3],"sun":this.sun_4,"mon":this.mon_4,"tue":this.tue_4,"wed":this.wed_4,"thu":this.thu_4,"fri":this.fri_4,"sat":this.sat_4,}
      this.gen_shift_5_data={"":this.shift[4],"sun":this.sun_5,"mon":this.mon_5,"tue":this.tue_5,"wed":this.wed_5,"thu":this.thu_5,"fri":this.fri_5,"sat":this.sat_5,}

      this.ReqVsGeneMidData=["MID",this.requiredEmpData.SUN_MID+'/'+this.generatedEmpData.SUN_MID,this.requiredEmpData.MON_MID+'/'+this.generatedEmpData.MON_MID,this.requiredEmpData.TUE_MID+'/'+this.generatedEmpData.TUE_MID,this.requiredEmpData.WED_MID+'/'+this.generatedEmpData.WED_MID,this.requiredEmpData.THU_MID+'/'+this.generatedEmpData.THU_MID,this.requiredEmpData.FRI_MID+'/'+this.generatedEmpData.FRI_MID,this.requiredEmpData.SAT_MID+'/'+this.generatedEmpData.SAT_MID]
      this.ReqVsGeneDayData=["DAY",this.requiredEmpData.SUN_DAY+'/'+this.generatedEmpData.SUN_DAY,this.requiredEmpData.MON_DAY+'/'+this.generatedEmpData.MON_DAY,this.requiredEmpData.TUE_DAY+'/'+this.generatedEmpData.TUE_DAY,this.requiredEmpData.WED_DAY+'/'+this.generatedEmpData.WED_DAY,this.requiredEmpData.THU_DAY+'/'+this.generatedEmpData.THU_DAY,this.requiredEmpData.FRI_DAY+'/'+this.generatedEmpData.FRI_DAY,this.requiredEmpData.SAT_DAY+'/'+this.generatedEmpData.SAT_DAY]
      this.ReqVsGeneEveData=["EVE",this.requiredEmpData.SUN_EVE+'/'+this.generatedEmpData.SUN_EVE,this.requiredEmpData.MON_EVE+'/'+this.generatedEmpData.MON_EVE,this.requiredEmpData.TUE_EVE+'/'+this.generatedEmpData.TUE_EVE,this.requiredEmpData.WED_EVE+'/'+this.generatedEmpData.WED_EVE,this.requiredEmpData.THU_EVE+'/'+this.generatedEmpData.THU_EVE,this.requiredEmpData.FRI_EVE+'/'+this.generatedEmpData.FRI_EVE,this.requiredEmpData.SAT_EVE+'/'+this.generatedEmpData.SAT_EVE]
      this.ReqVsGeneTotalData=["",(this.requiredEmpData.SUN_MID+this.requiredEmpData.SUN_DAY+this.requiredEmpData.SUN_EVE)+'/'+ (this.generatedEmpData.SUN_MID+ + +this.generatedEmpData.SUN_DAY+ + +this.generatedEmpData.SUN_EVE),(this.requiredEmpData.MON_MID+this.requiredEmpData.MON_DAY+this.requiredEmpData.MON_EVE)+'/'+ (this.generatedEmpData.MON_MID+ + +this.generatedEmpData.MON_DAY+ + +this.generatedEmpData.MON_EVE),(this.requiredEmpData.TUE_MID+this.requiredEmpData.TUE_DAY+this.requiredEmpData.TUE_EVE)+'/'+ (this.generatedEmpData.TUE_MID+ + +this.generatedEmpData.TUE_DAY+ + +this.generatedEmpData.TUE_EVE),(this.requiredEmpData.WED_MID+this.requiredEmpData.WED_DAY+this.requiredEmpData.WED_EVE)+'/'+ (this.generatedEmpData.WED_MID+ + +this.generatedEmpData.WED_DAY+ + +this.generatedEmpData.WED_EVE),(this.requiredEmpData.THU_MID+this.requiredEmpData.THU_DAY+this.requiredEmpData.THU_EVE)+'/'+ (this.generatedEmpData.THU_MID+ + +this.generatedEmpData.THU_DAY+ + +this.generatedEmpData.THU_EVE),(this.requiredEmpData.FRI_MID+this.requiredEmpData.FRI_DAY+this.requiredEmpData.FRI_EVE)+'/'+ (this.generatedEmpData.FRI_MID+ + +this.generatedEmpData.FRI_DAY+ + +this.generatedEmpData.FRI_EVE),(this.requiredEmpData.SAT_MID+this.requiredEmpData.SAT_DAY+this.requiredEmpData.SAT_EVE)+'/'+ (this.generatedEmpData.SAT_MID+ + +this.generatedEmpData.SAT_DAY+ + +this.generatedEmpData.SAT_EVE)]
this.customized=["",this.ReqVsGeneMidData[0],this.ReqVsGeneDayData[0],this.ReqVsGeneEveData[0],this.ReqVsGeneTotalData[0]]
this.customizedSun=["Sun",this.ReqVsGeneMidData[1],this.ReqVsGeneDayData[1],this.ReqVsGeneEveData[1],this.ReqVsGeneTotalData[1]]
this.customizedMon=["Mon",this.ReqVsGeneMidData[2],this.ReqVsGeneDayData[2],this.ReqVsGeneEveData[2],this.ReqVsGeneTotalData[2]]
this.customizedTue=["Tue",this.ReqVsGeneMidData[3],this.ReqVsGeneDayData[3],this.ReqVsGeneEveData[3],this.ReqVsGeneTotalData[3]]
this.customizedWed=["Wed",this.ReqVsGeneMidData[4],this.ReqVsGeneDayData[4],this.ReqVsGeneEveData[4],this.ReqVsGeneTotalData[4]]
this.customizedThu=["Thu",this.ReqVsGeneMidData[5],this.ReqVsGeneDayData[5],this.ReqVsGeneEveData[5],this.ReqVsGeneTotalData[5]]
this.customizedFri=["Fri",this.ReqVsGeneMidData[6],this.ReqVsGeneDayData[6],this.ReqVsGeneEveData[6],this.ReqVsGeneTotalData[6]]
this.customizedSat=["Sat",this.ReqVsGeneMidData[7],this.ReqVsGeneDayData[7],this.ReqVsGeneEveData[7],this.ReqVsGeneTotalData[7]]

      this.defReqVsGeneMidData=["MID",this.defRequiredData.SUN_MID+'/'+this.defGeneratedData.SUN_MID,this.defRequiredData.MON_MID+'/'+this.defGeneratedData.MON_MID,this.defRequiredData.TUE_MID+'/'+this.defGeneratedData.TUE_MID,this.defRequiredData.WED_MID+'/'+this.defGeneratedData.WED_MID,this.defRequiredData.THU_MID+'/'+this.defGeneratedData.THU_MID,this.defRequiredData.FRI_MID+'/'+this.defGeneratedData.FRI_MID,this.defRequiredData.SAT_MID+'/'+this.defGeneratedData.SAT_MID]
      this.defReqVsGeneDayData=["DAY",this.defRequiredData.SUN_DAY+'/'+this.defGeneratedData.SUN_DAY,this.defRequiredData.MON_DAY+'/'+this.defGeneratedData.MON_DAY,this.defRequiredData.TUE_DAY+'/'+this.defGeneratedData.TUE_DAY,this.defRequiredData.WED_DAY+'/'+this.defGeneratedData.WED_DAY,this.defRequiredData.THU_DAY+'/'+this.defGeneratedData.THU_DAY,this.defRequiredData.FRI_DAY+'/'+this.defGeneratedData.FRI_DAY,this.defRequiredData.SAT_DAY+'/'+this.defGeneratedData.SAT_DAY,]
      this.defReqVsGeneEveData=["EVE",this.defRequiredData.SUN_EVE+'/'+this.defGeneratedData.SUN_EVE,this.defRequiredData.MON_EVE+'/'+this.defGeneratedData.MON_EVE,this.defRequiredData.TUE_EVE+'/'+this.defGeneratedData.TUE_EVE,this.defRequiredData.WED_EVE+'/'+this.defGeneratedData.WED_EVE,this.defRequiredData.THU_EVE+'/'+this.defGeneratedData.THU_EVE,this.defRequiredData.FRI_EVE+'/'+this.defGeneratedData.FRI_EVE,this.defRequiredData.SAT_EVE+'/'+this.defGeneratedData.SAT_EVE,]
      this.defReqVsGeneTotalData=["",(this.defRequiredData.SUN_MID+this.defRequiredData.SUN_DAY+this.defRequiredData.SUN_EVE)+'/'+ (this.defGeneratedData.SUN_MID+ + +this.defGeneratedData.SUN_DAY+ + +this.defGeneratedData.SUN_EVE),(this.defRequiredData.MON_MID+this.defRequiredData.MON_DAY+this.defRequiredData.MON_EVE)+'/'+ (this.defGeneratedData.MON_MID+ + +this.defGeneratedData.MON_DAY+ + +this.defGeneratedData.MON_EVE),(this.defRequiredData.TUE_MID+this.defRequiredData.TUE_DAY+this.defRequiredData.TUE_EVE)+'/'+ (this.defGeneratedData.TUE_MID+ + +this.defGeneratedData.TUE_DAY+ + +this.defGeneratedData.TUE_EVE),(this.defRequiredData.WED_MID+this.defRequiredData.WED_DAY+this.defRequiredData.WED_EVE)+'/'+ (this.defGeneratedData.WED_MID+ + +this.defGeneratedData.WED_DAY+ + +this.defGeneratedData.WED_EVE),(this.defRequiredData.THU_MID+this.defRequiredData.THU_DAY+this.defRequiredData.THU_EVE)+'/'+ (this.defGeneratedData.THU_MID+ + +this.defGeneratedData.THU_DAY+ + +this.defGeneratedData.THU_EVE),(this.defRequiredData.FRI_MID+this.defRequiredData.FRI_DAY+this.defRequiredData.FRI_EVE)+'/'+ (this.defGeneratedData.FRI_MID+ + +this.defGeneratedData.FRI_DAY+ + +this.defGeneratedData.FRI_EVE),(this.defRequiredData.SAT_MID+this.defRequiredData.SAT_DAY+this.defRequiredData.SAT_EVE)+'/'+ (this.defGeneratedData.SAT_MID+ + +this.defGeneratedData.SAT_DAY+ + +this.defGeneratedData.SAT_EVE),]

      this.def=["",this.defReqVsGeneMidData[0],this.defReqVsGeneDayData[0],this.defReqVsGeneEveData[0],this.defReqVsGeneTotalData[0]]
this.defSun=["Sun",this.defReqVsGeneMidData[1],this.defReqVsGeneDayData[1],this.defReqVsGeneEveData[1],this.defReqVsGeneTotalData[1]]
this.defMon=["Mon",this.defReqVsGeneMidData[2],this.defReqVsGeneDayData[2],this.defReqVsGeneEveData[2],this.defReqVsGeneTotalData[2]]
this.defTue=["Tue",this.defReqVsGeneMidData[3],this.defReqVsGeneDayData[3],this.defReqVsGeneEveData[3],this.defReqVsGeneTotalData[3]]
this.defWed=["Wed",this.defReqVsGeneMidData[4],this.defReqVsGeneDayData[4],this.defReqVsGeneEveData[4],this.defReqVsGeneTotalData[4]]
this.defThu=["Thu",this.defReqVsGeneMidData[5],this.defReqVsGeneDayData[5],this.defReqVsGeneEveData[5],this.defReqVsGeneTotalData[5]]
this.defFri=["Fri",this.defReqVsGeneMidData[6],this.defReqVsGeneDayData[6],this.defReqVsGeneEveData[6],this.defReqVsGeneTotalData[6]]
this.defSat=["Sat",this.defReqVsGeneMidData[7],this.defReqVsGeneDayData[7],this.defReqVsGeneEveData[7],this.defReqVsGeneTotalData[7]]

      // End Comparison of Required and Generated Emp data


//System Generated Schedule Lines

  this.totalDefaultScheduleLine=i

// this.totalShiftLine={"Total Shift Lines":String(this.defscheduleShift.length)}
this.totalShiftLine=String(this.defscheduleShift.length)
this.totalCustomizeShiftLine=this.scheduleShift.length
this.required_title={"Required Workforce":"Required Workforce"}
this.generated_title={'System Generated Workforce':'System Generated Workforc'}
this.required_vs_generated_title={"Required vs System Generated Workforce":"Required vs System Generated Workforce"}

this.defaultScheduleShift.push(this.totalShiftLine)


// for(var i=0;i<this.defscheduleShift.length;i++){

//   this.defaultScheduleShift.push(this.defscheduleShift[i])

// }

for(var i=0; i<=this.scheduleShift.length;i++)
{
  if(this.scheduleShift[i]?.SL  == 'SS' || this.scheduleShift[i]?.SL  == 'SS-A'){
    this.countSunSat++
  }
  else if(this.scheduleShift[i]?.SL  == 'SM' || this.scheduleShift[i]?.SL  == 'SM-A'){
    this.countSunMon++
  }
  else if(this.scheduleShift[i]?.SL  == 'MT' || this.scheduleShift[i]?.SL  == 'MT-A'){
    this.countMonTue++
  }
  else if(this.scheduleShift[i]?.SL  == 'TW' || this.scheduleShift[i]?.SL  == 'TW-A'){
    this.countTueWed++
  }
  else if(this.scheduleShift[i]?.SL  == 'WT' || this.scheduleShift[i]?.SL  == 'WT-A' || this.scheduleShift[i]?.SL  == 'WTh' || this.scheduleShift[i]?.SL  == 'WTh-A'){
    this.countWedThu++
  }
  else if(this.scheduleShift[i]?.SL  == 'TF' || this.scheduleShift[i]?.SL  == 'TF-A' || this.scheduleShift[i]?.SL  == 'ThF' || this.scheduleShift[i]?.SL  == 'ThF-A'){
    this.countThuFri++
  }
  else if(this.scheduleShift[i]?.SL  == 'FS' || this.scheduleShift[i]?.SL  == 'FS-A'){
    this.countFriSat++
  }
  this.totalCount = this.countSunSat + this.countSunMon + this.countMonTue + this.countTueWed + this.countWedThu + this.countThuFri +this.countFriSat

}
for(var j=0; j<=this.scheduleShift.length;j++)
{
  if(this.scheduleShift[j]?.Sun == 'X' && this.scheduleShift[j]?.Sat == 'X'){
    this.result1.push(this.scheduleShift[j]);
  }
  else if(this.scheduleShift[j]?.Sun == 'X' && this.scheduleShift[j]?.Mon == 'X'){
    this.result2.push(this.scheduleShift[j]);
  }
}


var allSL=[8,9,10]
this.result_R_G=[]
var all_Shift=["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300","1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"]
var all_char_data=[],all_char_data_sun=[],all_char_data_mon=[],all_char_data_tue=[],all_char_data_wed=[],all_char_data_thu=[],all_char_data_fri=[],all_char_data_sat=[]
for(var i=0;i<all_Shift.length;i++){
      all_char_data_sun.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'sun'})
      all_char_data_mon.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'mon'})
      all_char_data_tue.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'tue'})
      all_char_data_wed.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'wed'})
      all_char_data_thu.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'thu'})
      all_char_data_fri.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'fri'})
      all_char_data_sat.push({'shiftName':(all_Shift[i]),'R':0,'G':0,'day':'sat'})
}
for(var k=0;k<allSL.length;k++){
  for(var i=0;i<all_Shift.length;i++){
    all_char_data.push({'shiftName':(all_Shift[i]),'R':0,'G':0,"shift_duration":allSL[k]})
  }}

var all_week_day_data=[],all_week_day_data_sun=[],result_R_G_sun=[],f_sun
var temp_time
// //Sun


for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_sun.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataSun[i],"diff":Number(this.reqvsgenDataSun[i].G)+ - +Number(this.reqvsgenDataSun[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_sun.length;i++){
  result_R_G_sun.push({'shiftName':all_week_day_data_sun[i].shiftName,'R':all_week_day_data_sun[i].shiftData.R,'G':all_week_day_data_sun[i].shiftData.G,"shift_duration":all_week_day_data_sun[i].shift_duration})
}

for(var i=0;i<all_char_data.length;i++){
    result_R_G_sun.push(all_char_data[i])
}
f_sun=result_R_G_sun.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName  && t.shift_duration === v.shift_duration))===i)
f_sun=f_sun.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_sun=f_sun


//Mon
var all_week_day_data_mon=[],result_R_G_mon=[],f_mon
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_mon.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataMon[i],"diff":Number(this.reqvsgenDataMon[i].G)+ - +Number(this.reqvsgenDataMon[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}

for(var i=0;i<all_week_day_data_mon.length;i++){

  result_R_G_mon.push({'shiftName':all_week_day_data_mon[i].shiftName,'R':all_week_day_data_mon[i].shiftData.R,'G':all_week_day_data_mon[i].shiftData.G,"shift_duration":all_week_day_data_mon[i].shift_duration})
}

for(var i=0;i<all_char_data.length;i++){
    result_R_G_mon.push(all_char_data[i])
}
f_mon=result_R_G_mon.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName  && t.shift_duration === v.shift_duration))===i)
f_mon=f_mon.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_mon=[]

for(var i=0;i<f_mon.length;i++){
  temp_time=Number(f_mon[i].shiftName)+ + + 2400;
  result_R_G_mon.push({'shiftName':temp_time,'R':f_mon[i].R,'G':f_mon[i].G,"shift_duration":f_mon[i].shift_duration})
}


//Tue
var all_week_day_data_tue=[],result_R_G_tue=[],f_tue
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_tue.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataTue[i],"diff":Number(this.reqvsgenDataTue[i].G)+ - +Number(this.reqvsgenDataTue[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_tue.length;i++){

  result_R_G_tue.push({'shiftName':all_week_day_data_tue[i].shiftName,'R':all_week_day_data_tue[i].shiftData.R,'G':all_week_day_data_tue[i].shiftData.G,"shift_duration":all_week_day_data_tue[i].shift_duration})
}
for(var i=0;i<all_char_data.length;i++){
    result_R_G_tue.push(all_char_data[i])
}
f_tue=result_R_G_tue.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName  && t.shift_duration === v.shift_duration))===i)
f_tue=f_tue.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_tue=[]

for(var i=0;i<f_tue.length;i++){
  temp_time=Number(f_tue[i].shiftName)+ + + 4800;
  result_R_G_tue.push({'shiftName':temp_time,'R':f_tue[i].R,'G':f_tue[i].G,"shift_duration":f_tue[i].shift_duration})
}


//Wed
var all_week_day_data_wed=[],result_R_G_wed=[],f_wed
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_wed.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataWed[i],"diff":Number(this.reqvsgenDataWed[i].G)+ - +Number(this.reqvsgenDataWed[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_wed.length;i++){

  result_R_G_wed.push({'shiftName':all_week_day_data_wed[i].shiftName,'R':all_week_day_data_wed[i].shiftData.R,'G':all_week_day_data_wed[i].shiftData.G,"shift_duration":all_week_day_data_wed[i].shift_duration})
}
for(var i=0;i<all_char_data.length;i++){
    result_R_G_wed.push(all_char_data[i])
}
f_wed=result_R_G_wed.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName  && t.shift_duration === v.shift_duration))===i)
f_wed=f_wed.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_wed=[]

for(var i=0;i<f_wed.length;i++){
  temp_time=Number(f_wed[i].shiftName)+ + + 7200;
  result_R_G_wed.push({'shiftName':temp_time,'R':f_wed[i].R,'G':f_wed[i].G,"shift_duration":f_wed[i].shift_duration})
}

//Thu
var all_week_day_data_thu=[],result_R_G_thu=[],f_thu
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_thu.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataThu[i],"diff":Number(this.reqvsgenDataSun[i].G)+ - +Number(this.reqvsgenDataThu[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_thu.length;i++){

  result_R_G_thu.push({'shiftName':all_week_day_data_thu[i].shiftName,'R':all_week_day_data_thu[i].shiftData.R,'G':all_week_day_data_thu[i].shiftData.G,"shift_duration":all_week_day_data_thu[i].shift_duration})
}
for(var i=0;i<all_char_data.length;i++){
    result_R_G_thu.push(all_char_data[i])
}
f_thu=result_R_G_thu.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration ))===i)
f_thu=f_thu.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_thu=[]

for(var i=0;i<f_thu.length;i++){
  temp_time=Number(f_thu[i].shiftName)+ + + 9600;
  result_R_G_thu.push({'shiftName':temp_time,'R':f_thu[i].R,'G':f_thu[i].G,"shift_duration":f_thu[i].shift_duration})
}

//Fri
var all_week_day_data_fri=[],result_R_G_fri=[],f_fri
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_fri.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataFri[i],"diff":Number(this.reqvsgenDataFri[i].G)+ - +Number(this.reqvsgenDataFri[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_fri.length;i++){

  result_R_G_fri.push({'shiftName':all_week_day_data_fri[i].shiftName,'R':all_week_day_data_fri[i].shiftData.R,'G':all_week_day_data_fri[i].shiftData.G,"shift_duration":all_week_day_data_fri[i].shift_duration})
}
for(var i=0;i<all_char_data.length;i++){
    result_R_G_fri.push(all_char_data[i])
}
f_fri=result_R_G_fri.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration ))===i)
f_fri=f_fri.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_fri=[]

for(var i=0;i<f_fri.length;i++){
  temp_time=Number(f_fri[i].shiftName)+ + + 12000;
  result_R_G_fri.push({'shiftName':temp_time,'R':f_fri[i].R,'G':f_fri[i].G,"shift_duration":f_fri[i].shift_duration})
}

//Sat
var all_week_day_data_sat=[],result_R_G_sat=[],f_sat
for(var i=1;i<this.reqvsgenDataShiftTime.length;i++){
  all_week_day_data_sat.push({"shiftName":this.reqvsgenDataShiftTime[i].sd,"shiftData":this.reqvsgenDataSat[i],"diff":Number(this.reqvsgenDataSat[i].G)+ - +Number(this.reqvsgenDataSat[i].R),"shift_duration":Number(this.reqvsgenDataShiftTime[i].sdu)})
}
for(var i=0;i<all_week_day_data_sat.length;i++){

  result_R_G_sat.push({'shiftName':all_week_day_data_sat[i].shiftName,'R':all_week_day_data_sat[i].shiftData.R,'G':all_week_day_data_sat[i].shiftData.G,"shift_duration":all_week_day_data_sat[i].shift_duration})
}
for(var i=0;i<all_char_data.length;i++){
    result_R_G_sat.push(all_char_data[i])
}
f_sat=result_R_G_sat.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName  && t.shift_duration === v.shift_duration))===i)
f_sat=f_sat.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
result_R_G_sat=[]

for(var i=0;i<f_sat.length;i++){
  temp_time=Number(f_sat[i].shiftName)+ + + 14400;
  result_R_G_sat.push({'shiftName':temp_time,'R':f_sat[i].R,'G':f_sat[i].G,"shift_duration":f_sat[i].shift_duration})
}
result_R_G_sat.push({"shiftName":16800,"R":0,"G":0,"shift_duration":8})
result_R_G_sat.push({"shiftName":16800,"R":0,"G":0,"shift_duration":9})
result_R_G_sat.push({"shiftName":16800,"R":0,"G":0,"shift_duration":10})

for(var i=0;i<result_R_G_sun.length;i++){
  all_week_day_data.push(result_R_G_sun[i])
}
for(var i=0;i<result_R_G_mon.length;i++){
  all_week_day_data.push(result_R_G_mon[i])
}
for(var i=0;i<result_R_G_tue.length;i++){
  all_week_day_data.push(result_R_G_tue[i])
}
for(var i=0;i<result_R_G_wed.length;i++){
  all_week_day_data.push(result_R_G_wed[i])
}
for(var i=0;i<result_R_G_thu.length;i++){
  all_week_day_data.push(result_R_G_thu[i])
}
for(var i=0;i<result_R_G_fri.length;i++){
  all_week_day_data.push(result_R_G_fri[i])
}
for(var i=0;i<result_R_G_sat.length;i++){
  all_week_day_data.push(result_R_G_sat[i])
}




var chart_data=[]
    var currentSL
    var sum1=0
      for(var k=0;k<allSL.length;k++){
        for(var i=0;i<all_week_day_data.length;i++){
          if(Number(all_week_day_data[i].shiftName) % 100 ==0 && allSL[k]==Number(all_week_day_data[i].shift_duration)){
            currentSL=(Number(all_week_day_data[i].shift_duration)*100)+ - +100
            sum1=0
            diff_G=Number(all_week_day_data[i].shiftName)+ - +currentSL
            for(var j=0;j<all_week_day_data.length;j++){
              if(Number(all_week_day_data[j].shiftName)>=diff_G && allSL[k]==Number(all_week_day_data[j].shift_duration)){
                if(Number(all_week_day_data[i].shiftName)>=Number(all_week_day_data[j].shiftName)){
                  if((Number(all_week_day_data[i].shiftName) % 100 ==0) || Number(all_week_day_data[i].shiftName)===0 ){
                    sum1=sum1+ + +all_week_day_data[j].G
                    result={'shiftName':all_week_day_data[i].shiftName,'sum':sum1}
                  }
                }
              }
            }
            chart_data.push({'shiftName':all_week_day_data[i].shiftName,'sum':sum1})
          }
        }
      }
    let counts = chart_data.reduce((prev, curr) => {
      let count = prev.get(curr.shiftName) || 0;
      prev.set(curr.shiftName, curr.sum + count);
      return prev;
    }, new Map());

    let reducedObjArr = [...counts].map(([shiftName, sum]) => {
      return {shiftName, sum}
    })
    chart_data=reducedObjArr
// Req
    var chart_data_req=[],chart_data_req=[]

    for(var k=0;k<allSL.length;k++){

      for(var i=0;i<all_week_day_data.length;i++){
        if(Number(all_week_day_data[i].shiftName) % 100 ==0 && allSL[k]==Number(all_week_day_data[i].shift_duration)){
          currentSL=(Number(all_week_day_data[i].shift_duration)*100)+ - +100
          sum1=0
          diff_G=Number(all_week_day_data[i].shiftName)+ - +currentSL
          for(var j=0;j<all_week_day_data.length;j++){
            if(Number(all_week_day_data[j].shiftName)>=diff_G && allSL[k]==Number(all_week_day_data[j].shift_duration)){
              if(Number(all_week_day_data[i].shiftName)>=Number(all_week_day_data[j].shiftName)){
                if((Number(all_week_day_data[i].shiftName) % 100 ==0) || Number(all_week_day_data[i].shiftName)===0 ){
                  sum1=sum1+ + +all_week_day_data[j].R
                  result={'shiftName':all_week_day_data[i].shiftName,'sum':sum1}
                }
              }
            }
          }

          chart_data_req.push({'shiftName':all_week_day_data[i].shiftName,'sum':sum1})
        }
      }
    }

  let countsR = chart_data_req.reduce((prev, curr) => {
    let countR = prev.get(curr.shiftName) || 0;
    prev.set(curr.shiftName, curr.sum + countR);
    return prev;
  }, new Map());
  let reducedObjArrR = [...countsR].map(([shiftName, sum]) => {
    return {shiftName, sum}
  })
  chart_data_req=reducedObjArrR




var sun_chart_data=[],mon_chart_data=[],tue_chart_data=[],wed_chart_data=[],thu_chart_data=[],fri_chart_data=[],sat_chart_data=[]
var sun_chart_data_req=[],mon_chart_data_req=[],tue_chart_data_req=[],wed_chart_data_req=[],thu_chart_data_req=[],fri_chart_data_req=[],sat_chart_data_req=[]
for(var i=0;i<24;i++){
  sun_chart_data.push(chart_data[i])
  mon_chart_data.push(chart_data[i+24])
  tue_chart_data.push(chart_data[i+48])
  wed_chart_data.push(chart_data[i+72])
  thu_chart_data.push(chart_data[i+96])
  fri_chart_data.push(chart_data[i+120])
  sat_chart_data.push(chart_data[i+144])

}
sat_chart_data.push(chart_data[168])
sun_chart_data=sun_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
mon_chart_data=mon_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
tue_chart_data=tue_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
wed_chart_data=wed_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
thu_chart_data=thu_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
fri_chart_data=fri_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});
sat_chart_data=sat_chart_data.sort(function(a, b){return a.shiftName - b.shiftName});

for(var i=0;i<24;i++){
  sun_chart_data_req.push(chart_data_req[i])
  mon_chart_data_req.push(chart_data_req[i+24])
  tue_chart_data_req.push(chart_data_req[i+48])
  wed_chart_data_req.push(chart_data_req[i+72])
  thu_chart_data_req.push(chart_data_req[i+96])
  fri_chart_data_req.push(chart_data_req[i+120])
  sat_chart_data_req.push(chart_data_req[i+144])

}sat_chart_data_req.push(chart_data_req[168])
sun_chart_data_req=sun_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
mon_chart_data_req=mon_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
tue_chart_data_req=tue_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
wed_chart_data_req=wed_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
thu_chart_data_req=thu_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
fri_chart_data_req=fri_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});
sat_chart_data_req=sat_chart_data_req.sort(function(a, b){return a.shiftName - b.shiftName});



for(var i=0;i<this.current_day_summary_data.length;i++){

  this.result_R_G.push({'shiftName':this.current_day_summary_data[i].shiftName,'R':this.current_day_summary_data[i].shiftData.R,'G':this.current_day_summary_data[i].shiftData.G})
}
for(var i=0;i<all_char_data.length;i++){
  this.result_R_G.push(all_char_data[i])
}
var f
f=this.result_R_G.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName ))===i)
this.result_R_G=f

var diff_G
for(var i=0;i<this.result_R_G.length;i++){
  if(Number(this.result_R_G[i].shiftName) % 100 ==0 ){
  diff_G=Number(this.result_R_G[i].shiftName)+ - +700
  var sum1=0
  var result
  for(var j=0;j<this.result_R_G.length;j++){

    if(Number(this.result_R_G[j].shiftName)>=diff_G){
      if(Number(this.result_R_G[i].shiftName)>=Number(this.result_R_G[j].shiftName)){
        if((Number(this.result_R_G[i].shiftName) % 100 ==0) || Number(this.result_R_G[i].shiftName)===0 ){
        sum1=sum1+ + +this.result_R_G[j].G
        result={'shiftName':this.result_R_G[i].shiftName,'sum':sum1}
        }
      }
    }
  }
  this.chart_data_G.push({'shiftName':this.result_R_G[i].shiftName,'sum':sum1})
}
}

var diff_R
for(var i=0;i<this.result_R_G.length;i++){
  if(Number(this.result_R_G[i].shiftName) % 100 ==0 ){
  diff_R=Number(this.result_R_G[i].shiftName)+ - +700
  var sum2=0
  var result
  for(var j=0;j<this.result_R_G.length;j++){
    if(Number(this.result_R_G[j].shiftName)>=diff_R){
      if(Number(this.result_R_G[i].shiftName)>=Number(this.result_R_G[j].shiftName)){
        if((Number(this.result_R_G[i].shiftName) % 100 ==0  ) || Number(this.result_R_G[i].shiftName)===0 ){
        sum2=sum2+ + +this.result_R_G[j].R
        result={'shiftName':this.result_R_G[i].shiftName,'sum':sum2}
        }
      }
    }
  }
  this.chart_data_R.push({'shiftName':this.result_R_G[i].shiftName,'sum':sum2})
}
}



if(this.day_summary.id==0){
  this.chart_data_G=sun_chart_data
  this.chart_data_R=sun_chart_data_req
  this.chart_data_G.push(mon_chart_data[0])
  this.chart_data_R.push(mon_chart_data_req[0])
}
if(this.day_summary.id==1){
  this.chart_data_G=mon_chart_data
  this.chart_data_R=mon_chart_data_req
  this.chart_data_G.push(tue_chart_data[0])
  this.chart_data_R.push(tue_chart_data_req[0])
}
if(this.day_summary.id==2){
  this.chart_data_G=tue_chart_data
  this.chart_data_R=tue_chart_data_req
  this.chart_data_G.push(wed_chart_data[0])
  this.chart_data_R.push(wed_chart_data_req[0])
}
if(this.day_summary.id==3){
  this.chart_data_G=wed_chart_data
  this.chart_data_R=wed_chart_data_req
  this.chart_data_G.push(thu_chart_data[0])
  this.chart_data_R.push(thu_chart_data_req[0])
}
if(this.day_summary.id==4){
  this.chart_data_G=thu_chart_data
  this.chart_data_R=thu_chart_data_req
  this.chart_data_G.push(fri_chart_data[0])
  this.chart_data_R.push(fri_chart_data_req[0])
}
if(this.day_summary.id==5){
  this.chart_data_G=fri_chart_data
  this.chart_data_R=fri_chart_data_req
  this.chart_data_G.push(sat_chart_data[0])
  this.chart_data_R.push(sat_chart_data_req[0])
}
if(this.day_summary.id==6){
  this.chart_data_G=sat_chart_data
  this.chart_data_R=sat_chart_data_req
}

      this.chart_data_R.sort(function(a, b){return a.shiftName - b.shiftName});
      this.chart_data_G.sort(function(a, b){return a.shiftName - b.shiftName});


      this.Gen=[],this.Shift=[]
      for(var i=0;i<this.chart_data_G.length;i++){

        this.Gen.push(Number(this.chart_data_G[i].sum))
        if(this.day_summary.id==0){
          this.Shift.push(this.chart_data_G[i].shiftName)

        }
        else if(this.day_summary.id==1){
            temp_time=(Number(this.chart_data_G[i].shiftName+ - +2400)).toString()
            if(temp_time.length==1){
              temp_time='000'+temp_time
            }else if(temp_time.length==2){
              temp_time='00'+temp_time
            }else if(temp_time.length==3){
              temp_time='0'+temp_time
            }
            this.Shift.push(temp_time)
        }
        else if(this.day_summary.id==2){
          temp_time=(Number(this.chart_data_G[i].shiftName+ - +4800)).toString()
          if(temp_time.length==1){
            temp_time='000'+temp_time
          }else if(temp_time.length==2){
            temp_time='00'+temp_time
          }else if(temp_time.length==3){
            temp_time='0'+temp_time
          }
          this.Shift.push(temp_time)
        }
        else if(this.day_summary.id==3){
          temp_time=(Number(this.chart_data_G[i].shiftName+ - +7200)).toString()
          if(temp_time.length==1){
            temp_time='000'+temp_time
          }else if(temp_time.length==2){
            temp_time='00'+temp_time
          }else if(temp_time.length==3){
            temp_time='0'+temp_time
          }
          this.Shift.push(temp_time)
        }
        else if(this.day_summary.id==4){
          temp_time=(Number(this.chart_data_G[i].shiftName+ - +9600)).toString()
          if(temp_time.length==1){
            temp_time='000'+temp_time
          }else if(temp_time.length==2){
            temp_time='00'+temp_time
          }else if(temp_time.length==3){
            temp_time='0'+temp_time
          }
          this.Shift.push(temp_time)
        }
        else if(this.day_summary.id==5){
          temp_time=(Number(this.chart_data_G[i].shiftName+ - +12000)).toString()
          if(temp_time.length==1){
            temp_time='000'+temp_time
          }else if(temp_time.length==2){
            temp_time='00'+temp_time
          }else if(temp_time.length==3){
            temp_time='0'+temp_time
          }
          this.Shift.push(temp_time)
        }
        else if(this.day_summary.id==6){
          temp_time=(Number(this.chart_data_G[i].shiftName+ - +14400)).toString()
          if(temp_time.length==1){
            temp_time='000'+temp_time
          }else if(temp_time.length==2){
            temp_time='00'+temp_time
          }else if(temp_time.length==3){
            temp_time='0'+temp_time
          }
          this.Shift.push(temp_time)
        }
      }
      this.Req=[]
      for(var i=0;i<this.chart_data_R.length;i++){

        this.Req.push(Number(this.chart_data_R[i].sum))

      }

      // if(this.day_summary.id==0){
      //   this.Shift.push("2400")
      //     this.Req.push(Number(this.Req[0]))
      //     this.Gen.push(Number(this.Gen[0]))
      // }



this.chartUI()



        return this.totalCount,this.countSunSat,this.countSunMon,this.countMonTue,this.countTueWed,this.countWedThu,this.countThuFri,this.countFriSat,this.SunSat,this.SunMon,this.MonTue,this.TueWed,this.WedThu,this.ThuFri,this.FriSat


  }
  dismiss(){
    this.modalCtrl.dismiss();
  }
  chartUI(){

   const  lineChartOptions:ChartOptions = {
    responsive: true,
    layout: {

      padding: {
        top:0,
          bottom: 0,
      }
  },
    scales: { xAxes: [{

      gridLines: {

        display: true,


      },
      ticks: {
        beginAtZero: true,
        // autoSkip: false,
      },

    }],
    yAxes: [{

      gridLines: {
        display: true,

      },
      ticks: {
        beginAtZero: true,


      }
    }] }
  };
// this.data2=this.S;

 const lineChartData:ChartDataSets[] = [

  { data:this.Req,
    label:'Required',
    backgroundColor:'rgba(135,110,235,0.2)',
    borderColor: 'rgba(135,110,235,0.8)',
    steppedLine:true,
    fill:true,
    pointBackgroundColor:'rgba(135,110,235)'},
  { data: this.Gen,
    label:'Generated',
    backgroundColor:'rgba(255,0,0,0.2)',
    borderColor: 'rgba(255,0,0,0.2)',
    steppedLine:true,
    fill:true,
    pointBackgroundColor:'rgba(255,0,0)'}
];
   const lineChartLabels: Label[] =this.Shift;


 const lineChartLegend = true;
 const lineChartType:ChartType = 'line';
 this.final_dataset=[lineChartData , lineChartLabels ,lineChartOptions ,lineChartType ,lineChartLegend]
//  this.final_dataset.push({"day_name":this.day_summary})

 return this.final_dataset
  }
  async zoom(){

      const modal = await this.modalCtrl.create({
        component: FullscreenChartPage,
        cssClass: 'my-css',
        componentProps: { chartData: [this.final_dataset[0],this.final_dataset[1],this.final_dataset[2],this.final_dataset[3],this.final_dataset[4],this.day_summary,this.current_day_summary_data]},
        swipeToClose:true
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }
  //   if(this.hideChart==true){
  //     this.hideChart=false
  //   }else{
  //     this.hideChart=true
  //   }
  // }
  async changeShiftToPlot(){
    if(this.hide_chart_and_plot==true){
      this.hide_chart_and_plot=false
    }else{
      this.hide_chart_and_plot=true

    }
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
        }else{
          if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
            return String(this.allShiftData[i].startTime)
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
}
