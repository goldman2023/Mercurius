import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonSlides, ModalController, NavController } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';

import straightlines_io_apis from 'src/app/json/apis.json';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { IonPullUpFooterState } from 'ionic-pullup';
import { MyBiddingService } from '../../my-bidding.service';
import { SkipBidLeaveComponent } from '../skip-bid-leave/skip-bid-leave.component';
import { BidSummaryCalendarComponent } from '../../my-bidding-step-one-shift-line/bid-summary-calendar/bid-summary-calendar.component';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-select-option-for-bid-leave',
  templateUrl: './select-option-for-bid-leave.component.html',
  styleUrls: ['./select-option-for-bid-leave.component.scss'],
})
export class SelectOptionForBidLeaveComponent implements OnInit {
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  all_shift_lines=[]
  spinner=true
  selectedShiftLines=[]
  bidRound=0
  currentEmpData
  @ViewChild(IonSlides) slides: IonSlides;
  customPopoverOptions: any = {
   cssClass:'custom-popover'
  };
  totalVacationHours=0
  totalRdos=0
  checkClickForPopup=false
  nextslide=true
  slideOption={
   shortSwipes:true,
   longSwipes:true,
   longSwipesRatio:0.5,
   initialSlide: 0,
   slidesPerView: 1.1,
   spaceBetween: 11,
   centeredSlides:true
  }
  activeRoundData=true
  openClose="animate bottom"
  all_SBP_rounds=[]
  user_data
  bid_schedule=[]
  bid_scheduleName=[]
  years=[]
  all_employee=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R']
  selectShiftLineForm
  schedule_id: number=0;
  step_form_name
  dailyEndTIme=undefined
  all_SBP_rounds_length=0
  def_all_SBP_rounds=[]
    selectYearForm: FormGroup;
    selectBidScheduleNameForm: FormGroup;
    start_date: any;
    end_date: any;
    all_bid_schedule: any[];
    currentSelectedRound: any;
    roundStartTime: any;
    roundStartDate: any;
    roundDuration: any;
    roundbidStatus="Eligible"
    roundStatus: any;
    showPopUp: any;
    bidding_status=0;
    currentactiveRoundNumber=0;
    currentBidScheduleId=0;
    minutes;
    seconds: any;
    distance: number;
    interval;all_window_data=[]
    bid_schedule_length=0
    allBidRoundData=[]
    bid_shiftline;
    shiftLinesSchedule: any[];
    all_final_data: any[];
    shiftlineScheduleData: any;
    bid_summary=[]
    bidSchedule
    timerOpenInterval
    intervalForUpdateStatus: NodeJS.Timeout;
    hours: any;
    bid_schedule_id
    currentBidScheduleData
    round_id=0
    empId
    empName
    checkShiftLineScheduleId
    bid_summary_popup=75
  bid_summary_popup_margin=250
    bidShculeTimeZone='US/Eastern'
  managerIdForCurrentBidSchdule
    constructor(
      public navCtrl: NavController,
      public formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      public alertCtrl: AlertController,
      private scheduleService:GeneratedScheduleService,
      private bidLeaveSer:BidVacationLeaveService,
      private bidShiftLineSer:BidShiftlinesService,
      private headerTitleService: HeaderTitleService,
      private route: ActivatedRoute,
      public modalCtrl: ModalController,
      private widnowTranSer:BidWindowService,
      public alertController: AlertController,
      private timezoneSer: TimezoneService,
      private newBidScheduleSer:CreateNewBidScheduleService,
      private myBiddingSer:MyBiddingService,
      private bidWindowSer:BidWindowService,
      private getAllEmp:AddNewEmployeeService,
      private fb:FormBuilder,
      private localData: LocalDataService
    ) {
      this.user_data=JSON.parse(sessionStorage.getItem('userData'))

      this.route.queryParams.subscribe(params=>{
        if(this.user_data.role!='emp'){
          this.bid_schedule_id=params.bidId
          this.round_id=params.round,
          this.empName=params.i,
          this.managerIdForCurrentBidSchdule=Number(params.id)
          this.empId=Number(params.eid)
        }else{
          this.bid_schedule_id=Number(params.bidId)
          this.round_id=Number(params.round)
          this.managerIdForCurrentBidSchdule=Number(params.id)
          this.empId=this.user_data.empid
          this.empName=this.user_data.initials
        }

      })
    }

