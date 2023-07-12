import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, NavController, NavParams } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from '../../header-title.service';


import { BidRoundsService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-rounds/bid-rounds.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';

@Component({
  selector: 'app-blank-header',
  templateUrl: './blank-header.component.html',
  styleUrls: ['./blank-header.component.scss'],
})
export class BlankHeaderComponent implements OnInit {
title
goBackUrl
hideGoBack
hideForward
forwardUrl
defaultHeader
minutes;
defaultTimer
  seconds: any;
  distance: number;
  interval
  round_id
  user_data
  bid_schedule_id: any;
  empId
  hours
  managerIdForCurrentBidSchdule
  empName
  bidShculeTimeZone='US/Eastern'

  private history: Array<string> = []
  constructor( public navCtrl: NavController,
    private route: ActivatedRoute,
    public navParams: NavParams,
    private newBidScheduleSer:CreateNewBidScheduleService,
    private bidWindowSer:BidWindowService,
    private bidScheduleSer:CreateNewBidScheduleService,
    public alertController: AlertController,
    private localData: LocalDataService,
    public bidRoundSer:BidRoundsService,
    private headerTitleService: HeaderTitleService,
    private router: Router, private location: Location) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.history.push(event.urlAfterRedirects)
        }
      })
    }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))

    this.route.params.subscribe(params => {
      this.bid_schedule_id = params['_bidid'];
      this.round_id = params['_roundId'];

  });
    this.headerTitleService.title.subscribe(title => {
      this.title = title;
    });

    this.headerTitleService.goBackUrl.subscribe(goBackUrl => {
      this.goBackUrl = goBackUrl;

      this.checkGoBackUrl(this.goBackUrl )
    });
    this.headerTitleService.defaultTimer.subscribe(defaultTimer => {
      this.defaultTimer = defaultTimer;
      if(this.defaultTimer=="biddingheader"){
        this.route.queryParams.subscribe(params=>{
          this.bid_schedule_id=params.bidId
          this.round_id=params.round,
          this.managerIdForCurrentBidSchdule=Number(params.id)
          this.empName=params.i,
          this.empId=params.eid
        })
        if(this.user_data.empid=='emp'){
          this.empId=this.user_data.empid
          this.empName= this.user_data.initials
        }
        // if(this.user_data.empid!==undefined){
          if(this.empId && this.empId!=undefined && this.empId!=null){
            this.empId=Number(this.empId)
            this.getBidRoundData()
          }

        // }

    }else{
      clearInterval(this.interval);
      this.defaultTimer=''
      this.distance=0
    }
      // this.checkGoBackUrl(this.goBackUrl )
    });
    this.headerTitleService.forwardUrl.subscribe(forwardUrl => {
      this.forwardUrl = forwardUrl;
      this.checkForward(this.forwardUrl)
    });

    this.headerTitleService.defaultHeader.subscribe(dh=>{
      this.defaultHeader=dh

    })

    // this.timer()
  }
  checkForward(fUrl){
    this.forwardUrl=fUrl
    if(this.forwardUrl!=null){
      if(this.forwardUrl==straightlines_io_apis.apis.generated_schedule_api || this.forwardUrl==straightlines_io_apis.apis.generated_schedule){
        if(JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))==null){
          this.hideForward=true
        }else{
          this.hideForward=false
        }
      }
    }else{
      this.hideForward=true
    }
  }

  checkGoBackUrl(goBackUrl ){

    this.goBackUrl=goBackUrl

    if(this.goBackUrl!=null){

      this.hideGoBack=false

    }else {
      this.hideGoBack=true

    }

  }
  goBack(){
    this.history.pop()
    const backAddress = this.history.pop() || this.goBackUrl;
    if(backAddress.endsWith('sTlines-dashboard/bidding')){
      this.navCtrl.navigateBack([straightlines_io_apis.apis.bidding]);
    }else if(this.title == 'My Bidding'){
      this.navCtrl.navigateBack([straightlines_io_apis.apis.my_bidding]);
    }else {
      this.navCtrl.navigateBack(backAddress);
    }
    console.log(backAddress)
  }
  forwardOldGeneratedShiftLines(){
    this.navCtrl.navigateForward(this.forwardUrl)
  }
  routerLinks(){
    if(this.title == 'My Bidding'){
      this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding]);
    }
  }
  timer(){
    this.interval=setInterval( async ()=> {
      var countDownDate = new Date("Dec 02, 2021 10:15:00").getTime();
      var today,date,invdate,diff
      date = new Date();
      invdate = new Date(date.toLocaleString('en-US', {
        timeZone: this.bidShculeTimeZone
      }));
       diff = date.getTime() - invdate.getTime();
       today=new Date(date.getTime() - diff)
      var now = today.getTime();
      this.distance = countDownDate - now;

        if(this.distance<0){
          this.minutes='00'
          this.seconds='00'
          clearInterval(this.interval);
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'Bid window time has ended.',
            buttons: ['OK']
          });

          await alert.present();
          this.user_data.role==='emp' ? this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home) : this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding)
          // if(this.user_data.empid==undefined){
          //   this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding)
          // }else{
          //   this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home)
          // }
        }
      var minutes =Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      if(minutes<10){
        this.minutes='0'+String(minutes)
      }else{
        this.minutes=minutes
      }
     var seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        if(seconds<10){
          this.seconds='0'+String(seconds)
        }else{
          this.seconds=seconds
        }
      }, 1000);


  }
  currentactiveRoundNumber
  currentSelectedRound
  roundStartDate
  roundStartTime
  roundDuration
  roundStatus

  all_SBP_rounds_length
  allBidRoundData=[]
  all_SBP_rounds=[]
  all_Bid_schedule_list=[]
  bidSchedule
  dailyEndTIme=undefined
  getBidRoundData(){
      this.newBidScheduleSer.getAllBidScheduleData(this.managerIdForCurrentBidSchdule).subscribe((res)=>{
        this.all_Bid_schedule_list=[]
        this.all_Bid_schedule_list=res
        for(var i=0;i<this.all_Bid_schedule_list.length;i++){
          if(Number(this.all_Bid_schedule_list[i].bidschid)==Number(this.bid_schedule_id)){
            this.bidSchedule=this.all_Bid_schedule_list[i]
            this.bidShculeTimeZone=this.bidSchedule.timezone

            this.dailyEndTIme=this.bidSchedule.roundmap[0].roundendttime
          }
        }

          this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
            var temp=res
            var tempObj
            this.allBidRoundData=[]
            for(var i=0;i<temp.length;i++){
              if(temp[i].bidschidref===Number(this.bid_schedule_id)){
                this.allBidRoundData.push(temp[i])
              }
            }
            this.all_SBP_rounds=this.allBidRoundData
            this.all_SBP_rounds_length=this.all_SBP_rounds.length
            if(this.all_SBP_rounds.length>0){

              this.getRoundData(this.all_SBP_rounds[Number(this.round_id)],Number(this.round_id))
            }
          },(err)=>{console.log(err)},()=>{})
        },(err)=>{console.log(err)},()=>{})
  }
  getRoundData(all_SBP_rounds,j){
    this.currentactiveRoundNumber=j
    this.currentSelectedRound=all_SBP_rounds
    var defStartDate=this.currentSelectedRound.empbid_start_time.split(" ")
    var defendDate=this.currentSelectedRound.empbid_end_time.split(" ")
    var start =defStartDate[0].split("-");
    var start_Date = new Date(start[0],Number(start[1])+ - +1, start[2],0 ,0, 0);
    this.roundStartTime= defStartDate[1]
    this.roundStartDate=start_Date
    this.roundDuration=this.currentSelectedRound.empbidduration.split(":")
    this.roundDuration=this.roundDuration[1]
    var roundStartTime= this.roundStartTime.split(":")
    var start =defStartDate[0].split("-");
    var roundstartDate = new Date(start[0],Number(start[1])+ - +1, Number(start[2]),Number( roundStartTime[0]) ,Number( roundStartTime[1]),0);
    var end =defendDate[0].split("-");
    var endTIme=defendDate[1].split(":")
    var roundendDate = new Date(end[0],Number(end[1])+ - +1, Number(end[2]),Number(endTIme[0]) ,Number(endTIme[1]),0);
    var today,date,invdate,diff
    date = new Date();
    invdate = new Date(date.toLocaleString('en-US', {
      timeZone: this.bidShculeTimeZone
    }));
     diff = date.getTime() - invdate.getTime();
     today=new Date(date.getTime() - diff)
    if(today<roundstartDate){
      this.roundStatus="Closed"
      clearInterval(this.interval);
      this.distance=1
      this.minutes=this.roundDuration
      this.seconds='00'
    }else{
      if(today<roundendDate){

        this.roundStatus="Open"
        clearInterval(this.interval);
        this.time(roundendDate)
      }else{
        this.distance=0
        this.roundStatus="Closed"
      }
    }

    //timer

  }
