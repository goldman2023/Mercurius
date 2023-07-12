import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { HeaderTitleForModalPageService } from 'src/app/dashboard/nav-bar-footer/header-title-for-modal-page.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { WorkLoadService } from 'src/app/services/work-load.service';

@Component({
  selector: 'app-view-total-day-shift-lines-data',
  templateUrl: './view-total-day-shift-lines-data.page.html',
  styleUrls: ['./view-total-day-shift-lines-data.page.scss'],
})
export class ViewTotalDayShiftLinesDataPage implements OnInit {
  currentShiftlineScheduleShiftDuration=8
  result1:any=[];
  result2:any=[];
  gData:any=[]
  totalShiftLine:any=[]
  ishidden = true;
  countSunSat=0
  countSunMon=0
  countMonTue=0
  countTueWed=0
  countWedThu=0
  countThuFri=0
  countFriSat=0
  SunSat=0
  SunMon=0
  MonTue=0
  TueWed=0
  WedThu=0
  ThuFri=0
  FriSat=0
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
  SunDayRequired = [];
  SunDayGenerated = [];
  totalSundiff: any;
  // Run = [];
  reqvsgenDataShiftTime=[];reqvsgenDataSun=[];reqvsgenDataMon=[];reqvsgenDataTue=[];reqvsgenDataWed=[];reqvsgenDataThu=[];reqvsgenDataFri=[];reqvsgenDataSat=[]
  totalSunGenerated: any;
  totalSunRequired: any;
  diffSunMid: any;
  diffSunDay: any;
  diffSunEve: any;
  validSunMid: boolean;
  validSunDay: boolean;
  validSunEve: boolean;
  mon: any;
  MonDayRequired= [];
  MonDayGenerated= [];
  diffMonMid: any;
  diffMonDay: any;
  diffMonEve: any;
  totalMonRequired: any;
  totalMonGenerated: any;
  totalMondiff: any;
  tue:any
  TueDayRequired= [];
  TueDayGenerated= [];
  diffTueMid: any;
  diffTueDay: any;
  diffTueEve: any;
  totalTueRequired: any;
  totalTueGenerated: any;
  totalTuediff: any;
  wed:any
  WedDayRequired= [];
  WedDayGenerated= [];
  diffWedMid: any;
  diffWedDay: any;
  diffWedEve: any;
  totalWedRequired: any;
  totalWedGenerated: any;
  totalWeddiff: any;
  thu:any
  ThuDayRequired= [];
  ThuDayGenerated= [];
  diffThuMid: any;
  diffThuDay: any;
  diffThuEve: any;
  totalThuRequired: any;
  totalThuGenerated: any;
  totalThudiff: any;
  fri:any
  FriDayRequired= [];
  FriDayGenerated= [];
  diffFriMid: any;
  diffFriDay: any;
  diffFriEve: any;
  totalFriRequired: any;
  totalFriGenerated: any;
  totalFridiff: any;
  sat:any
  SatDayRequired= [];
  SatDayGenerated= [];
  diffSatMid: any;
  diffSatDay: any;
  diffSatEve: any;
  totalSatRequired: any;
  totalSatGenerated: any;
  totalSatdiff: any;
  exportData=[] as any
  exportScheduleData=[] as any
  sunDay=[] as any
  defscheduleShift: any;
  sundAy= [] as any;
  mondAy= [] as any;
  tuedAy= [] as any;
  weddAy= [] as any;
  thudAy= [] as any;
  fridAy= [] as any;
  satdAy= [] as any;
  req: number=0;
  mon_1=0;mon_2=0;mon_3=0;mon_4=0;mon_5=0;diffDay_6_sun=0;diffDay_7_sun=0
  tue_1=0;tue_2=0;tue_3=0;tue_4=0;tue_5=0;diffDay_6_mon=0;diffDay_7_mon=0
  wed_1=0;wed_2=0;wed_3=0;wed_4=0;wed_5=0;diffDay_6_tue=0;diffDay_7_tue=0
  thu_1=0;thu_2=0;thu_3=0;thu_4=0;thu_5=0;diffDay_6_wed=0;diffDay_7_wed=0
  fri_1=0;fri_2=0;fri_3=0;fri_4=0;fri_5=0;diffDay_6_thu=0;diffDay_7_thu=0
  sat_1=0;sat_2=0;sat_3=0;sat_4=0;sat_5=0;diffDay_6_fri=0;diffDay_7_fri=0
  sun_1=0;sun_2=0;sun_3=0;sun_4=0;sun_5=0;diffDay_6_sat=0;diffDay_7_sat=0
  sun_mid: number=0;sun_day: number=0;sun_eve: number=0;
  mon_mid: number=0;mon_day: number=0;mon_eve: number=0;
  tue_mid: number=0;tue_day: number=0;tue_eve: number=0;
  wed_mid: number=0;wed_day: number=0;wed_eve: number=0;
  thu_mid: number=0;thu_day: number=0;thu_eve: number=0;
  fri_mid: number=0;fri_day: number=0;fri_eve: number=0;
  sat_mid: number=0;sat_day: number=0;sat_eve: number=0;
  workLoadData: any;
  shift: any;
  dayData=[] as any
allShiftData: any;
  allShiftName: any[];
  addShiftData: any
  gShift: any;
  demo=[] as any
  default_value=0
  testing
  schedule_id
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private route:Router,
    private headerTitleService: HeaderTitleForModalPageService,
    public viewCtrl: ModalController,
    private localData: LocalDataService,
    public dataService:WorkLoadService
  ) {
    this.schedule_id=navParams.get('schedule_id')

   }

  ngOnInit() {
    this.exportData=[]
    this.headerTitleService.setTitle('Day Shift');
    this.generatedEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
    this.requiredEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
    this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
    this.defscheduleShift=JSON.parse(this.localData.getItem('defaultScheduleShiftLine'))
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
    for(var i=0;i<this.allShiftData.length;i++){
      if(this.allShiftData[i].shiftCategory==3){
        for(var j=0;j<countsCustomizedSunDay.length;j++){
          if(Number(this.allShiftData[i].startTime)===Number(countsCustomizedSunDay[j].shiftDefintion) && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
          this.reqvsgenDataShiftTime.push({"sd":String(this.allShiftData[i].startTime),"sdu":this.allShiftData[i].shift_duration})
          }
        }
      for(var j=0;j<countsCustomizedSunDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedSunDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSunDay[j].shift_duration)){
          if(Number(countsCustomizedSunDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataSun.push({"R":0,"G":Number(countsCustomizedSunDay[j].totalEmp),"day":"Sun"})
          }else{
            this.reqvsgenDataSun.push({"R":Number(this.allShiftData[i].Sun),"G":Number(countsCustomizedSunDay[j].totalEmp),"day":"Sun"})
          }
        }
      }
      for(var j=0;j<countsCustomizedMonDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedMonDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedMonDay[j].shift_duration)){
          if(Number(countsCustomizedMonDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataMon.push({"R":0,"G":Number(countsCustomizedMonDay[j].totalEmp),"day":"Mon"})
          }else{
            this.reqvsgenDataMon.push({"R":Number(this.allShiftData[i].Mon),"G":Number(countsCustomizedMonDay[j].totalEmp),"day":"Mon"})
          }
        }
      }
      for(var j=0;j<countsCustomizedTueDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedTueDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedTueDay[j].shift_duration)){
          if(Number(countsCustomizedTueDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataTue.push({"R":0,"G":Number(countsCustomizedTueDay[j].totalEmp),"day":"Tue"})
          }else{
            this.reqvsgenDataTue.push({"R":Number(this.allShiftData[i].Tue),"G":Number(countsCustomizedTueDay[j].totalEmp),"day":"Tue"})
          }
        }
      }
      for(var j=0;j<countsCustomizedWedDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedWedDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedWedDay[j].shift_duration)){
          if(Number(countsCustomizedWedDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataWed.push({"R":0,"G":Number(countsCustomizedWedDay[j].totalEmp),"day":"Wed"})
          }else{
            this.reqvsgenDataWed.push({"R":Number(this.allShiftData[i].Wed),"G":Number(countsCustomizedWedDay[j].totalEmp),"day":"Wed"})
          }
        }
      }
      for(var j=0;j<countsCustomizedThuDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedThuDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedThuDay[j].shift_duration)){
          if(Number(countsCustomizedThuDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataThu.push({"R":0,"G":Number(countsCustomizedThuDay[j].totalEmp),"day":"Thu"})
          }else{
            this.reqvsgenDataThu.push({"R":Number(this.allShiftData[i].Thu),"G":Number(countsCustomizedThuDay[j].totalEmp),"day":"Thu"})
          }
        }
      }
      for(var j=0;j<countsCustomizedFriDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedFriDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedFriDay[j].shift_duration)){
          if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataFri.push({"R":0,"G":Number(countsCustomizedFriDay[j].totalEmp),"day":"Fri"})
          }else{
            this.reqvsgenDataFri.push({"R":Number(this.allShiftData[i].Fri),"G":Number(countsCustomizedFriDay[j].totalEmp),"day":"Fri"})
          }
        }
      }
      for(var j=0;j<countsCustomizedSatDay.length;j++){
        if(this.allShiftData[i].startTime===countsCustomizedSatDay[j].shiftDefintion && this.allShiftData[i].shiftCategory==3&& Number(this.allShiftData[i].shift_duration)===Number(countsCustomizedSatDay[j].shift_duration)){
          if(Number(countsCustomizedFriDay[j].shift_duration)!=Number(this.currentShiftlineScheduleShiftDuration)){
            this.reqvsgenDataSat.push({"R":0,"G":Number(countsCustomizedSatDay[j].totalEmp),"day":"Sat"})
          }else{
            this.reqvsgenDataSat.push({"R":Number(this.allShiftData[i].Sat),"G":Number(countsCustomizedSatDay[j].totalEmp),"day":"Sat"})
          }
        }
      }
    }
    }

  for(var k=0;k<this.reqvsgenDataShiftTime.length;k++){
        this.dayData={
              "shift":{
                "shiftTime":this.reqvsgenDataShiftTime[k].sd,
                "shift_duration":this.reqvsgenDataShiftTime[k].sdu
              },
              "midData23R":{
                "sun":this.reqvsgenDataSun[k].R,
                "mon":this.reqvsgenDataMon[k].R,
                "tue":this.reqvsgenDataTue[k].R,
                "wed":this.reqvsgenDataWed[k].R,
                "thu":this.reqvsgenDataThu[k].R,
                "fri":this.reqvsgenDataFri[k].R,
                "sat":this.reqvsgenDataSat[k].R,
            },
            "midData23G":{
              "sun":this.reqvsgenDataSun[k].G,
                "mon":this.reqvsgenDataMon[k].G,
                "tue":this.reqvsgenDataTue[k].G,
                "wed":this.reqvsgenDataWed[k].G,
                "thu":this.reqvsgenDataThu[k].G,
                "fri":this.reqvsgenDataFri[k].G,
                "sat":this.reqvsgenDataSat[k].G,
          },
          "diff":{
            "sun":this.diffDay_6_sun=this.reqvsgenDataSun[k].G+ - +this.reqvsgenDataSun[k].R,
              "mon":this.diffDay_6_mon=this.reqvsgenDataMon[k].G+ - +this.reqvsgenDataMon[k].R,
              "tue":this.diffDay_6_tue=this.reqvsgenDataTue[k].G+ - +this.reqvsgenDataTue[k].R,
              "wed":this.diffDay_6_wed=this.reqvsgenDataWed[k].G+ - +this.reqvsgenDataWed[k].R,
              "thu":this.diffDay_6_thu=this.reqvsgenDataThu[k].G+ - +this.reqvsgenDataThu[k].R,
              "fri":this.diffDay_6_fri=this.reqvsgenDataFri[k].G+ - +this.reqvsgenDataFri[k].R,
              "sat":this.diffDay_6_sat=this.reqvsgenDataSat[k].G+ - +this.reqvsgenDataSat[k].R,
          }
    }
    this.demo.push(this.dayData)
  }















    this.generatedEmpData.SUN_MID=this.sun_mid
    this.generatedEmpData.SUN_DAY=this.sun_day
    this.generatedEmpData.SUN_EVE=this.sun_eve
    this.generatedEmpData.MON_MID=this.mon_mid
    this.generatedEmpData.MON_DAY=this.mon_day
    this.generatedEmpData.MON_EVE=this.mon_eve
    this.generatedEmpData.TUE_MID=this.tue_mid
    this.generatedEmpData.TUE_DAY=this.tue_day
    this.generatedEmpData.TUE_EVE=this.tue_eve
    this.generatedEmpData.WED_MID=this.wed_mid
    this.generatedEmpData.WED_DAY=this.wed_day
    this.generatedEmpData.WED_EVE=this.wed_eve
    this.generatedEmpData.THU_MID=this.thu_mid
    this.generatedEmpData.THU_DAY=this.thu_day
    this.generatedEmpData.THU_EVE=this.thu_eve
    this.generatedEmpData.FRI_MID=this.fri_mid
    this.generatedEmpData.FRI_DAY=this.fri_day
    this.generatedEmpData.FRI_EVE=this.fri_eve
    this.generatedEmpData.SAT_MID=this.sat_mid
    this.generatedEmpData.SAT_DAY=this.sat_day
    this.generatedEmpData.SAT_EVE=this.sat_eve


    this.SunDayRequired.push(this.requiredEmpData.SUN_MID)
    this.SunDayRequired.push(this.requiredEmpData.SUN_DAY)
    this.SunDayRequired.push(this.requiredEmpData.SUN_EVE)
    this.SunDayGenerated.push(this.generatedEmpData.SUN_MID)
    this.SunDayGenerated.push(this.generatedEmpData.SUN_DAY)
    this.SunDayGenerated.push(this.generatedEmpData.SUN_EVE)
    this.diffSunMid=this.SunDayGenerated[0] + - + this.SunDayRequired[0]
    this.diffSunDay=this.SunDayGenerated[1] + - + this.SunDayRequired[1]
    this.diffSunEve=this.SunDayGenerated[2] + - + this.SunDayRequired[2]
    this.totalSunRequired= this.SunDayRequired[0] + + + this.SunDayRequired[1] + + + this.SunDayRequired[2]
    this.totalSunGenerated= this.SunDayGenerated[0] + + + this.SunDayGenerated[1] + + + this.SunDayGenerated[2]
    this.totalSundiff=this.totalSunGenerated+ - + this.totalSunRequired

    this.MonDayRequired.push(this.requiredEmpData.MON_MID)
    this.MonDayRequired.push(this.requiredEmpData.MON_DAY)
    this.MonDayRequired.push(this.requiredEmpData.MON_EVE)
    this.MonDayGenerated.push(this.generatedEmpData.MON_MID)
    this.MonDayGenerated.push(this.generatedEmpData.MON_DAY)
    this.MonDayGenerated.push(this.generatedEmpData.MON_EVE)
    this.diffMonMid=this.MonDayGenerated[0] + - + this.MonDayRequired[0]
    this.diffMonDay=this.MonDayGenerated[1] + - + this.MonDayRequired[1]
    this.diffMonEve=this.MonDayGenerated[2] + - + this.MonDayRequired[2]
    this.totalMonRequired= this.MonDayRequired[0] + + + this.MonDayRequired[1] + + + this.MonDayRequired[2]
    this.totalMonGenerated= this.MonDayGenerated[0] + + + this.MonDayGenerated[1] + + + this.MonDayGenerated[2]
    this.totalMondiff=this.totalMonGenerated+ - + this.totalMonRequired

    this.TueDayRequired.push(this.requiredEmpData.TUE_MID)
    this.TueDayRequired.push(this.requiredEmpData.TUE_DAY)
    this.TueDayRequired.push(this.requiredEmpData.TUE_EVE)
    this.TueDayGenerated.push(this.generatedEmpData.TUE_MID)
    this.TueDayGenerated.push(this.generatedEmpData.TUE_DAY)
    this.TueDayGenerated.push(this.generatedEmpData.TUE_EVE)
    this.diffTueMid=this.TueDayGenerated[0] + - + this.TueDayRequired[0]
    this.diffTueDay=this.TueDayGenerated[1] + - + this.TueDayRequired[1]
    this.diffTueEve=this.TueDayGenerated[2] + - + this.TueDayRequired[2]
    this.totalTueRequired= this.TueDayRequired[0] + + + this.TueDayRequired[1] + + + this.TueDayRequired[2]
    this.totalTueGenerated= this.TueDayGenerated[0] + + + this.TueDayGenerated[1] + + + this.TueDayGenerated[2]
    this.totalTuediff=this.totalTueGenerated+ - + this.totalTueRequired

    this.WedDayRequired.push(this.requiredEmpData.WED_MID)
    this.WedDayRequired.push(this.requiredEmpData.WED_DAY)
    this.WedDayRequired.push(this.requiredEmpData.WED_EVE)
    this.WedDayGenerated.push(this.generatedEmpData.WED_MID)
    this.WedDayGenerated.push(this.generatedEmpData.WED_DAY)
    this.WedDayGenerated.push(this.generatedEmpData.WED_EVE)
    this.diffWedMid=this.WedDayGenerated[0] + - + this.WedDayRequired[0]
    this.diffWedDay=this.WedDayGenerated[1] + - + this.WedDayRequired[1]
    this.diffWedEve=this.WedDayGenerated[2] + - + this.WedDayRequired[2]
    this.totalWedRequired= this.WedDayRequired[0] + + + this.WedDayRequired[1] + + + this.WedDayRequired[2]
    this.totalWedGenerated= this.WedDayGenerated[0] + + + this.WedDayGenerated[1] + + + this.WedDayGenerated[2]
    this.totalWeddiff=this.totalWedGenerated+ - + this.totalWedRequired

    this.ThuDayRequired.push(this.requiredEmpData.THU_MID)
    this.ThuDayRequired.push(this.requiredEmpData.THU_DAY)
    this.ThuDayRequired.push(this.requiredEmpData.THU_EVE)
    this.ThuDayGenerated.push(this.generatedEmpData.THU_MID)
    this.ThuDayGenerated.push(this.generatedEmpData.THU_DAY)
    this.ThuDayGenerated.push(this.generatedEmpData.THU_EVE)
    this.diffThuMid=this.ThuDayGenerated[0] + - + this.ThuDayRequired[0]
    this.diffThuDay=this.ThuDayGenerated[1] + - + this.ThuDayRequired[1]
    this.diffThuEve=this.ThuDayGenerated[2] + - + this.ThuDayRequired[2]
    this.totalThuRequired= this.ThuDayRequired[0] + + + this.ThuDayRequired[1] + + + this.ThuDayRequired[2]
    this.totalThuGenerated= this.ThuDayGenerated[0] + + + this.ThuDayGenerated[1] + + + this.ThuDayGenerated[2]
    this.totalThudiff=this.totalThuGenerated+ - + this.totalThuRequired
    this.FriDayRequired.push(this.requiredEmpData.FRI_MID)
    this.FriDayRequired.push(this.requiredEmpData.FRI_DAY)
    this.FriDayRequired.push(this.requiredEmpData.FRI_EVE)
    this.FriDayGenerated.push(this.generatedEmpData.FRI_MID)
    this.FriDayGenerated.push(this.generatedEmpData.FRI_DAY)
    this.FriDayGenerated.push(this.generatedEmpData.FRI_EVE)
    this.diffFriMid=this.FriDayGenerated[0] + - + this.FriDayRequired[0]
    this.diffFriDay=this.FriDayGenerated[1] + - + this.FriDayRequired[1]
    this.diffFriEve=this.FriDayGenerated[2] + - + this.FriDayRequired[2]
    this.totalFriRequired= this.FriDayRequired[0] + + + this.FriDayRequired[1] + + + this.FriDayRequired[2]
    this.totalFriGenerated= this.FriDayGenerated[0] + + + this.FriDayGenerated[1] + + + this.FriDayGenerated[2]
    this.totalFridiff=this.totalFriGenerated+ - + this.totalFriRequired

    this.SatDayRequired.push(this.requiredEmpData.SAT_MID)
    this.SatDayRequired.push(this.requiredEmpData.SAT_DAY)
    this.SatDayRequired.push(this.requiredEmpData.SAT_EVE)
    this.SatDayGenerated.push(this.generatedEmpData.SAT_MID)
    this.SatDayGenerated.push(this.generatedEmpData.SAT_DAY)
    this.SatDayGenerated.push(this.generatedEmpData.SAT_EVE)
    this.diffSatMid=this.SatDayGenerated[0] + - + this.SatDayRequired[0]
    this.diffSatDay=this.SatDayGenerated[1] + - + this.SatDayRequired[1]
    this.diffSatEve=this.SatDayGenerated[2] + - + this.SatDayRequired[2]
    this.totalSatRequired= this.SatDayRequired[0] + + + this.SatDayRequired[1] + + + this.SatDayRequired[2]
    this.totalSatGenerated= this.SatDayGenerated[0] + + + this.SatDayGenerated[1] + + + this.SatDayGenerated[2]
    this.totalSatdiff=this.totalSatGenerated+ - + this.totalSatRequired
  }
  dismiss(){
    this.modalCtrl.dismiss();
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