    ngOnInit() {

    if(screen.availHeight<600){
      this.bid_summary_popup=60
      this.bid_summary_popup_margin=60
    }else if(screen.availHeight>600 && screen.availHeight<750){
      this.bid_summary_popup=60
      this.bid_summary_popup_margin=100
    }else{
      this.bid_summary_popup_margin=110
      this.bid_summary_popup=100
    }
      this.user_data=JSON.parse(sessionStorage.getItem('userData'))

      // this.headerTitleService.setTitle('Skip Vacation Bidding');
    this.headerTitleService.setDefaultHeader(false)
    this.headerTitleService.checkBiddingTime('biddingheader')
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.selet_shift_line_bidding);
    this.currentactiveRoundNumber=this.round_id
    this.activeRoundData=true
    this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? straightlines_io_apis.apis.employee_home : straightlines_io_apis.apis.my_bidding);

    this.headerTitleService.setForwardUrl(null);
    this.checkShiftLineScheduleId= JSON.parse(this.localData.getItem('selectShiftLineForBidding'))

      this.footerState = IonPullUpFooterState.Collapsed;
      this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
        var temp
        temp=res
        this.allBidRoundData=[]
        var tempObj
        for(var i=0;i<temp.length;i++){
          if(temp[i].bidschidref==Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)==temp[i].roundseq_id){
            this.currentEmpData=temp[i]
            this.getAllNewBidSchedule()
          }
        }

      },(err)=>{console.log(err)},()=>{})

      this.selectShiftLineForm = this.formBuilder.group({
        allShiftLine: this.formBuilder.array([]) ,
    });

    this.selectYearForm = this.formBuilder.group({
      year:new FormControl("select year"),
    })
    this.selectBidScheduleNameForm = this.formBuilder.group({
      bid_schedule_name:new FormControl("select bid schedule name"),
    })

    }

    get allShiftLine() : FormArray {
      return this.selectShiftLineForm.get("allShiftLine") as FormArray
     }
     get year(){
      return  this.selectYearForm.get("year")
      }
      get bid_schedule_name(){
        return  this.selectBidScheduleNameForm.get("bid_schedule_name")
        }
        bidShculeTimeZoneacronym='EST'
        allTimeZone
        getTimeZone(){
          this.timezoneSer.getAllTimeZone().subscribe((res)=>{

            this.allTimeZone=res
            for(var i=0;i<this.allTimeZone.length;i++){
            if(this.bidShculeTimeZone==this.allTimeZone[i].location){
              this.bidShculeTimeZoneacronym= this.allTimeZone[i].acronym
            }
            }
          },(err)=>{
            console.log(err)
          this.bidShculeTimeZoneacronym='EST'},()=>{})
        }

     newWorkLoadData(): FormGroup {
      return this.formBuilder.group({
        selectShiftLine:new FormControl(),
        id:new FormControl(),
        shiftline:new FormControl(),
        emp:new FormControl(),
      })

    }

    dailyStartTIme=undefined
    getAllNewBidSchedule(){

      this.newBidScheduleSer.getAllBidScheduleData(this.managerIdForCurrentBidSchdule).subscribe((res)=>{
        this.bid_schedule=res
        if(this.bid_schedule.length<1){
          this.spinner=false
        }
        this.all_bid_schedule=[]
        for(var i=0;i<this.bid_schedule.length;i++){
          if(this.bid_schedule[i].schedulesavestatus==1 && this.bid_schedule[i].roundsavestatus==1 && this.bid_schedule[i].leavesavestatus==1 && this.bid_schedule_id==this.bid_schedule[i].bidschid){
            this.currentBidScheduleData=this.bid_schedule[i]
            this.bidShculeTimeZone=this.bid_schedule[i].timezone
            this.dailyEndTIme=this.bid_schedule[i].roundmap[0].roundendttime
            this.dailyStartTIme=this.bid_schedule[i].roundmap[0].roundstarttime
          }
        }
        var checkShiftLineSchedule= JSON.parse(this.localData.getItem('myBiddingData'))

        if(this.all_bid_schedule.length>0){
          this.all_bid_schedule.sort((a, b)=>{return b.bidschid - a.bidschid});
        }
        this.bid_schedule_length=this.all_bid_schedule.length
            this.currentBidScheduleId=Number(this.bid_schedule_id)
            this.slideOption.initialSlide=this.bidRound

          this.slideOption.initialSlide=0

          this.spinner=false
        this.getTimeZone()
            this.getBidRoundData()
            this.bidSummaryData()
            this.systemAssignShifts()

      },(err)=>{console.log(err)},()=>{})
    }


    ngAfterViewInit() {
      // this.slides.centeredSlides = true;
    }

    convertNumber(m){
      return Number(m)
    }

  async skipBidLeave(){

this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe(async (res)=>{
  var tempObjn,tempArrn=[]
  tempArrn=res
    for(var i=0;i<tempArrn.length;i++){
      if(Number(this.bidSchedule.bidschid)==tempArrn[i].bidschidref && tempArrn[i].roundseq_id==(Number(this.round_id)+ +  +1)){
        tempObjn=tempArrn[i]
      }
    }
    if(tempObjn.vacationbidstatus=='Eligible'){
    const modal = await this.modalCtrl.create({
      component: SkipBidLeaveComponent,
      cssClass: 'skipBidLeave',
      componentProps:{empid:this.empId,empName:this.empName},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then(async (data) => {
      var skipdata=data.data.skipdata
      if(skipdata=='allRound'){
        skipdata=1
      }else if(skipdata=='skipCurrentRound'){
        skipdata=0
      }else{
        skipdata=3
      }
      if(data.data.check==true){
      if(this.user_data.role!='emp'){
        if(this.currentEmpData!=undefined){
          var temp='You skipped the vacation bidding for '+this.currentEmpData.fname +this.currentEmpData.lname+ '('+this.currentEmpData.initials+').'
        }else{
          var temp='You skipped the vacation bidding.'
        }
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: temp,
          buttons: [{text:'OK', handler: () => {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                round:this.round_id,
                id:this.managerIdForCurrentBidSchdule,
                skipRoundId:skipdata
              }
            };
            this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding,navigationExtras)
          }
          }]

        });
        await alert.present();
        const confirmation = (await alert.onDidDismiss()).role
        if (confirmation === 'cancel' || confirmation === 'backdrop') {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              round:this.round_id,
              id:this.managerIdForCurrentBidSchdule,
              skipRoundId:skipdata
            }
          };
          this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding,navigationExtras)
        }
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: 'You skipped the vacation bidding.',
          buttons: [{text:'OK', handler: () => {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                round:this.round_id,
                id:this.managerIdForCurrentBidSchdule,
              }
            };
            this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home,navigationExtras)
          }
          }]

        });
        await alert.present();
        const confirmation = (await alert.onDidDismiss()).role
        if (confirmation === 'cancel' || confirmation === 'backdrop') {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              round:this.round_id,
              id:this.managerIdForCurrentBidSchdule,
            }
          };
          this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home,navigationExtras)
        }
      }
    }else{
      this.ngOnInit()
    }
    })
    return await modal.present();
  }else{
    this.biddingIsDone()
  }
  },(err)=>{console.log(err)},()=>{})
  }
  async selectBidLeave(){

    let navigationExtras: NavigationExtras = {
      queryParams: {
        bidId: this.bid_schedule_id,
        round:this.round_id,
        id:this.managerIdForCurrentBidSchdule,
        i:this.empName,
        eid:this.empId
      }
    };

this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
  var tempObjn,tempArrn=[]
  tempArrn=res
    for(var i=0;i<tempArrn.length;i++){
      if(Number(this.bidSchedule.bidschid)==tempArrn[i].bidschidref && tempArrn[i].roundseq_id==(Number(this.round_id)+ +  +1)){
        tempObjn=tempArrn[i]
      }
    }
    if(tempObjn.vacationbidstatus=='Eligible'){
    if(this.user_data.role!='emp'){

      this.navCtrl.navigateForward(straightlines_io_apis.apis.bid_leave_vacation,navigationExtras)
    }else{
    this.navCtrl.navigateForward(straightlines_io_apis.apis.employee_leave_vacation,navigationExtras)
    }

}else{
  this.biddingIsDone()
}
},(err)=>{console.log(err)},()=>{})
  }

  async biddingIsDone(){
    if(this.user_data.role!='emp'){

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Bidding is already done',
        buttons: [{text:'OK', handler: () => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              round:this.round_id,
            }
          };
          this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding,navigationExtras)
        }
        }]

      });
      await alert.present();
      const confirmation = (await alert.onDidDismiss()).role
      if (confirmation === 'cancel' || confirmation === 'backdrop') {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            round:this.round_id,

          }
        };
        this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding,navigationExtras)
      }

    }else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Bidding is already done',
        buttons: [{text:'OK', handler: () => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              round:this.round_id,
            }
          };
          this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home,navigationExtras)
        }
        }]

      });
      await alert.present();

      const confirmation = (await alert.onDidDismiss()).role
      if (confirmation === 'cancel' || confirmation === 'backdrop') {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            round:this.round_id,

          }
        };
        this.navCtrl.navigateBack(straightlines_io_apis.apis.employee_home,navigationExtras)
      }

  }

}

    checkBidScheduleStatus(){
      var sName=this.selectBidScheduleNameForm.value.bid_schedule_name
      var today,biddingStartDate,date,invdate,diff
      var tempArr=[],biddingendDate
      var maxDate

      for(var i=0;i<this.all_bid_schedule.length;i++){
        if(this.all_bid_schedule[i].bidschename==sName){
          var start,end,s
          for(var k=0;k<this.all_bid_schedule[i].roundmap.length;k++){
            if(this.all_bid_schedule[i].roundmap[k].roundseq_id==1){
              start =this.all_bid_schedule[i].roundmap[k].actual_bidround_start_time.split("-");
              s=this.all_bid_schedule[i].roundmap[k].actual_bidround_start_time.split(":")
              biddingStartDate = new Date(start[0],Number(start[1])+ - +1, start[2],s[0] ,s[1], s[2]);
            }
          }
           date = new Date();
          invdate = new Date(date.toLocaleString('en-US', {
            timeZone: this.bidShculeTimeZone
          }));
           diff = date.getTime() - invdate.getTime();
           today=new Date(date.getTime() - diff)
        for(var k=0;k<this.all_bid_schedule[i].roundmap.length;k++){
          if(this.all_bid_schedule[i].roundmap.length===this.all_bid_schedule[i].roundmap[k].roundseq_id){
            var e
            end =this.all_bid_schedule[i].roundmap[k].actual_bidround_end_time.split("-");
            e=this.all_bid_schedule[i].roundmap[k].actual_bidround_end_time.split(":")
            maxDate = new Date(end[0],Number(end[1])+ - +1, end[2],e[0] ,e[1], e[2]);
          }
        }
          if(today.getTime()<biddingStartDate.getTime()){

              this.bidding_status=0
          }else if(today.getTime()>biddingStartDate.getTime()){
            if(today.getTime()<maxDate.getTime()){
              this.bidding_status=2
            }else{
              this.bidding_status=1
            }
          }else{
            this.bidding_status=2
          }
        }

      }
      }
    changeBidScheduleNameForm(){
      if(this.user_data.empid!==undefined){
      this.all_SBP_rounds=[]
      this.def_all_SBP_rounds=[]
      if(this.currentBidScheduleData.bidschename==='select bid schedule name'){
        this.all_SBP_rounds=[]
        this.bid_schedule_length=0
      }else{

        this.bid_schedule_length=this.all_bid_schedule.length

        for(var i=0;i<this.all_bid_schedule.length;i++){
          if(this.all_bid_schedule[i].bidschename===this.currentBidScheduleData.bidschename){
            this.currentBidScheduleId=this.all_bid_schedule[i].bidschid
            this.bidSchedule=this.currentBidScheduleData
            this.slideOption.initialSlide=0
            this.all_SBP_rounds=this.all_bid_schedule[i].roundmap
            this.def_all_SBP_rounds=this.all_bid_schedule[i].roundmap


          }
        }

        if(this.bidRound!==0){
          this.slides.slideTo(0)
        }

        var  temp
        temp={
          "bid_schedule_name":this.currentBidScheduleData.bidschename,
          "bid_round_data":this.currentSelectedRound,
          "currentBidScheduleId":this.currentBidScheduleId
        }
        this.localData.setItem('myBiddingData',JSON.stringify(temp))
        this.localData.setItem('selectShiftLineForBidding',JSON.stringify(0))
        this.passBidScheduleName.emit(this.currentBidScheduleData.bidschename);
        this.passroundId.emit(this.currentSelectedRound)
          if(this.openClose=="animate bottom move"){
            this.openClose="animate bottom"
          }

          this.checkBidScheduleStatus()
        this.getBidRoundData()
        // this.bidSummaryData()
      }
    }else{

      this.bid_schedule_length=this.all_bid_schedule.length

      for(var i=0;i<this.all_bid_schedule.length;i++){
        if(this.all_bid_schedule[i].bidschename===this.currentBidScheduleData.bidschename){
          this.currentBidScheduleId=this.all_bid_schedule[i].bidschid
          this.bidSchedule=this.currentBidScheduleData
          this.slideOption.initialSlide=0
          this.all_SBP_rounds=this.all_bid_schedule[i].roundmap
          this.def_all_SBP_rounds=this.all_bid_schedule[i].roundmap


        }
      }
      this.getBidRoundData()
      // this.bidSummaryData()
      this.systemAssignShifts()
      clearInterval(this.intervalForUpdateStatus)
      }
    }
    getBidRoundData(){
      if(this.user_data.role=='emp'){
      this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
        var temp=res
        var tempObj
        this.allBidRoundData=[]
        for(var i=0;i<temp.length;i++){
          if(temp[i].bidschidref===this.bid_schedule_id){
            this.allBidRoundData.push(temp[i])
          }
        }
        this.all_SBP_rounds=this.allBidRoundData

        this.all_SBP_rounds_length=this.all_SBP_rounds.length
        this.bid_schedule_length=this.all_SBP_rounds_length

        if(this.all_SBP_rounds.length>0){
          this.slideOption.initialSlide=this.round_id
          this.getRoundData(this.all_SBP_rounds[this.round_id],this.round_id)
        }
      },(err)=>{console.log(err)},()=>{})
    }else{

      this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.currentBidScheduleData.bidschename).subscribe((res)=>{
        var temp
        temp=res
        this.all_window_data=[]
        for(var i=0;i<temp.length;i++){
          if(this.currentBidScheduleData.bidschid===temp[i].bidschidref && this.empId===temp[i].empidref){
            this.all_window_data.push(temp[i])
          }
        }
        this.all_SBP_rounds=this.all_window_data
      this.bid_schedule_length=this.all_SBP_rounds.length
      this.all_SBP_rounds_length=this.bid_schedule_length
      // this.getCurrentEmpData(0)
      this.slideOption.initialSlide=this.round_id
      this.getRoundData(this.all_SBP_rounds[this.round_id],this.round_id)
      },(err)=>{console.log(err)},()=>{})
    }
    }
    finalViewBidWindowData=undefined
    getCurrentEmpData(i){
      var temp =this.all_window_data

      clearInterval(this.interval)
      var start,end
      var today,date,invdate,diff
            for(var l=0;l<temp.length;l++){
              var defStartDate=temp[l].empbid_start_time.split(" ")
              var defendDate=temp[l].empbid_end_time.split(" ")
              start=new Date(Number(defStartDate[0].split("-")[0]),Number(defStartDate[0].split("-")[1])+ - +1,Number(defStartDate[0].split("-")[2]),Number(defStartDate[1].split(':')[0]),Number(defStartDate[1].split(':')[1]),0)
              end=new Date(Number(defendDate[0].split("-")[0]),Number(defendDate[0].split("-")[1])+ - +1,Number(defendDate[0].split("-")[2]),Number(defendDate[1].split(':')[0]),Number(defendDate[1].split(':')[1]),0)

            date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
              if(today>=start){
                if(today>end){
                }else{
                  this.finalViewBidWindowData={

                    "id":l+1,"startTime":start,"status":1,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"default":temp[l]
                  }
                }
              }
            }
          this.spinner=false
      this.interval=setInterval( ()=> {
        for(var l=0;l<temp.length;l++){
          var defStartDate=temp[l].empbid_start_time.split(" ")
              var defendDate=temp[l].empbid_end_time.split(" ")
              start=new Date(Number(defStartDate[0].split("-")[0]),Number(defStartDate[0].split("-")[1])+ - +1,Number(defStartDate[0].split("-")[2]),Number(defStartDate[1].split(':')[0]),Number(defStartDate[1].split(':')[1]),0)
              end=new Date(Number(defendDate[0].split("-")[0]),Number(defendDate[0].split("-")[1])+ - +1,Number(defendDate[0].split("-")[2]),Number(defendDate[1].split(':')[0]),Number(defendDate[1].split(':')[1]),0)

            date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
          if(today>=start){
            if(today>end){
            }else{
              this.finalViewBidWindowData={

                "id":l+1,"startTime":start,"status":1,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"default":temp[l]
              }
            }
          }
        }
      }, 5000);


    }
    shiftlinebidstatus
    vacationbidstatus
    getRoundData(all_SBP_rounds,j){
      clearInterval(this.timerOpenInterval)
        this.passBidScheduleName.emit(this.currentBidScheduleData.bidschename);

        this.currentactiveRoundNumber=j
        // this.passroundId.emit(this.currentactiveRoundNumber)



        this.currentSelectedRound=all_SBP_rounds
        var defStartDate=this.currentSelectedRound.empbid_start_time.split(" ")
        var defendDate=this.currentSelectedRound.empbid_end_time.split(" ")
        this.shiftlinebidstatus=this.currentSelectedRound.shiftlinebidstatus
        this.vacationbidstatus=this.currentSelectedRound.vacationbidstatus

        var start =defStartDate[0].split("-");
        var start_Date = new Date(start[0],Number(start[1])+ - +1, start[2],0 ,0, 0);
        this.roundStartTime= defStartDate[1]
        this.roundStartDate=start_Date
        this.roundDuration=this.currentSelectedRound.empbidduration.split(":")
        this.roundDuration=Number(this.roundDuration[1])+ + + Number(this.roundDuration[0])*60
        var roundStartTime= this.roundStartTime.split(":")
        var start =defStartDate[0].split("-");
        var roundstartDate = new Date(start[0],Number(start[1])+ - +1, Number(start[2]),Number( roundStartTime[0]) ,Number( roundStartTime[1]),0);
        var end =defendDate[0].split("-");
        var endTIme=defendDate[1].split(":")
        var roundendDate = new Date(end[0],Number(end[1])+ - +1, Number(end[2]),Number(endTIme[0]) ,Number(endTIme[1]),0);
        var today,date,diff,invdate

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
          clearInterval(this.timerOpenInterval)
          this.checktimer(this.currentSelectedRound,this.currentactiveRoundNumber)
          this.minutes=this.roundDuration
          this.seconds='00'
        }else{
          if(today<roundendDate){
            this.roundStatus="Open"

            clearInterval(this.interval);
            this.timer(roundendDate)
          }else{
            this.distance=0
            this.roundStatus="Closed"
            if(this.intervalForUpdateStatus!=undefined){
              clearInterval(this.intervalForUpdateStatus)

            }else{
              this.roundbidStatus=all_SBP_rounds.bidstatus
            }


            this.intervalForUpdateStatus=setInterval( ()=> {
                if(this.currentBidScheduleData.bidschename!='select bid schedule name'){
                if(this.vacationbidstatus=="Eligible"){
                  this.updateBidStatus(all_SBP_rounds)

                }else if(this.vacationbidstatus=="Incomplete" || this.round_id!=0){
                    var count=0
                  if(all_SBP_rounds.roundseq_id==1 ||all_SBP_rounds.roundseq_id==0){
                    for(var k=0;k<this.def_all_SBP_rounds.length;k++){

                      if(this.def_all_SBP_rounds[k].roundseq_id>1){
                      count++
                      if(count==1){
                          var s,st
                        s=this.def_all_SBP_rounds[k].roundstartdate.split('-')
                        st=this.def_all_SBP_rounds[k].actual_bidround_start_time.split(':')
                        var result
                        result=new Date(s[0],Number(s[1])+ - +1,s[2],st[0],st[1],st[2])
                        var today,date,invdate,diff
                        date = new Date();
                                invdate = new Date(date.toLocaleString('en-US', {
                                  timeZone: this.bidShculeTimeZone
                                }));
                                diff = date.getTime() - invdate.getTime();
                                today=new Date(date.getTime() - diff)

                        if(result<=today){
                          // this.getRoundData(all_SBP_rounds,j)
                        }
                        }
                      }
                    }
                  }
                }else{
                  // this.roundbidStatus=all_SBP_rounds.bidstatus
                }
                }
          },100)

          }
        }
  this.spinner=false
        //timer

      }
      checktimer(all_SBP_rounds,j){
        this.timerOpenInterval=setInterval(()=>{
          this.getRoundData(all_SBP_rounds,j)
        },100)
      }
  timer(roundendDate){

    var i = 0;
    this.interval=setInterval( ()=> {
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
        this.roundStatus="Closed"
      }
    var hours=Math.floor(this.distance / 1000 / 60 / 60);
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
      if(hours<10){
        this.hours='0'+hours
      }else{
        this.hours=hours
      }

      this.headerTitleService.checkBiddingEndDate(this.hours+':'+this.minutes+":"+this.seconds)
    }, 1000);
  }

  updateBidStatus(all_SBP_rounds){

    clearInterval(this.intervalForUpdateStatus)
    var tempObj
    tempObj=all_SBP_rounds
      var tempNewObj={
          "duid": tempObj.duid,
          "bidschidref": tempObj.bidschidref,
          "bidschename": tempObj.bidschename,
          "empidref": tempObj.empidref,
          "initials": tempObj.initials,
          "rank": tempObj.rank,
          "roundseq_id": tempObj.roundseq_id,
          "bidstartdate": tempObj.bidstartdate,
          "bidenddate": tempObj.bidenddate,
          "bidstarttime": tempObj.bidstarttime,
          "bidendtime": tempObj.bidendtime,
          "empbidduration": tempObj.empbidduration,
          "shiftlinebidstatus": tempObj.shiftlinebidstatus,
          "trans_seq_id":tempObj.trans_seq_id,
          "vacationbidstatus":'Incomplete',
          "empbid_end_time":tempObj.empbid_end_time ,
            "empbid_start_time":tempObj.empbid_start_time,
          "fname": tempObj.fname,
          "lname": tempObj.lname,
          "empseq_id": tempObj.empseq_id
      }

          this.bidWindowSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{

      },(err)=>{console.log(err)},()=>{
        this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
          var temp=res
          var tempObj
          this.allBidRoundData=[]
          for(var i=0;i<temp.length;i++){
            if(temp[i].bidschidref===this.currentBidScheduleId){
              this.allBidRoundData.push(temp[i])
            }
          }
          this.all_SBP_rounds=this.allBidRoundData
          this.all_SBP_rounds_length=this.all_SBP_rounds.length
          if(this.all_SBP_rounds.length>0){
            for(var i=0;i<this.all_SBP_rounds.length;i++){
                if(this.all_SBP_rounds[i].roundseq_id==Number(this.round_id)+ + +1){
                  return this.getRoundData(this.all_SBP_rounds[this.round_id],this.round_id)
              }
            }

          }
        },(err)=>{console.log(err)},()=>{})
  })
      }









    formatAMPM(date) {
      var hours = date.split(':')[0];
      var minutes = date.split(':')[1];
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = Number(hours) % 12;
      hours = Number(hours) ? Number(hours) : 12; // the hour '0' should be '12'
      hours = Number(hours) < 10 ? '0'+Number(hours) : Number(hours);
      minutes = Number(minutes) < 10 ? '0'+Number(minutes) : Number(minutes);
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }




     anyFunction(){
    }

    formatDate(date) {
      var d = date,
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
  }
    myFunction() {
      this.showPopUp
      this.checkClickForPopup=true
      var popup = document.getElementById("myPopup");
      popup.classList.toggle("show");
      var slide = document.getElementById("ion-slides");
      // if(popup.classList.contains("ion-slides")==false){
        slide.classList.toggle("update-slide");
      // }
      var popupStatus= document.getElementById("popupStatus");
      if(popupStatus!=null){
        if(popupStatus.classList.contains("showStatus")==true){
          popupStatus.classList.toggle("showStatus");
        }
      }

    }
    oldPopupId
  myFunctionStatus(i){
    this.showPopUp
    this.checkClickForPopup=true


    var popup = document.getElementById("popupStatus"+i);
    popup.classList.toggle("showStatus");
    if(this.oldPopupId!=undefined){
      var popupOne = document.getElementById("popupStatus"+this.oldPopupId);
      if(popupOne!=null){
        if(popupOne.classList.contains("showStatus")==true){
          popupOne.classList.toggle("showStatus");
        }
      }
    }
      var popupBS = document.getElementById("myPopupIndex"+this.oldPopupIdForBidSummary);
      if(popupBS!=null){
        if(popupBS.classList.contains("showIndex")==true){
          popupBS.classList.toggle("showIndex");
        }
      }
    var popupStatus = document.getElementById("myPopup");
    if(popupStatus!=null){
      if(popupStatus.classList.contains("show")==true){
        popupStatus.classList.toggle("show");
      }
    }
    if(this.oldPopupId==i){
      this.oldPopupId=undefined
    }else{
      this.oldPopupId=i
    }

  }
    updateCss(){
      if(this.checkClickForPopup==false){
          var popup = document.getElementById("myPopup");
          var popupStatus= document.getElementById("popupStatus");
          if(popup!=null){
            if(popup.classList.contains("show")==true){
              popup.classList.toggle("show");
            }
          }
            var popupBS = document.getElementById("myPopupIndex"+this.oldPopupIdForBidSummary);
            if(popupBS!=null){
              if(popupBS.classList.contains("showIndex")==true){
                popupBS.classList.toggle("showIndex");
              }
            }
          if(popupStatus!=null){
            if(popupStatus.classList.contains("showStatus")==true){
              popupStatus.classList.toggle("showStatus");
            }
          }

          var slide = document.getElementById("ion-slides");
         if(slide!=null){
            if(slide.classList.contains("update-slide")==true){
              slide.classList.toggle("update-slide");
            }
          }
        }

        this.checkClickForPopup=false
    }
    touchstart(e,t){


      var t=e.changedTouches[0].clientX

      var el = document.getElementById("bid-summary");
      var height = el.offsetHeight;
      if(height<401){
        var newHeight = t + 60;
      }


      if(newHeight<400){
        el.style.height = newHeight + 'px';
        return this.openClose="animate bottom move"
      }
      // this.changeCSS()
    }
    footerState
    footerExpanded(){

    }
    toggleFooter(){
      this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    }
    footerCollapsed(){

    }
    viewBidWindow(){
      return 'test'
    }
    changeCSS(){
      if(this.openClose=="animate bottom"){
        // this.bidSummaryData()
        return this.openClose="animate bottom move"

      }else{
        var el = document.getElementById("bid-summary");

        var newHeight = 60;
        el.style.height = newHeight + 'px';
        this.openClose="animate bottom"
      }
    }
    schedule(id){
      if(id==0){
        this.slides.slideTo(id)
              this.bidRound=0
      }else if(id==1){
        this.slides.slideTo(id)
        this.bidRound=1
      }else if(id==2){
        this.slides.slideTo(id)
        this.bidRound=2
      }
    }
    bidSummaryData(){
        if(this.currentBidScheduleData.bidschename==='select bid schedule name'){
          this.all_SBP_rounds=[]
          this.bid_schedule_length=0
        }else{
          this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.bid_schedule_id).subscribe((res)=>{
            var temp=res
            this.bidSchedule=res

            this.getAllShiftLineSchedule()
          },(err)=>{console.log(err)},()=>{})
        // }
      // }else{

      }
    }
    getAllShiftLineSchedule(){
      this.shiftLinesSchedule=new Array()
      for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
      this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
        this.shiftlineScheduleData=res[0]
        this.shiftLinesSchedule.push(this.shiftlineScheduleData)
        this.convertArrayData()
      },(err)=>{console.log(err)},()=>{})
    }


      // this.currentShiftLineSchedule(this.all_final_data[this.checkShiftLineScheduleId])
    }
    convertArrayData(){
      var tempArr=new Array()
      tempArr=this.shiftLinesSchedule
      this.all_final_data=new Array()
      for(var i=0;i<tempArr.length;i++){
        for(var j=0;j<this.bidSchedule.shiftdefmap.length;j++){
          if(tempArr[i].sh_schedule_id==this.bidSchedule.shiftdefmap[j].shiftdefref){
            var temp={
              "schedulename":tempArr[i].schedulename,
              "bidschedulestartdate":this.bidSchedule.shiftdefmap[j].shiftdefstartdate,
              "bidscheduleenddate":this.bidSchedule.shiftdefmap[j].shiftdefenddate,
              "shiftdefref":this.bidSchedule.shiftdefmap[j].shiftdefref,
              "bidschid":this.bidSchedule.bidschid,
            }
            this.all_final_data.push(temp)
          }
        }
      }
      if(this.all_final_data.length==this.bidSchedule.shiftdefmap.length){
        this.getShiftLines()
      }


    }
    getshiflineData(bidScheduleShiftlineSchedulData,shiftidref){
      for(var  i=0;i<this.shiftLinesSchedule.length;i++){
        if(this.shiftLinesSchedule[i].sh_schedule_id==shiftidref){
          for(var j=0;j<this.shiftLinesSchedule[i].schild.length;j++){
            if(this.shiftLinesSchedule[i].schild[j].sh_line_id==bidScheduleShiftlineSchedulData){
              if(this.shiftLinesSchedule[i].schild[j].shiftdurationc==9){
                return this.shiftLinesSchedule[i].schild[j].sun.split('-')[0] + this.shiftLinesSchedule[i].schild[j].mon.split('-')[0] +this.shiftLinesSchedule[i].schild[j].tue.split('-')[0] +this.shiftLinesSchedule[i].schild[j].wed.split('-')[0] +this.shiftLinesSchedule[i].schild[j].thu.split('-')[0] +this.shiftLinesSchedule[i].schild[j].fri.split('-')[0] +this.shiftLinesSchedule[i].schild[j].sat.split('-')[0]+
                this.shiftLinesSchedule[i].schild[j].sunshift2.split('-')[0] + this.shiftLinesSchedule[i].schild[j].monshift2.split('-')[0] +this.shiftLinesSchedule[i].schild[j].tueshift2.split('-')[0] +this.shiftLinesSchedule[i].schild[j].wedshift2.split('-')[0] +this.shiftLinesSchedule[i].schild[j].thushift2.split('-')[0] +this.shiftLinesSchedule[i].schild[j].frishift2.split('-')[0] +this.shiftLinesSchedule[i].schild[j].satshift2.split('-')[0]
              }else{
                return this.shiftLinesSchedule[i].schild[j].sun + this.shiftLinesSchedule[i].schild[j].mon +this.shiftLinesSchedule[i].schild[j].tue +this.shiftLinesSchedule[i].schild[j].wed +this.shiftLinesSchedule[i].schild[j].thu +this.shiftLinesSchedule[i].schild[j].fri +this.shiftLinesSchedule[i].schild[j].sat
              }

            }
          }
        }
      }
    }
    getShiftLines(){
      this.bidShiftLineSer.getBidShiftlinesDataBasedOnEmpid(this.empId).subscribe((res)=>{
        var  temp
        temp=res
      var tempObj,tempArr=[]
      this.bid_summary=[]
      if(temp.length>0){
          for(var i=0;i<temp.length;i++){
            if(temp[i].bidschidref==this.currentBidScheduleId){
              for(var j=0;j<this.all_final_data.length;j++){
                if(temp[i].shiftidref==this.all_final_data[j].shiftdefref){

                  this.bid_summary.push({
                    "schedulename":temp[i].schedulename,
                    "startDate":new Date(this.all_final_data[j].bidschedulestartdate),
                    "endDate":new Date(this.all_final_data[j].bidscheduleenddate),
                    "shiftlineidref":temp[i].shiftlineidref,
                    "shiftlineScheduleID":temp[i].shiftidref,
                    "shiftData":this.getshiflineData(temp[i].shiftlineidref,temp[i].shiftidref),
                    "shiftline":this.getshiflineName(temp[i].shiftlineidref,temp[i].shiftidref),
                  "getSeqId":this.getshiflineSeq(temp[i].shiftlineidref,temp[i].shiftidref)+ + +1,
                    "roundseq_id":temp[i].roundseq_id
                  })
                }
              }
            }
          }
        }else{
          for(var j=0;j<this.all_final_data.length;j++){
              this.bid_summary.push({
                "schedulename":this.all_final_data[j].schedulename,
                "startDate":new Date(this.all_final_data[j].bidschedulestartdate),
                "endDate":new Date(this.all_final_data[j].bidscheduleenddate),
                "getSeqId":'',
                "shiftline":'Not Selected',
                "roundseq_id":1
              })
          }
        }
        if(this.bid_summary.length<1){
          for(var j=0;j<this.all_final_data.length;j++){
            this.bid_summary.push({
              "schedulename":this.all_final_data[j].schedulename,
              "getSeqId":'',
              "startDate":new Date(this.covertDate(this.all_final_data[j].bidschedulestartdate)),
              "endDate":new Date(this.covertDate(this.all_final_data[j].bidscheduleenddate)),
              "shiftline":'Not Selected',
              "roundseq_id":1
            })
        }
        }
      // this.update()
      this.bid_summary=this.bid_summary.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      })

      this.getVacationBidSummary()
      },(err)=>{console.log(err)},()=>{})
    }
    checkSameDate(date1,date2){
      date1=new Date(date1)
      date2=new Date(date2)
      if(date1.getFullYear()==date2.getFullYear() && date1.getMonth()==date2.getMonth() && date1.getDate()==date2.getDate()){
        return true
      }else{
        return false
      }
      }
    vacationBidSummary=[]
    getVacationBidSummary(){

      this.vacationBidSummary=[]
      for(var i=0;i<this.all_SBP_rounds.length;i++){
        if(this.all_SBP_rounds[i].vacationbidstatus.toLowerCase()=="skipped" || this.all_SBP_rounds[i].vacationbidstatus.toLowerCase()=="manager skipped"){
          var tempObj={
            "bidschename":  this.all_SBP_rounds[i].bidschename,
            "bidschidref": this.all_SBP_rounds[i].bidschidref,
            "bidstatus": "Skipped",
            "empidref": this.all_SBP_rounds[i].empidref,
            "initials":  this.all_SBP_rounds[i].initials,
            "roundseq_id": this.all_SBP_rounds[i].roundseq_id,
            "vacationenddate": '',
            "vacationid":'',
            "vacationstartdate":'',
            "rdos":0,
            "vcationhours":0,
            "windowstatus": ''
          }
          this.vacationBidSummary.push(tempObj)
        }else if(this.all_SBP_rounds[i].vacationbidstatus.toLowerCase()=="not eligible"){
            var tempObj={
              "bidschename":  this.all_SBP_rounds[i].bidschename,
              "bidschidref": this.all_SBP_rounds[i].bidschidref,
              "bidstatus": "No Vacation",
              "empidref": this.all_SBP_rounds[i].empidref,
              "initials":  this.all_SBP_rounds[i].initials,
              "roundseq_id": this.all_SBP_rounds[i].roundseq_id,
              "vacationenddate": '',
              "vacationid":'',
              "vacationstartdate":'',
              "rdos":0,
              "vcationhours":0,
              "windowstatus": ''
            }
            this.vacationBidSummary.push(tempObj)
        }
      }
      this.totalVacationHours=0
      this.totalRdos=0
      this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(Number(this.bid_schedule_id)).subscribe((res)=>{
        var temp=[],tempArr=[]
        temp=res
        var tempArrTwo=[]
        for(var v=0;v<temp.length;v++){
           if(this.empId==temp[v].empidref){
            tempArr.push(temp[v])
          }
        }
        var tempArrValue=[]
        var date
        var max,min
        for(var x=0;x<this.all_SBP_rounds_length;x++){
          tempArrTwo=[],tempArrValue=[]
            for(var w=0;w<tempArr.length;w++){
              if(Number(tempArr[w].roundseq_id)==(x+ + +1)){
                 date=new Date(Number(tempArr[w].vacationstartdate.split('-')[0]),Number(tempArr[w].vacationstartdate.split('-')[1])+ -+1,Number(tempArr[w].vacationstartdate.split('-')[2]),0,0,0);
                tempArrValue.push(tempArr[w])
                tempArrTwo.push(date)
                 date=new Date(Number(tempArr[w].vacationenddate.split('-')[0]),Number(tempArr[w].vacationenddate.split('-')[1])+ -+1,Number(tempArr[w].vacationenddate.split('-')[2]),0,0,0);
                tempArrTwo.push(date)
            }
          }
          max=(new Date(Math.max.apply(null,tempArrTwo )));
          min=(new Date(Math.min.apply(null,tempArrTwo )));
          var tempArray=[]
          tempArrValue=tempArrValue.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.vacationstartdate).getTime() - new Date(b.vacationstartdate).getTime();
          })
          if(tempArrValue.length>0){
            var tempObj,totalVacationBasedOnAround=0
            for(var l=0;l<tempArrValue.length;l++){
              totalVacationBasedOnAround=totalVacationBasedOnAround+ + +tempArrValue[l].vcationhours
              tempArray.push({"vacationstartdate":new Date(Number(tempArrValue[l].vacationstartdate.split('-')[0]),Number(tempArrValue[l].vacationstartdate.split('-')[1])+-+1,Number(tempArrValue[l].vacationstartdate.split('-')[2]),0,0,0),"vacationenddate":new Date(Number(tempArrValue[l].vacationenddate.split('-')[0]),Number(tempArrValue[l].vacationenddate.split('-')[1])+-+1,Number(tempArrValue[l].vacationenddate.split('-')[2]),0,0,0)})
              tempObj={
                "bidschename": tempArrValue[l].bidschename,
                "bidschidref": tempArrValue[l].bidschidref,
                "bidstatus": tempArrValue[l].bidstatus,
                "empidref": tempArrValue[l].empidref,
                "initials": tempArrValue[l].initials,
                "roundseq_id": tempArrValue[l].roundseq_id,
                "date":tempArray,
                "vacationid":tempArrValue[l].vacationid,
                "rdos":tempArrValue[l].rdos,
                "vcationhours":totalVacationBasedOnAround,
                "windowstatus": tempArrValue[l].windowstatus

            }
            }

            this.vacationBidSummary.push(tempObj)
          }
        }
        this.vacationBidSummary=this.vacationBidSummary.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.roundseq_id === value.roundseq_id && t.empidref === value.empidref && t.vacationid === value.vacationid && t.vcationhours === value.vcationhours
        ))
      )
      this.totalVacationHours=0
      for(var v=0;v<this.vacationBidSummary.length;v++){
        this.totalVacationHours=this.totalVacationHours+ + +this.vacationBidSummary[v].vcationhours
      }
    this.vacationBidSummary=this.vacationBidSummary.sort(function(a,b){

      return Number(a.roundseq_id) - Number(b.roundseq_id);
    })
      },(err)=>{console.log(err)},()=>{})


      this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(this.bid_schedule_id).subscribe((res)=>{

      },(err)=>{console.log(err)},()=>{})
    }
    onClickBidSummary(index){
      // index--

      //   this.slides.slideTo(index)
    }
    covertDate(date){
      return new Date(Number(date.split("-")[0]),Number(date.split("-")[1])+ - +1,Number(date.split("-")[2]),0,0,0)
    }
    convertCorrectFormat(shiftline){
      if(shiftline!=="Not Selected"){
      var num = shiftline.match(/\d+/g);
      var letr =  shiftline.match(/[a-zA-Z]+/g);
      return letr+'-'+num
      }else{
        return 'Not Selected'
      }
    }
    slideChange(){
      this.bidSummaryData()
    this.slides.getActiveIndex().then(index => {
      this.passBidScheduleName.emit(this.currentBidScheduleData.bidschename);


      // this.passroundId.emit(index)
      this.bidRound=index

      if(index==this.round_id){
        this.activeRoundData=true
      }else{
        this.activeRoundData=false
      }
      this.cdref.detectChanges()
      //
      for(var i=0;i<this.all_SBP_rounds.length;i++){
        if(i==index){
          this.getRoundData(this.all_SBP_rounds[i],index)
        }
      }

   })
  }
  getIndicatorClassForCard(id){
    if(this.bidRound===id ) {

      return 'app-border-mercurius-secondary-color';
    }else {
      return '';
    }
  }
  getIndicatorClassForBox(id){
    if(this.bidRound===id ) {

      return 'ion-no-margin ion-no-padding active-box app-border-mercurius-secondary-color';
    }else {
      return '';
    }
  }
    getIndicatorClass(id1){

      if(this.bidRound===id1 ) {

        return 'active';
      }else {
        return 'small';
      }
    }
    // update(all_SBP_rounds){

    // }
    getshiflineSeq(bidScheduleShiftlineSchedulData,shiftidref){
      for(var  i=0;i<this.shiftLinesSchedule.length;i++){
        if(this.shiftLinesSchedule[i].sh_schedule_id==shiftidref){
          for(var j=0;j<this.shiftLinesSchedule[i].schild.length;j++){
            if(this.shiftLinesSchedule[i].schild[j].sh_line_id==bidScheduleShiftlineSchedulData){
              return this.checkID(this.shiftLinesSchedule[i].schild[j].seq_id,this.shiftLinesSchedule[i].schild[j].shiftname,this.shiftLinesSchedule[i].schild)
            }
          }
        }
      }
    }
    getshiflineName(bidScheduleShiftlineSchedulData,shiftidref){
      for(var  i=0;i<this.shiftLinesSchedule.length;i++){
        if(this.shiftLinesSchedule[i].sh_schedule_id==shiftidref){
          for(var j=0;j<this.shiftLinesSchedule[i].schild.length;j++){
            if(this.shiftLinesSchedule[i].schild[j].sh_line_id==bidScheduleShiftlineSchedulData){
              return this.shiftLinesSchedule[i].schild[j].shiftname
            }
          }
        }
      }
    }
    checkID(id,sl,scheduleShift){
      var tempArr=[]
      for(var i=0; i<=scheduleShift.length;i++)
      {
        if(scheduleShift[i] !=undefined){
        if(String(scheduleShift[i].shiftname) == String(sl) || String(scheduleShift[i].shiftname)  == String((sl+'-A'))){
         tempArr.push(Number(scheduleShift[i].seq_id))
        }
        }
      }
      tempArr=tempArr.sort((a,b)=>{return a -b})
      var newid=tempArr.indexOf(id)
      return newid
    }
    update(all_SBP_rounds){
      var tempArr=[]
      clearInterval(this.intervalForUpdateStatus);
      this.bidShiftLineSer.getBidShiftlinesData(this.currentBidScheduleData.bidschename).subscribe((res)=>{
        var temp
        temp=res
        for(var i=0;i<temp.length;i++){
          if(temp[i].bidschidref==this.bid_schedule_id){
            tempArr.push(temp[i])
          }
        }

        var arr,count=0
        for(var i=0;i<this.all_final_data.length;i++){
          arr=[]

          for(var j=0;j<tempArr.length;j++){
            if(tempArr[j].schedulename===this.all_final_data[i].schedulename){
              arr.push(tempArr[j])
            }

          }
          const found = arr.some(el => el.empidref === this.empId);
          if (found==true) {
          }else{
            count=0
            for(var k=0;k<arr.length;k++){

              if(arr[k].empidref==null){
                count++

               if(count==1){
                var shiftLineData=arr[k]
                var tempObj=        {
                  "bidid": shiftLineData.bidid,
                  "bidstatus": 'System Completed',
                  "windowstatus": '',
                  "empwindowduration": null,
                  "empwindowstartdateandtime": '',
                  "bidschidref":  this.bid_schedule_id,
                  "bidschename":this.currentBidScheduleData.bidschename,
                  "empidref": this.empId,
                  "initials": this.empName,
                  "roundseq_id": 1,
                  "empbid_end_time":shiftLineData.empbid_end_time ,
                "empbid_start_time":shiftLineData.empbid_start_time,
                  "schedulename": shiftLineData.schedulename,
                  "shiftseq_id": shiftLineData.shiftseq_id,
                  "shiftname": shiftLineData.shiftname,
                  "pattern": shiftLineData.pattern,
                  "shiftidref":shiftLineData.shiftidref,
          "shiftlineidref":shiftLineData.shiftlineidref
                }
                   this.bidShiftLineSer.updateBidShiftlineData(tempObj.bidid,tempObj).subscribe((res)=>{

                      this.getUpdateEmpWindowData(this.empId)
                    },(err)=>{console.log(err)},()=>{})
              }
              }

            }
          }
        }
        this.updateBidstatus(all_SBP_rounds)
      },
        (err)=>{console.log(err)},()=>{})

     }
     getUpdateEmpWindowData(empId){
      this.bidWindowSer.getBidWindowDataBasedOnempId(empId).subscribe((res)=>{
        var tempObj,tempArr=[]

        tempArr=res
          for(var i=0;i<tempArr.length;i++){
            if(Number(this.currentBidScheduleId)==tempArr[i].bidschidref && tempArr[i].roundseq_id==1){
              tempObj=tempArr[i]
            }
          }


          var tempNewObj
           tempNewObj={
              "duid": tempObj.duid,
              "bidschidref": tempObj.bidschidref,
              "bidschename": tempObj.bidschename,
              "empidref": tempObj.empidref,
              "initials": tempObj.initials,
              "rank": tempObj.rank,
              "roundseq_id": tempObj.roundseq_id,
              "bidstartdate": tempObj.bidstartdate,
              "bidenddate": tempObj.bidenddate,
              "bidstarttime": tempObj.bidstarttime,
              "bidendtime": tempObj.bidendtime,
              "empbidduration": tempObj.empbidduration,
              "shiftlinebidstatus": "System Completed",
              "vacationbidstatus":tempObj.vacationbidstatus,
              "trans_seq_id":tempObj.trans_seq_id,
              "empbid_end_time":tempObj.empbid_end_time ,
                "empbid_start_time":tempObj.empbid_start_time,
              "fname": tempObj.fname,
              "lname": tempObj.lname,
              "empseq_id": tempObj.empseq_id
          }

            this.bidWindowSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{

            },(err)=>{console.log(err)},()=>{})
          },(err)=>{console.log(err)},()=>{})
    }
     updateBidstatus(all_SBP_rounds){

      var tempObj
      tempObj=all_SBP_rounds
        var tempNewObj={
            "duid": tempObj.duid,
            "bidschidref": tempObj.bidschidref,
            "bidschename": tempObj.bidschename,
            "empidref": tempObj.empidref,
            "initials": tempObj.initials,
            "rank": tempObj.rank,
            "roundseq_id": tempObj.roundseq_id,
            "bidstartdate": tempObj.bidstartdate,
            "bidenddate": tempObj.bidenddate,
            "bidstarttime": tempObj.bidstarttime,
            "bidendtime": tempObj.bidendtime,
            "empbidduration": tempObj.empbidduration,
            "shiftlinebidstatus": tempObj.shiftlinebidstatus,
            "vacationbidstatus":"System Completed",
            "empbid_end_time":tempObj.empbid_end_time ,
            "empbid_start_time":tempObj.empbid_start_time,
            "trans_seq_id":tempObj.trans_seq_id,
            "fname": tempObj.fname,
            "lname": tempObj.lname,
            "empseq_id": tempObj.empseq_id
        }
        this.roundbidStatus="System Completed"
            this.bidWindowSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{

        },(err)=>{console.log(err)},()=>{


          this.ngOnInit()})
     }




     systemAssignShifts(){
       var currentBidSchedule
       this.all_bid_schedule=this.bid_schedule
      for(var i=0;i<this.all_bid_schedule.length;i++){
        if(this.all_bid_schedule[i].bidschid==this.currentBidScheduleData.bidschid){
         currentBidSchedule=this.all_bid_schedule[i]
        }
      }
      this.bidSchedule=currentBidSchedule
        this.getAllShiftLineScheduleManager()

    }
    getAllShiftLineScheduleManager(){
      this.shiftLinesSchedule=new Array()
      for(var i=0;i<this.currentBidScheduleData.shiftdefmap.length;i++){
      this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.currentBidScheduleData.shiftdefmap[i].shiftdefref).subscribe((res)=>{
        this.shiftlineScheduleData=res[0]
        this.shiftLinesSchedule.push(this.shiftlineScheduleData)
        this.convertArrayDataforManager()
      },(err)=>{console.log(err)},()=>{})
    }
    }
    convertArrayDataforManager(){
      var tempArr=new Array()
      tempArr=this.shiftLinesSchedule
      this.all_final_data=new Array()

      for(var i=0;i<tempArr.length;i++){
        for(var j=0;j<this.currentBidScheduleData.shiftdefmap.length;j++){
          if(tempArr[i].sh_schedule_id===this.currentBidScheduleData.shiftdefmap[j].shiftdefref){
            var temp={
              "schedulename":tempArr[i].schedulename,
              "bidschedulestartdate":this.currentBidScheduleData.shiftdefmap[j].shiftdefstartdate,
              "bidscheduleenddate":this.currentBidScheduleData.shiftdefmap[j].shiftdefenddate,
              "shiftdefref":this.currentBidScheduleData.shiftdefmap[i].shiftdefref,
              "bidschid":this.currentBidScheduleData.bidschid,
            }
            this.all_final_data.push(temp)
          }
        }
      }
      if(this.all_final_data.length==this.currentBidScheduleData.shiftdefmap.length){

        for(var l=0;l<this.currentBidScheduleData.roundmap.length;l++){
          if((this.round_id+ + +1)==this.currentBidScheduleData.roundmap[l].roundseq_id){
            return this.getFirstRound(this.currentBidScheduleData.roundmap[l],l)
          }
        }
      }
    }

  getFirstRound(all_SBP_rounds,j){
    clearInterval(this.timerOpenInterval)
    this.passBidScheduleName.emit(this.currentBidScheduleData.bidschename);

    this.currentactiveRoundNumber=j
    this.passroundId.emit(this.currentactiveRoundNumber)
    this.currentSelectedRound=all_SBP_rounds
    this.roundbidStatus=this.currentSelectedRound.shiftlinebidstatus
    var start =this.currentSelectedRound.roundstartdate.split("-");
    var start_Date = new Date(start[0],Number(start[1])+ - +1, start[2],0 ,0, 0);
    this.roundStartTime= this.currentSelectedRound.actual_bidround_start_time
    this.roundStartDate=start_Date
    this.roundDuration=this.currentSelectedRound.roundduration.split(":")
    this.roundDuration=this.roundDuration[1]
    var roundStartTime= this.roundStartTime.split(":")
    var start =this.currentSelectedRound.roundstartdate.split("-");
    var roundstartDate = new Date(start[0],Number(start[1])+ - +1, Number(start[2]),Number( roundStartTime[0]) ,Number( roundStartTime[1]),Number( roundStartTime[2]));
    var end =this.currentSelectedRound.roundenddate.split("-");
    var endTIme=this.currentSelectedRound.actual_bidround_end_time.split(":")
    var roundendDate = new Date(end[0],Number(end[1])+ - +1, Number(end[2]),Number(endTIme[0]) ,Number(endTIme[1]),Number(endTIme[2]));
    var today,date,invdate,diff
    date = new Date();
    invdate = new Date(date.toLocaleString('en-US', {
      timeZone: this.bidShculeTimeZone
    }));
    diff = date.getTime() - invdate.getTime();
    today=new Date(date.getTime() - diff)


    if(today<roundstartDate){
      clearInterval(this.timerOpenInterval)
    }else{
      if(today<roundendDate){
      }else{
        this.distance=0
        clearInterval(this.intervalForUpdateStatus)
        this.intervalForUpdateStatus=setInterval( ()=> {
          var s,st
        if(this.currentBidScheduleData.bidschename!='select bid schedule name'){
          s=this.currentSelectedRound.roundstartdate.split('-')
          st=this.currentSelectedRound.actual_bidround_start_time.split(':')
          var result
          result=new Date(s[0],Number(s[1])+ - +1,s[2],st[0],st[1],st[2])
          var today,date,invdate,diff
          date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
                if(result<=today){
                  clearInterval(this.intervalForUpdateStatus)
                  this.updatebyManager()
                }
        }
      },100)
      }
    }
  this.spinner=false
  }


     updatebyManager(){
       var currentBidSchedule,tempArr=[]


      this.bidShiftLineSer.getBidShiftlinesData(this.currentBidScheduleData.bidschename).subscribe((res)=>{
        var temp
        temp=res
        tempArr=[]
        for(var i=0;i<temp.length;i++){
          if(temp[i].bidschidref==this.currentBidScheduleData.bidschid){
            tempArr.push(temp[i])
          }
        }

        var arr,count=0
        for(var i=0;i<this.all_final_data.length;i++){
          arr=[]

          for(var j=0;j<tempArr.length;j++){
            if(tempArr[j].schedulename===this.all_final_data[i].schedulename){
              arr.push(tempArr[j])
            }
          }
          this.arrOne=arr
          for(var m=0;m<this.currentBidScheduleData.employeemap.length;m++){
          arr=this.arrOne
          var tempEmp
          tempEmp=this.currentBidScheduleData.employeemap
          const found = arr.some(el => el.empidref === this.currentBidScheduleData.employeemap[m].empidref);
          if (found==true) {
          }else{
              count=0
              this.arrOne=[]
              for(var k=0;k<arr.length;k++){
                if(arr[k].empidref==null){
                  count++
                if(count==1){
                  var shiftLineData=arr[k]
                  this.getAllEmployeeList(shiftLineData,this.currentBidScheduleData.employeemap[m].empidref)
                  this.getUpdateEmpWindowData(this.currentBidScheduleData.employeemap[m].empidref)
                }else{
                  this.arrOne.push(arr[k])
                }
              }else{
                this.arrOne.push(arr[k])
              }
            }
          }
          }
        }
      },
        (err)=>{console.log(err)},()=>{})



  }
  temp
  arr=[]
  arrOne=[]
  getAllEmployeeList(shiftLineData,empId){
    this.getAllEmp.getEmpDataBasedOnEmpId(empId).subscribe(
      (res)=>{
        var temp
        temp=res

        var tempObj=        {
          "bidid": shiftLineData.bidid,
          "bidstatus": 'System Completed',
          "windowstatus": '',
          "empwindowduration": null,
          "empwindowstartdateandtime": '',
          "bidschidref":  this.currentBidScheduleData.bidschid,
          "bidschename":this.currentBidScheduleData.bidschename,
          "empidref": temp.empid,
          "initials":temp.initials ,
          "empbid_end_time":shiftLineData.empbid_end_time ,
            "empbid_start_time":shiftLineData.empbid_start_time,
          "roundseq_id": 1,
          "schedulename": shiftLineData.schedulename,
          "shiftseq_id": shiftLineData.shiftseq_id,
          "shiftname": shiftLineData.shiftname,
          "pattern": shiftLineData.pattern,
                 "shiftidref":shiftLineData.shiftidref,
          "shiftlineidref":shiftLineData.shiftlineidref
        }
        this.arrOne.push(tempObj)

         this.bidShiftLineSer.updateBidShiftlineData(tempObj.bidid,tempObj).subscribe((res)=>{

        },(err)=>{console.log(err)},()=>{})
    },
      (err)=>{console.log(err)},()=>{})
  }
  async openCalendar(index,data){
    const modal = await this.modalCtrl.create({
      component: BidSummaryCalendarComponent,
      cssClass: 'BidSummaryCalendar',
      componentProps: {
        round_id:index,
        shiftlineSummary:this.bid_summary,
        vacationSummary:data
        },
      swipeToClose:true
    });
    return await modal.present();
  }
  oldPopupIdForBidSummary
  myFunctionBidSummary(index){
    this.showPopUp
    this.checkClickForPopup=true


    var popup = document.getElementById("myPopupIndex"+index);
    popup.classList.toggle("showIndex");
    if(this.oldPopupIdForBidSummary!=undefined){
      var popupOne = document.getElementById("myPopupIndex"+this.oldPopupIdForBidSummary);
      if(popupOne!=null){
        if(popupOne.classList.contains("showIndex")==true){
          popupOne.classList.toggle("showIndex");
        }
      }
    }
    var popupStatus = document.getElementById("myPopup");
    if(popupStatus!=null){
      if(popupStatus.classList.contains("show")==true){
        popupStatus.classList.toggle("show");
      }
    }
    var popupBS = document.getElementById("popupStatus"+this.oldPopupId);
    if(popupBS!=null){
      if(popupBS.classList.contains("show")==true){
        popupBS.classList.toggle("show");
      }
    }
    if(this.oldPopupIdForBidSummary==index){
      this.oldPopupIdForBidSummary=undefined
    }else{
      this.oldPopupIdForBidSummary=index
    }

  }
  }