time(roundendDate){
var i = 0;
this.interval=setInterval( async ()=> {
  var countDownDate
  var today,date,invdate,diff
  date = new Date();
  invdate = new Date(date.toLocaleString('en-US', {
    timeZone: this.bidShculeTimeZone
  }));
   diff = date.getTime() - invdate.getTime();
   today=new Date(date.getTime() - diff)
  if(new Date().getDate()!=roundendDate.getDate() ){
    if(roundendDate.getTime()<invdate.getTime()){
      countDownDate=new Date(invdate.getFullYear(),invdate.getMonth(),invdate.getDate(),Number(this.dailyEndTIme.split(':')[0]),Number(this.dailyEndTIme.split(':')[1]),0).getTime()
    }else{
      countDownDate=new Date(invdate.getFullYear(),invdate.getMonth(),invdate.getDate()+ + + 1,Number(this.dailyEndTIme.split(':')[0]),Number(this.dailyEndTIme.split(':')[1]),0).getTime()
    }
  }else{
    countDownDate = roundendDate.getTime();
  }



var now = today.getTime();
this.distance = countDownDate - now;
  if(this.distance<0){
    this.minutes='00'
    this.seconds='00'
    this.hours='00'
    clearInterval(this.interval);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: 'Bid window time has ended.',
      buttons: ['OK']
    });

    await alert.present();
    this.user_data.role==='emp' ? this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home) : this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding)
    // if(this.user_data.empid==undefined){
    //   this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding)
    // }else{
    //   this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home)
    // }

    this.roundStatus="Closed"
  }
var minutes =Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
if(minutes<10){
  this.minutes='0'+String(minutes)
}else{
  this.minutes=minutes
}
    var hours=Math.floor(this.distance / 1000 / 60 / 60);
    if(hours<10){
      this.hours='0'+hours
    }else{
      this.hours=hours
    }
var seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
  if(seconds<10){
    this.seconds='0'+String(seconds)
  }else{
    this.seconds=seconds
  }
}, 1000);
}


  convertNumber(m){
    return Number(m)
  }

}



