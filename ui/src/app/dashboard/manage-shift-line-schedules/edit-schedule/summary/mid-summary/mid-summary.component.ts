import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import CanvasJS from 'canvasjs';
import { Chart ,ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { FullscreenChartPage } from 'src/app/dashboard/generated_schedule/summary/view-summary-day-category-wise/fullscreen-chart/fullscreen-chart.page';
import { HeaderTitleForModalPageService } from 'src/app/dashboard/nav-bar-footer/header-title-for-modal-page.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-mid-summary',
  templateUrl: './mid-summary.component.html',
  styleUrls: ['./mid-summary.component.scss'],
})
export class MidSummaryComponent implements OnInit {
  day_summary: any;
  summaryType: any;
  summaryData: any;
shiftTime=[]
sun=[]
mon=[]
tue=[]
wed=[]
thu=[]
fri=[]
sat=[]
totalSun=0;totalMon=0;totalTue=0;totalWed=0;totalThu=0;totalFri=0;totalSat=0;total_current_day_emp=0
current_day_summary_data=[];total_current_day_diff;total_current_day_def_emp=0
diffSun=0;diffMon=0;diffTue=0;diffWed=0;diffThu=0;diffFri=0;diffSat=0;
day_title
  hideCategoryWiseSummary: any;
  summaryDay
  result_R_G=[];
  chart_data_G=[];
  chart_data_R=[];
  Shift =[];
  Gen: any[];
  countSunSat: number;
  Req: any[];
  countSunMon: number;
  countMonTue: number;
  countTueWed: number;
  countWedThu: number;
  countThuFri: number;
  countFriSat: number;
  SunMon: any;
  SunSat: number;
  MonTue: any;
  TueWed: any;
  WedThu: any;
  ThuFri: any;
  current_day
  FriSat: any;
  summaryHeader
  defaultWorkLoadWithoutGeneratedSchedule=true
  sun_day=[];mon_day=[];tue_day=[];wed_day=[];thu_day=[];fri_day=[];sat_day=[]
  final_dataset;
  hide_chart_and_plot=false;
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private route:Router,
    public alertController: AlertController,
    private elementRef: ElementRef,
    private headerTitleService: HeaderTitleForModalPageService,
    public viewCtrl: ModalController,
    public dataService:WorkLoadService
  ) {
    this.summaryType=navParams.get('summaryType')
    this.summaryData=navParams.get('summaryData')
    this.defaultWorkLoadWithoutGeneratedSchedule=navParams.get('default')
    if(this.summaryType!=='Mid Shift' || this.summaryType!=="Day Shift" ||this.summaryType!=="Eve Shift"){
      this.summaryDay=navParams.get('day')
    }
  }

  ngOnInit() {

    if(this.summaryType=='Mid Shift' || this.summaryType==="Day Shift" ||this.summaryType==="Eve Shift"){
      this.headerTitleService.setTitle(this.summaryType);
      this.summaryHeader=this.summaryType
      this.hideCategoryWiseSummary=true

    this.shiftTime=[]
    this.sun=[]
    this.mon=[]
    this.tue=[]
    this.wed=[]
    this.thu=[]
    this.fri=[]
    this.sat=[]
    var defSun=0,defMon=0,defTue=0,defWed=0,defThu=0,defFri=0,defSat=0;
    this.totalSun=0;this.totalMon=0;this.totalTue=0;this.totalWed=0;this.totalThu=0;this.totalFri=0;this.totalSat=0
    var r = [],r1=[]
    this.summaryData.forEach((e) =>  { if (e['shiftCategory'] === 1){r1.unshift(e);}else{r.push(e);}})
              r1=r1.sort((a,b) => Number(b.shiftTime) - Number(a.shiftTime));
              r=r.sort((a,b) => Number(a.shiftTime) - Number(b.shiftTime));
              this.summaryData=r1.concat(r);
              // this.summaryData=this.summaryData.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));
    for(var i=0;i<this.summaryData.length;i++){
      this.shiftTime.push({"sd":this.summaryData[i].shiftTime,"sdu":this.summaryData[i].shift_duration})
      this.sun.push({"sun":this.summaryData[i].Sun,"diff":this.summaryData[i].diffSun})
      this.mon.push({"mon":this.summaryData[i].Mon,"diff":this.summaryData[i].diffMon})
      this.tue.push({"tue":this.summaryData[i].Tue,"diff":this.summaryData[i].diffTue})
      this.wed.push({"wed":this.summaryData[i].Wed,"diff":this.summaryData[i].diffWed})
      this.thu.push({"thu":this.summaryData[i].Thu,"diff":this.summaryData[i].diffThu})
      this.fri.push({"fri":this.summaryData[i].Fri,"diff":this.summaryData[i].diffFri})
      this.sat.push({"sat":this.summaryData[i].Sat,"diff":this.summaryData[i].diffSat})
      this.totalSun=this.totalSun+ + +this.summaryData[i].Sun
      this.totalMon=this.totalMon+ + +this.summaryData[i].Mon
      this.totalTue=this.totalTue+ + +this.summaryData[i].Tue
      this.totalWed=this.totalWed+ + +this.summaryData[i].Wed
      this.totalThu=this.totalThu+ + +this.summaryData[i].Thu
      this.totalFri=this.totalFri+ + +this.summaryData[i].Fri
      this.totalSat=this.totalSat+ + +this.summaryData[i].Sat

      defSun=defSun+ + +this.summaryData[i].defSun
      defMon=defMon+ + +this.summaryData[i].defMon
      defTue=defTue+ + +this.summaryData[i].defTue
      defWed=defWed+ + +this.summaryData[i].defWed
      defThu=defThu+ + +this.summaryData[i].defThu
      defFri=defFri+ + +this.summaryData[i].defFri
      defSat=defSat+ + +this.summaryData[i].defSat
    }
    this.diffSun=this.totalSun+ - +defSun
    this.diffMon=this.totalMon+ - +defMon
    this.diffTue=this.totalTue+ - +defTue
    this.diffWed=this.totalWed+ - +defWed
    this.diffThu=this.totalThu+ - +defThu
    this.diffFri=this.totalFri+ - +defFri
    this.diffSat=this.totalSat+ - +defSat
  }else{
    this.hideCategoryWiseSummary=false
    this.total_current_day_diff=0
    this.total_current_day_emp=0
    this.total_current_day_def_emp=0
    this.current_day_summary_data=[]

      if(this.summaryDay.day=="Sun"){
        this.headerTitleService.setTitle("Sunday");
        this.day_title="S"
        this.current_day="Sunday"

        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Sun,"diff":this.summaryData.mid[i].diffSun,"def":this.summaryData.mid[i].defSun,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Sun,"diff":this.summaryData.mid_day[i].diffSun,"def":this.summaryData.mid_day[i].defSun,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Sun,"diff":this.summaryData.day[i].diffSun,"def":this.summaryData.day[i].defSun,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Sun,"diff":this.summaryData.day_eve[i].diffSun,"def":this.summaryData.day_eve[i].defSun,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Sun,"diff":this.summaryData.eve[i].diffSun,"def":this.summaryData.eve[i].defSun,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Sun,"diff":this.summaryData.eve_mid[i].diffSun,"def":this.summaryData.eve_mid[i].defSun,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp
      }
      else if(this.summaryDay.day=="Mon"){
        this.headerTitleService.setTitle("Monday");
        this.current_day="Monday"
        this.day_title="M"

        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Mon,"diff":this.summaryData.mid[i].diffMon,"def":this.summaryData.mid[i].defMon,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Mon,"diff":this.summaryData.mid_day[i].diffMon,"def":this.summaryData.mid_day[i].defMon,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Mon,"diff":this.summaryData.day[i].diffMon,"def":this.summaryData.day[i].defMon,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Mon,"diff":this.summaryData.day_eve[i].diffMon,"def":this.summaryData.day_eve[i].defMon,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Mon,"diff":this.summaryData.eve[i].diffMon,"def":this.summaryData.eve[i].defMon,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Mon,"diff":this.summaryData.eve_mid[i].diffMon,"def":this.summaryData.eve_mid[i].defMon,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp

      }

      else if(this.summaryDay.day=="Tue"){
        this.headerTitleService.setTitle("Tuesday");
        this.current_day="Tuesday"
        this.day_title="T"
        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Tue,"diff":this.summaryData.mid[i].diffTue,"def":this.summaryData.mid[i].defTue,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Tue,"diff":this.summaryData.mid_day[i].diffTue,"def":this.summaryData.mid_day[i].defTue,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Tue,"diff":this.summaryData.day[i].diffTue,"def":this.summaryData.day[i].defTue,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Tue,"diff":this.summaryData.day_eve[i].diffTue,"def":this.summaryData.day_eve[i].defTue,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Tue,"diff":this.summaryData.eve[i].diffTue,"def":this.summaryData.eve[i].defTue,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Tue,"diff":this.summaryData.eve_mid[i].diffTue,"def":this.summaryData.eve_mid[i].defTue,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp

      }
      else if(this.summaryDay.day=="Wed"){
        this.day_title="W"
        this.headerTitleService.setTitle("Wednesday");
        this.current_day="Wednesday"
        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Wed,"diff":this.summaryData.mid[i].diffWed,"def":this.summaryData.mid[i].defWed,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Wed,"diff":this.summaryData.mid_day[i].diffWed,"def":this.summaryData.mid_day[i].defWed,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Wed,"diff":this.summaryData.day[i].diffWed,"def":this.summaryData.day[i].defWed,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Wed,"diff":this.summaryData.day_eve[i].diffWed,"def":this.summaryData.day_eve[i].defWed,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Wed,"diff":this.summaryData.eve[i].diffWed,"def":this.summaryData.eve[i].defWed,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Wed,"diff":this.summaryData.eve_mid[i].diffWed,"def":this.summaryData.eve_mid[i].defWed,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp
      }
      else if(this.summaryDay.day=="Thu"){
        this.day_title="T"
        this.current_day="Thursday"
        this.headerTitleService.setTitle("Thursday");
        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Thu,"diff":this.summaryData.mid[i].diffThu,"def":this.summaryData.mid[i].defThu,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Thu,"diff":this.summaryData.mid_day[i].diffThu,"def":this.summaryData.mid_day[i].defThu,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Thu,"diff":this.summaryData.day[i].diffThu,"def":this.summaryData.day[i].defThu,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Thu,"diff":this.summaryData.day_eve[i].diffThu,"def":this.summaryData.day_eve[i].defThu,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Thu,"diff":this.summaryData.eve[i].diffThu,"def":this.summaryData.eve[i].defThu,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Thu,"diff":this.summaryData.eve_mid[i].diffThu,"def":this.summaryData.eve_mid[i].defThu,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp
      }
      else if(this.summaryDay.day=="Fri"){
        this.day_title="F"
        this.headerTitleService.setTitle("Friday");
        this.current_day="Friday"
        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Fri,"diff":this.summaryData.mid[i].diffFri,"def":this.summaryData.mid[i].defFri,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Fri,"diff":this.summaryData.mid_day[i].diffFri,"def":this.summaryData.mid_day[i].defFri,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Fri,"diff":this.summaryData.day[i].diffFri,"def":this.summaryData.day[i].defFri,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Fri,"diff":this.summaryData.day_eve[i].diffFri,"def":this.summaryData.day_eve[i].defFri,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Fri,"diff":this.summaryData.eve[i].diffFri,"def":this.summaryData.eve[i].defFri,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Fri,"diff":this.summaryData.eve_mid[i].diffFri,"def":this.summaryData.eve_mid[i].defFri,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp
      }
      else if(this.summaryDay.day=="Sat"){
        this.headerTitleService.setTitle("Saturday");
        this.current_day="Saturday"
        this.day_title="S"
        for(var i=0;i<this.summaryData.mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Sat,"diff":this.summaryData.mid[i].diffSat,"def":this.summaryData.mid[i].defSat,"shift_duration":this.summaryData.mid[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.mid_day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Sat,"diff":this.summaryData.mid_day[i].diffSat,"def":this.summaryData.mid_day[i].defSat,"shift_duration":this.summaryData.mid_day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Sat,"diff":this.summaryData.day[i].diffSat,"def":this.summaryData.day[i].defSat,"shift_duration":this.summaryData.day[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.day_eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Sat,"diff":this.summaryData.day_eve[i].diffSat,"def":this.summaryData.day_eve[i].defSat,"shift_duration":this.summaryData.day_eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Sat,"diff":this.summaryData.eve[i].diffSat,"def":this.summaryData.eve[i].defSat,"shift_duration":this.summaryData.eve[i].shift_duration})
        }
        for(var i=0;i<this.summaryData.eve_mid.length;i++){
          this.current_day_summary_data.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Sat,"diff":this.summaryData.eve_mid[i].diffSat,"def":this.summaryData.eve_mid[i].defSat,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
        }
        for(var i=0;i<this.current_day_summary_data.length;i++){
          this.total_current_day_emp=this.total_current_day_emp+ + +this.current_day_summary_data[i].emp
          this.total_current_day_def_emp=this.total_current_day_def_emp+ + +this.current_day_summary_data[i].def

        }
        this.total_current_day_diff=this.total_current_day_emp+ - +this.total_current_day_def_emp









      }
      var r1=[],r=[]

      this.current_day_summary_data.forEach((e) =>  { if (Number(e['shiftTime']) >= 2300){r1.unshift(e);}else{r.push(e);}})
              r1=r1.sort((a,b) => Number(b.shiftTime) - Number(a.shiftTime));
              r=r.sort((a,b) => Number(a.shiftTime) - Number(b.shiftTime));
              this.current_day_summary_data=r1.concat(r);
              // this.summaryData=this.summaryData.sort((a,b) => Number(a.shift_duration) - Number(b.shift_duration));

      this.summaryHeader=this.current_day
      this.sun_day=[];this.mon_day=[];this.tue_day=[];this.wed_day=[];this.thu_day=[];this.fri_day=[];this.sat_day=[]
//Sun
for(var i=0;i<this.summaryData.mid.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Sun,"diff":this.summaryData.mid[i].diffSun,"def":this.summaryData.mid[i].defSun,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Sun,"diff":this.summaryData.mid_day[i].diffSun,"def":this.summaryData.mid_day[i].defSun,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Sun,"diff":this.summaryData.day[i].diffSun,"def":this.summaryData.day[i].defSun,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Sun,"diff":this.summaryData.day_eve[i].diffSun,"def":this.summaryData.day_eve[i].defSun,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Sun,"diff":this.summaryData.eve[i].diffSun,"def":this.summaryData.eve[i].defSun,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.sun_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Sun,"diff":this.summaryData.eve_mid[i].diffSun,"def":this.summaryData.eve_mid[i].defSun,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}
//mon
for(var i=0;i<this.summaryData.mid.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Mon,"diff":this.summaryData.mid[i].diffMon,"def":this.summaryData.mid[i].defMon,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Mon,"diff":this.summaryData.mid_day[i].diffMon,"def":this.summaryData.mid_day[i].defMon,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Mon,"diff":this.summaryData.day[i].diffMon,"def":this.summaryData.day[i].defMon,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Mon,"diff":this.summaryData.day_eve[i].diffMon,"def":this.summaryData.day_eve[i].defMon,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Mon,"diff":this.summaryData.eve[i].diffMon,"def":this.summaryData.eve[i].defMon,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.mon_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Mon,"diff":this.summaryData.eve_mid[i].diffMon,"def":this.summaryData.eve_mid[i].defMon,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}

//tue
for(var i=0;i<this.summaryData.mid.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Tue,"diff":this.summaryData.mid[i].diffTue,"def":this.summaryData.mid[i].defTue,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Tue,"diff":this.summaryData.mid_day[i].diffTue,"def":this.summaryData.mid_day[i].defTue,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Tue,"diff":this.summaryData.day[i].diffTue,"def":this.summaryData.day[i].defTue,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Tue,"diff":this.summaryData.day_eve[i].diffTue,"def":this.summaryData.day_eve[i].defTue,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Tue,"diff":this.summaryData.eve[i].diffTue,"def":this.summaryData.eve[i].defTue,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.tue_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Tue,"diff":this.summaryData.eve_mid[i].diffTue,"def":this.summaryData.eve_mid[i].defTue,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}

//wed
for(var i=0;i<this.summaryData.mid.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Wed,"diff":this.summaryData.mid[i].diffWed,"def":this.summaryData.mid[i].defWed,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Wed,"diff":this.summaryData.mid_day[i].diffWed,"def":this.summaryData.mid_day[i].defWed,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Wed,"diff":this.summaryData.day[i].diffWed,"def":this.summaryData.day[i].defWed,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Wed,"diff":this.summaryData.day_eve[i].diffWed,"def":this.summaryData.day_eve[i].defWed,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Wed,"diff":this.summaryData.eve[i].diffWed,"def":this.summaryData.eve[i].defWed,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.wed_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Wed,"diff":this.summaryData.eve_mid[i].diffWed,"def":this.summaryData.eve_mid[i].defWed,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}
//thu
for(var i=0;i<this.summaryData.mid.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Thu,"diff":this.summaryData.mid[i].diffThu,"def":this.summaryData.mid[i].defThu,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Thu,"diff":this.summaryData.mid_day[i].diffThu,"def":this.summaryData.mid_day[i].defThu,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Thu,"diff":this.summaryData.day[i].diffThu,"def":this.summaryData.day[i].defThu,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Thu,"diff":this.summaryData.day_eve[i].diffThu,"def":this.summaryData.day_eve[i].defThu,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Thu,"diff":this.summaryData.eve[i].diffThu,"def":this.summaryData.eve[i].defThu,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.thu_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Thu,"diff":this.summaryData.eve_mid[i].diffThu,"def":this.summaryData.eve_mid[i].defThu,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}

//fri
for(var i=0;i<this.summaryData.mid.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Fri,"diff":this.summaryData.mid[i].diffFri,"def":this.summaryData.mid[i].defFri,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Fri,"diff":this.summaryData.mid_day[i].diffFri,"def":this.summaryData.mid_day[i].defFri,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Fri,"diff":this.summaryData.day[i].diffFri,"def":this.summaryData.day[i].defFri,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Fri,"diff":this.summaryData.day_eve[i].diffFri,"def":this.summaryData.day_eve[i].defFri,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Fri,"diff":this.summaryData.eve[i].diffFri,"def":this.summaryData.eve[i].defFri,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.fri_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Fri,"diff":this.summaryData.eve_mid[i].diffFri,"def":this.summaryData.eve_mid[i].defFri,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}
//sat
for(var i=0;i<this.summaryData.mid.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.mid[i].shiftTime,"emp":this.summaryData.mid[i].Sat,"diff":this.summaryData.mid[i].diffSat,"def":this.summaryData.mid[i].defSat,"shift_duration":this.summaryData.mid[i].shift_duration})
}
for(var i=0;i<this.summaryData.mid_day.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.mid_day[i].shiftTime,"emp":this.summaryData.mid_day[i].Sat,"diff":this.summaryData.mid_day[i].diffSat,"def":this.summaryData.mid_day[i].defSat,"shift_duration":this.summaryData.mid_day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.day[i].shiftTime,"emp":this.summaryData.day[i].Sat,"diff":this.summaryData.day[i].diffSat,"def":this.summaryData.day[i].defSat,"shift_duration":this.summaryData.day[i].shift_duration})
}
for(var i=0;i<this.summaryData.day_eve.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.day_eve[i].shiftTime,"emp":this.summaryData.day_eve[i].Sat,"diff":this.summaryData.day_eve[i].diffSat,"def":this.summaryData.day_eve[i].defSat,"shift_duration":this.summaryData.day_eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.eve[i].shiftTime,"emp":this.summaryData.eve[i].Sat,"diff":this.summaryData.eve[i].diffSat,"def":this.summaryData.eve[i].defSat,"shift_duration":this.summaryData.eve[i].shift_duration})
}
for(var i=0;i<this.summaryData.eve_mid.length;i++){
  this.sat_day.push({"shiftTime":this.summaryData.eve_mid[i].shiftTime,"emp":this.summaryData.eve_mid[i].Sat,"diff":this.summaryData.eve_mid[i].diffSat,"def":this.summaryData.eve_mid[i].defSat,"shift_duration":this.summaryData.eve_mid[i].shift_duration})
}
      this.viewChart()
    }
  }


  viewChart(){
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
    //Sun

    for(var i=0;i<this.sun_day.length;i++){
      all_week_day_data_sun.push({"shiftName":this.sun_day[i].shiftTime,"shiftData":{'R':this.sun_day[i].def,'G':this.sun_day[i].emp},"diff":Number(this.sun_day[i].diff),"shift_duration":Number(this.sun_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_sun.length;i++){

      result_R_G_sun.push({'shiftName':all_week_day_data_sun[i].shiftName,'R':all_week_day_data_sun[i].shiftData.R,'G':all_week_day_data_sun[i].shiftData.G,"shift_duration":all_week_day_data_sun[i].shift_duration})
    }

    for(var i=0;i<all_char_data.length;i++){
        result_R_G_sun.push(all_char_data[i])
    }

    f_sun=result_R_G_sun.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
    f_sun=f_sun.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_sun=f_sun

    //Mon
    var all_week_day_data_mon=[],result_R_G_mon=[],f_mon
    for(var i=0;i<this.mon_day.length;i++){
      all_week_day_data_mon.push({"shiftName":this.mon_day[i].shiftTime,"shiftData":{'R':this.mon_day[i].def,'G':this.mon_day[i].emp},"diff":Number(this.mon_day[i].diff),"shift_duration":Number(this.mon_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_mon.length;i++){

      result_R_G_mon.push({'shiftName':all_week_day_data_mon[i].shiftName,'R':all_week_day_data_mon[i].shiftData.R,'G':all_week_day_data_mon[i].shiftData.G,"shift_duration":all_week_day_data_mon[i].shift_duration})
    }

    for(var i=0;i<all_char_data.length;i++){
        result_R_G_mon.push(all_char_data[i])
    }
    f_mon=result_R_G_mon.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration ))===i)
    f_mon=f_mon.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_mon=[]

    for(var i=0;i<f_mon.length;i++){
      temp_time=Number(f_mon[i].shiftName)+ + + 2400;
      result_R_G_mon.push({'shiftName':temp_time,'R':f_mon[i].R,'G':f_mon[i].G,"shift_duration":f_mon[i].shift_duration})
    }


    //Tue
    var all_week_day_data_tue=[],result_R_G_tue=[],f_tue
    for(var i=0;i<this.tue_day.length;i++){
      all_week_day_data_tue.push({"shiftName":this.tue_day[i].shiftTime,"shiftData":{'R':this.tue_day[i].def,'G':this.tue_day[i].emp},"diff":Number(this.tue_day[i].diff),"shift_duration":Number(this.tue_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_tue.length;i++){

      result_R_G_tue.push({'shiftName':all_week_day_data_tue[i].shiftName,'R':all_week_day_data_tue[i].shiftData.R,'G':all_week_day_data_tue[i].shiftData.G,"shift_duration":all_week_day_data_tue[i].shift_duration})
    }
    for(var i=0;i<all_char_data.length;i++){
        result_R_G_tue.push(all_char_data[i])
    }
    f_tue=result_R_G_tue.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
    f_tue=f_tue.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_tue=[]

    for(var i=0;i<f_tue.length;i++){
      temp_time=Number(f_tue[i].shiftName)+ + + 4800;
      result_R_G_tue.push({'shiftName':temp_time,'R':f_tue[i].R,'G':f_tue[i].G,"shift_duration":f_tue[i].shift_duration})
    }


    //Wed
    var all_week_day_data_wed=[],result_R_G_wed=[],f_wed
    for(var i=0;i<this.wed_day.length;i++){
      all_week_day_data_wed.push({"shiftName":this.wed_day[i].shiftTime,"shiftData":{'R':this.wed_day[i].def,'G':this.wed_day[i].emp},"diff":Number(this.wed_day[i].diff),"shift_duration":Number(this.wed_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_wed.length;i++){

      result_R_G_wed.push({'shiftName':all_week_day_data_wed[i].shiftName,'R':all_week_day_data_wed[i].shiftData.R,'G':all_week_day_data_wed[i].shiftData.G,"shift_duration":all_week_day_data_wed[i].shift_duration})
    }
    for(var i=0;i<all_char_data.length;i++){
        result_R_G_wed.push(all_char_data[i])
    }
    f_wed=result_R_G_wed.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
    f_wed=f_wed.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_wed=[]

    for(var i=0;i<f_wed.length;i++){
      temp_time=Number(f_wed[i].shiftName)+ + + 7200;
      result_R_G_wed.push({'shiftName':temp_time,'R':f_wed[i].R,'G':f_wed[i].G,"shift_duration":f_wed[i].shift_duration})
    }

    //Thu
    var all_week_day_data_thu=[],result_R_G_thu=[],f_thu
    for(var i=1;i<this.thu_day.length;i++){
      all_week_day_data_thu.push({"shiftName":this.thu_day[i].shiftTime,"shiftData":{'R':this.thu_day[i].def,'G':this.thu_day[i].emp},"diff":Number(this.thu_day[i].diff),"shift_duration":Number(this.thu_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_thu.length;i++){

      result_R_G_thu.push({'shiftName':all_week_day_data_thu[i].shiftName,'R':all_week_day_data_thu[i].shiftData.R,'G':all_week_day_data_thu[i].shiftData.G,"shift_duration":all_week_day_data_thu[i].shift_duration})
    }
    for(var i=0;i<all_char_data.length;i++){
        result_R_G_thu.push(all_char_data[i])
    }
    f_thu=result_R_G_thu.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
    f_thu=f_thu.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_thu=[]

    for(var i=0;i<f_thu.length;i++){
      temp_time=Number(f_thu[i].shiftName)+ + + 9600;
      result_R_G_thu.push({'shiftName':temp_time,'R':f_thu[i].R,'G':f_thu[i].G,"shift_duration":f_thu[i].shift_duration})
    }

    //Fri
    var all_week_day_data_fri=[],result_R_G_fri=[],f_fri
    for(var i=0;i<this.fri_day.length;i++){
      all_week_day_data_fri.push({"shiftName":this.fri_day[i].shiftTime,"shiftData":{'R':this.fri_day[i].def,'G':this.fri_day[i].emp},"diff":Number(this.fri_day[i].diff),"shift_duration":Number(this.fri_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_fri.length;i++){

      result_R_G_fri.push({'shiftName':this.sat_day[i].shiftName,'R':all_week_day_data_fri[i].shiftData.R,'G':all_week_day_data_fri[i].shiftData.G ,"shift_duration":all_week_day_data_fri[i].shift_duration})
    }
    for(var i=0;i<all_char_data.length;i++){
        result_R_G_fri.push(all_char_data[i])
    }
    f_fri=result_R_G_fri.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
    f_fri=f_fri.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    result_R_G_fri=[]

    for(var i=0;i<f_fri.length;i++){
      temp_time=Number(f_fri[i].shiftName)+ + + 12000;
      result_R_G_fri.push({'shiftName':temp_time,'R':f_fri[i].R,'G':f_fri[i].G,"shift_duration":f_fri[i].shift_duration})
    }

    //Sat
    var all_week_day_data_sat=[],result_R_G_sat=[],f_sat
    for(var i=1;i<this.current_day_summary_data.length;i++){
      all_week_day_data_sat.push({"shiftName":this.sat_day[i].shiftTime,"shiftData":{'R':this.sat_day[i].def,'G':this.current_day_summary_data[i].emp},"diff":Number(this.sat_day[i].diff),"shift_duration":Number(this.sat_day[i].shift_duration)})
    }
    for(var i=0;i<all_week_day_data_sat.length;i++){

      result_R_G_sat.push({'shiftName':all_week_day_data_sat[i].shiftName,'R':all_week_day_data_sat[i].shiftData.R,'G':all_week_day_data_sat[i].shiftData.G,"shift_duration":all_week_day_data_sat[i].shift_duration})
    }
    for(var i=0;i<all_char_data.length;i++){
        result_R_G_sat.push(all_char_data[i])
    }
    f_sat=result_R_G_sat.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName && t.shift_duration === v.shift_duration))===i)
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

    // Gen
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


    chart_data=chart_data.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
    chart_data_req=chart_data_req.sort(function(a, b){return Number(a.shiftName) - Number(b.shiftName)});
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
      this.result_R_G.push({'shiftName':this.current_day_summary_data[i].shiftName,'R':this.current_day_summary_data[i].def,'G':this.current_day_summary_data[i].emp})
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


var day_summary_id=this.summaryDay.id
    if(day_summary_id==0){
      this.chart_data_G=sun_chart_data
      this.chart_data_R=sun_chart_data_req
      this.chart_data_G.push(mon_chart_data[0])
      this.chart_data_R.push(mon_chart_data_req[0])
    }
    if(day_summary_id==1){
      this.chart_data_G=mon_chart_data
      this.chart_data_R=mon_chart_data_req
      this.chart_data_G.push(tue_chart_data[0])
      this.chart_data_R.push(tue_chart_data_req[0])
    }
    if(day_summary_id==2){
      this.chart_data_G=tue_chart_data
      this.chart_data_R=tue_chart_data_req
      this.chart_data_G.push(wed_chart_data[0])
      this.chart_data_R.push(wed_chart_data_req[0])
    }
    if(day_summary_id==3){
      this.chart_data_G=wed_chart_data
      this.chart_data_R=wed_chart_data_req
      this.chart_data_G.push(thu_chart_data[0])
      this.chart_data_R.push(thu_chart_data_req[0])
    }
    if(day_summary_id==4){
      this.chart_data_G=thu_chart_data
      this.chart_data_R=thu_chart_data_req
      this.chart_data_G.push(fri_chart_data[0])
      this.chart_data_R.push(fri_chart_data_req[0])
    }
    if(day_summary_id==5){
      this.chart_data_G=fri_chart_data
      this.chart_data_R=fri_chart_data_req
      this.chart_data_G.push(sat_chart_data[0])
      this.chart_data_R.push(sat_chart_data_req[0])
    }
    if(day_summary_id==6){
      this.chart_data_G=sat_chart_data
      this.chart_data_R=sat_chart_data_req
    }

          this.chart_data_R.sort(function(a, b){return a.shiftName - b.shiftName});
          this.chart_data_G.sort(function(a, b){return a.shiftName - b.shiftName});


          this.Gen=[],this.Shift=[]
          for(var i=0;i<this.chart_data_G.length;i++){

            this.Gen.push(Number(this.chart_data_G[i].sum))
            if(day_summary_id==0){
              this.Shift.push(this.chart_data_G[i].shiftName)

            }
            else if(day_summary_id==1){
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
            else if(day_summary_id==2){
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
            else if(day_summary_id==3){
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
            else if(day_summary_id==4){
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
            else if(day_summary_id==5){
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
            else if(day_summary_id==6){
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

// this.sChart()

            return this.totalSun,this.countSunSat,this.countSunMon,this.countMonTue,this.countTueWed,this.countWedThu,this.countThuFri,this.countFriSat,this.SunSat,this.SunMon,this.MonTue,this.TueWed,this.WedThu,this.ThuFri,this.FriSat


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
     return this.final_dataset
    }

    async changeShiftToPlot(){
      if(this.hide_chart_and_plot==true){
        this.hide_chart_and_plot=false
      }else{
        this.hide_chart_and_plot=true

        // const alert = await this.alertController.create({
        //   cssClass: 'my-custom-class',
        //   header: 'Coming soon...',
        //   message: "This feature is coming soon!!",
        //   buttons: ['OK']
        // });

        // await alert.present();
      }
    }
  async zoom(){
  const modal = await this.modalCtrl.create({
    component: FullscreenChartPage,
    cssClass: 'my-css',
    componentProps: { chartData: [this.final_dataset[0],this.final_dataset[1],this.final_dataset[2],this.final_dataset[3],this.final_dataset[4],this.summaryDay.id,this.current_day_summary_data]},
    swipeToClose:true
    // componentProps: { scheduleData: scheduleShift }

  });
  // this.scheduleShift=EditScheduleDataPage.data5

  return await modal.present();
}
sChart(){
  new Chart(<HTMLCanvasElement>document.getElementById("mixed-chart"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050"],
      datasets: [{
          label: "Europe",
          type: "line",
          borderColor: "#8e5ea2",
          data: [408,547,675,734],
          fill: false
        }, {
          label: "Africa",
          type: "line",
          borderColor: "#3e95cd",
          data: [133,221,783,2478],
          fill: false
        }, {
          label: "Europe",
          type: "bar",
          backgroundColor: "rgba(0,0,0,0.2)",
          data: [408,547,675,734],
        }, {
          label: "Africa",
          type: "bar",
          backgroundColor: "rgba(0,0,0,0.2)",
          data: [133,221,783,2478]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Population growth (millions): Europe & Africa'
      },
      legend: { display: false }
    }
  });
  }
}

