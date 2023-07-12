import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, IonContent, IonSlides, LoadingController, ModalController, NavController } from '@ionic/angular';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { Observable } from 'rxjs';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { LeaveSelectionConfirmationComponent } from './leave-selection-confirmation/leave-selection-confirmation.component';

@Component({
  selector: 'app-bid-leave-vacation',
  templateUrl: './bid-leave-vacation.component.html',
  styleUrls: ['./bid-leave-vacation.component.scss'],
})
export class BidLeaveVacationComponent implements OnInit {
  @ViewChild('button') button: ElementRef;
  mouseDown$: Observable<any>;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  mouseUp$: Observable<any>;
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();

  all_window_data=[]
  allBidRoundData=[]
  checkShiftLineScheduleId: any;
  selected_schedule_for_bidding: any;
  all_SBP_rounds=[]
  all_slots=[]
  bidSchedule
  empName
  selectLeaveButton="Select Leave"
  skipLeaveButton="Skip bid vacation"
  currentactiveRoundNumber=0;
  currentActiveBidLeaveRule: any;
  all_slots_length=0
  defaultremainingVacationHours=0
  user_data: any;
  bid_schedule_id
  round_id
  empSelectedShiftlineData=[]
  roundStatus
  currentSelectedRound
  roundbidStatus
  roundStartTime
  roundDuration
  roundStartDate
  checkClickForPopup
  showPopUp
  activeRoundData=true
  bid_summary_popup=75
  bid_summary_popup_margin=250
  totalVacationHours=0;
  bidShculeTimeZone='US/Eastern'
  totalRdos=0;
  all_SBP_rounds_length=0;
  bid_summary=[];
  all_final_data=[];
  shiftlineScheduleData
  totalgetVacationHours=0
  shiftLinesSchedule=[];
  empId
  spinner=false
  clickCountTwo=0;
  currentempData: any;
  slideOption={
    shortSwipes:true,
    longSwipes:true,
    longSwipesRatio:0.5,
    initialSlide: 0,
    slidesPerView: 12,
    spaceBetween: 0,
    duration:100,
    effect:'coverflow',
    direction:'vertical',
    centeredSlides:false,

    zoom:false
   }
   currentEmpData
   managerIdForCurrentBidSchdule
   remainingVacationHours=0
   totalEmpVacationHours=0
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    public modalCtrl: ModalController,
    private widnowTranSer:BidWindowService,
    private headerTitleService: HeaderTitleService,
    private bidLeaveSer:BidVacationLeaveService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private bidWindowSer:BidWindowService,
    private newBidScheduleSer:CreateNewBidScheduleService,
    public loadingController: LoadingController,
    private emailNotify:EmailNotificationsService,
    private getAllEmp:AddNewEmployeeService,
    private scheduleService:GeneratedScheduleService,
    private bidShiftLineSer:BidShiftlinesService,
    private timezoneSer: TimezoneService,
    private localData: LocalDataService
  ) {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))

    this.route.queryParams.subscribe(params=>{
      if(this.user_data.role!='emp'){
        this.bid_schedule_id=Number(params.bidId)
        this.round_id=Number(params.round),
        this.empName=params.i,
        this.managerIdForCurrentBidSchdule=Number(params.id)
        this.empId=Number(params.eid)
      }else{
        this.bid_schedule_id=Number(params.bidId)
        this.round_id=Number(params.round)
        this.empId=Number(this.user_data.empid)
        this.managerIdForCurrentBidSchdule=Number(params.id)
        this.empName=this.user_data.initials
      }

    })
  }

  ngOnInit() {
    this.spinner=true
    window.oncontextmenu = function() { return false; }
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
    // this.headerTitleService.setTitle('Vacation Bidding');
  this.headerTitleService.setDefaultHeader(false)
  this.headerTitleService.setBackUrl(straightlines_io_apis.apis.my_bidding);
  this.headerTitleService.setForwardUrl(null);
  this.headerTitleService.checkBiddingTime('biddingheader')
  this.user_data=JSON.parse(sessionStorage.getItem('userData'))
  // this.empName=this.user_data.initials
  this.cdref.detectChanges()
  // this.myBiddingSer.setTitle('step-1')
  this.currentactiveRoundNumber=this.round_id
  this.checkShiftLineScheduleId= JSON.parse(this.localData.getItem('selectShiftLineForBidding'))

  if(this.checkShiftLineScheduleId==null){
    this.checkShiftLineScheduleId=0
  }
  this.selected_schedule_for_bidding=JSON.parse(this.localData.getItem('myBiddingData'))
  this.passBidScheduleName.emit(this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name)
  this.passroundId.emit(this.round_id)
  this.getAllDataBasedOnScheduleName()
  this.getEmpData()


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
  getEmpData(){
    this.getAllEmp.getEmpDataBasedOnEmpId(this.empId).subscribe((res)=>{
      this.currentempData=res
      if(this.user_data.role!='emp'){
      this.currentEmpData=res
      }
      var temp
      temp=res
      this.totalEmpVacationHours=temp.vacation
      this.getvacationData()
    },(err)=>{console.log(err)},()=>{})
  }
  getvacationData(){
      this.totalgetVacationHours=0
      this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(Number(this.bid_schedule_id)).subscribe(async (res)=>{
        var temp=[],tempArr=[]
        temp=res
        var tempArrTwo=[]
        for(var v=0;v<temp.length;v++)
        if(this.empId==temp[v].empidref){
          tempArr.push(temp[v])
          console.log("🚀 ~ file: bid-leave-vacation.component.ts:205 ~ this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId ~ tempArr:", tempArr)
          this.totalgetVacationHours=this.totalgetVacationHours+ + +temp[v].vcationhours
        }
          this.remainingVacationHours=this.totalEmpVacationHours+ - +this.totalgetVacationHours
          if(this.remainingVacationHours<1){
            this.remainingVacationHours = 0
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Alert',
              message: "You don't have enough vacation balance. ",
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
          }
          this.defaultremainingVacationHours=this.remainingVacationHours
          if(this.totalgetVacationHours>=this.totalEmpVacationHours || this.remainingVacationHours<8){
            this.checkVacationHrs=false
            this.updateNextEmpData()
          }
        },(err)=>{console.log(err)},()=>{})
      }
      checkVacationHrs=false
  getAllDataBasedOnScheduleName(){
    this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.bid_schedule_id).subscribe((res)=>{
      this.bidSchedule=res
      this.bidShculeTimeZone=this.bidSchedule.timezone
      this.getTimeZone()
      this.getAllShiftLineData()

    },(err)=>{console.log(err)},()=>{})
  }
  countnumber=0
  employeeselected=[]
  donthaveanyscheduledates=[]
  getAllShiftLineData(){
    this.bidShiftLineSer.getBidShiftlinesDataBasedOnEmpid(this.empId).subscribe((res)=>{
      var temp
      temp=res
      this.empSelectedShiftlineData=[]
      this.employeeselected=[]
      this.countnumber=0
      for(var i=0;i<temp.length;i++){
        if(temp[i].bidschidref==Number(this.bid_schedule_id)){
          this.countnumber++
          this.employeeselected.push(temp[i])
        }
      }
      var checkDates=false
        this.donthaveanyscheduledates=[]
        for(var j=0;j<this.bidSchedule.shiftdefmap.length;j++){
          checkDates=false
          for(var i =0;i<this.employeeselected.length;i++){
            if(this.bidSchedule.shiftdefmap[j].shiftdefref==this.employeeselected[i].shiftidref){
              checkDates=true
              this.getshiflineData(this.bidSchedule.shiftdefmap[j],this.employeeselected[i],i)
            }
          }
          if(checkDates==false){
            this.getShiftLineSchedule(this.bidSchedule.shiftdefmap[j])

          }
      }
      this.cdref.detectChanges()

    },(err)=>{
      console.log(err)
    },()=>{})
  }
  getShiftLineSchedule(data){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(data.shiftdefref).subscribe((res)=>{

      var temp
      temp=res
      this.donthaveanyscheduledates.push({"shiftlineScheduleName":temp[0].schedulename,"data":data})
      if(this.bidSchedule.shiftdefmap.length==this.donthaveanyscheduledates.length){
        this.notEligible=true
        this.getBidRoundData()
        this.getAllLeaveBasedOnBidScheduleName()
      }
    },(err)=>{console.log(err)},()=>{})
  }
notEligible=false
  getshiflineData(bidScheduleShiftlineSchedulData,ShiftlineData,index){
    this.scheduleService.newGetShiftLineBasedOnShiftLineId(ShiftlineData.shiftlineidref).subscribe((res)=>{
      var tempObj
      tempObj=res
      this.empSelectedShiftlineData.push({
        "shiftdefenddate": bidScheduleShiftlineSchedulData.shiftdefenddate,
        "shiftdefref": bidScheduleShiftlineSchedulData.shiftdefref,
        "shiftdefstartdate": bidScheduleShiftlineSchedulData.shiftdefstartdate,
        "schedulename": ShiftlineData.schedulename,
        "shiftname":  tempObj.shiftname,
        "shiftseq_id": ShiftlineData.shiftseq_id,
        "shiftdurationc":tempObj.shiftdurationc,
        "fri": tempObj.fri,
        "mon": tempObj.mon,
        "sat": tempObj.sat,
        "sun": tempObj.sun,
        "thu": tempObj.thu,
        "tue": tempObj.tue,
        "wed": tempObj.wed,
        "frishift2": tempObj.frishift2,
        "monshift2": tempObj.monshift2,
        "satshift2": tempObj.satshift2,
        "sunshift2": tempObj.sunshift2,
        "thushift2": tempObj.thushift2,
        "tueshift2": tempObj.tueshift2,
        "wedshift2": tempObj.wedshift2,
      })
      if((index+ + +1)==this.countnumber){
        this.getBidRoundData()
        this.getAllLeaveBasedOnBidScheduleName()
      }

    },(err)=>{console.log(err)},()=>{})

  }
  all_Bid_rounds=[]
  getBidRoundData(){
    this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
      var temp
      temp=res
      var tempObj

      this.allBidRoundData=[]
      for(var i=0;i<temp.length;i++){
        if(temp[i].bidschidref==this.bid_schedule_id){
          this.allBidRoundData.push(temp[i])
        }
      }
      this.all_Bid_rounds=this.allBidRoundData
      this.currentactiveRoundNumber=this.round_id
      if(this.all_Bid_rounds.length>0){
        for(var i=0;i<this.all_Bid_rounds.length;i++){
            if(this.all_Bid_rounds[i].roundseq_id==Number(this.currentactiveRoundNumber)+ + +1){
              if(Number(this.currentactiveRoundNumber)==Number(this.round_id)){
                return  this.getAllBidRound()
              }else{
                return this.displayBidRoundData(this.all_Bid_rounds[i],this.currentactiveRoundNumber)
              }
          }
        }
      }
      this.cdref.detectChanges()
    },(err)=>{console.log(err)},()=>{})

}
  getAllBidRound(){

    this.all_SBP_rounds=this.bidSchedule.roundmap
    for(var i=0;i<this.all_SBP_rounds.length;i++){
      if((Number(this.round_id)+ + +1)==this.all_SBP_rounds[i].roundseq_id){
        this.currentactiveRoundNumber=i
        this.displayRoundData(this.all_SBP_rounds[this.currentactiveRoundNumber],this.currentactiveRoundNumber)
        this.cdref.detectChanges()
      }
    }

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
    this.cdref.detectChanges()
  }
  shiftlinebidstatus
  vacationbidstatus
  displayBidRoundData(round_data,index){
    this.currentactiveRoundNumber=index
    if(index==this.round_id){
      this.activeRoundData=true
      // this.displayRoundData(round_data,index)
      for(var i=0;i<this.all_SBP_rounds.length;i++){
        if((index+ + +1)==this.all_SBP_rounds[i].roundseq_id){
          this.currentactiveRoundNumber=i

          this.displayRoundData(this.all_SBP_rounds[i],i)
        }
      }
    }else{
      this.selectedLeaves=0
      this.rdosInLeave=0
      this.selectedDate=[]
      this.activeRoundData=false
      this.currentSelectedRound=round_data
      var defStartDate=this.currentSelectedRound.empbid_start_time.split(" ")
      var defendDate=this.currentSelectedRound.empbid_end_time.split(" ")
      // this.roundbidStatus=this.currentSelectedRound.bidstatus
      this.shiftlinebidstatus=this.currentSelectedRound.shiftlinebidstatus
      this.vacationbidstatus=this.currentSelectedRound.vacationbidstatus
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
      }else{
        if(today<roundendDate){
          this.roundStatus="Open"
        }else{
          this.roundStatus="Closed"
        }
      }
      this.cdref.detectChanges()
      // this.bidSummaryData()
    }

  }



  getIndicatorClass(index){
    if(this.currentactiveRoundNumber===index){
      return ' app-background-mercurius-secondary-color'
    }else{
      return 'app-font-mercurius-secondary-color'
    }
  }

  totalhoursAreAllowToPick=0
  displayRoundData(round_data,index){
    this.currentactiveRoundNumber=index
    this.currentActiveBidLeaveRule=round_data.bidleavereason
    if(this.currentActiveBidLeaveRule=='2 weeks NC'){
      this.cal_id=0
      this.leaveType='2 weeks NC'
      this.totalhoursAreAllowToPick=80
      this.selectedLeaveDates=[]
    }else if(this.currentActiveBidLeaveRule=='2 weeks C'){
      this.cal_id=1
      this.totalhoursAreAllowToPick=80
      this.currentSelectedTwoDate=[]
      this.leaveType='2 weeks C'
      this.selectedLeaveDates=[]

    }
    else if(this.currentActiveBidLeaveRule=='5 days (1 Week) in 7'){
      this.cal_id=2
      this.totalhoursAreAllowToPick=40
      this.leaveType='5 days (1 Week) in 7'
      this.selectedLeaveDates=[]
    }
    else if(this.currentActiveBidLeaveRule=='Up to 10 days NC'){
      this.cal_id=3
      this.totalhoursAreAllowToPick=80
      this.leaveType='Up to 10 days NC'
      this.selectedLeaveDates=[]
    }
    else if(this.currentActiveBidLeaveRule=='1 week'){
      this.cal_id=4
      this.totalhoursAreAllowToPick=40
      this.leaveType='1 week'
      this.selectedLeaveDates=[]
    }
    else if(this.currentActiveBidLeaveRule=='1 day'){
      this.cal_id=5
      this.totalhoursAreAllowToPick=10
      this.leaveType='1 day'
      this.selectedLeaveDates=[]
    }else if(this.currentActiveBidLeaveRule=='Up to 5 days NC'){
      this.cal_id=6
      this.totalhoursAreAllowToPick=40
      this.leaveType='Up to 5 days NC'
      this.selectedLeaveDates=[]
    }
    this.eventSource=this.defaultEventSource
    if(this.defaultEventSource!=undefined){
    this.listToMatrix(this.defaultEventSource)
    }
    this.cdref.detectChanges()
  }
  getAllLeaveBasedOnBidScheduleName(){

        this.all_slots=[]
        this.all_slots=this.bidSchedule.leavemap
      this.all_slots_length=this.all_slots.length
this.getAllData()

      }
      get_leave_data=[]
getAllData(){
  this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(this.bid_schedule_id).subscribe((res)=>{

    this.get_leave_data=[]
    this.get_leave_data=res

    this.calendarMethod()
  },(err)=>{console.log(err)},()=>{})

}
  dateMulti: string[];
    type: 'string';
    selected: Date | null;
    currentSelectedDate=null
    cal_id: any;
    eventSource: any[];
    selectedDate=[];
    viewTitle: any;
    isToday: boolean;
    leaveType: any;
    currentSelectedTwoDate: any[];
    datesToHighlight = [];
    temp: any;
    tempSelectedDate: string;
    clickName: string;
    clickCount=0;
    t: any;
    defaultEventSource
    holiday: boolean;
    selectedLeaveDates=[];
    rdosInLeave=0
    alertPresented
    selectedLeaves=0
    lockSwipeToPrev
    value=0
    id_one=0
    id_two=1
    id_three=2
    totalTenDays=0
    id_four=3
    id_five=4
    id_six=5
    cssClassForsingleClick='single-click';
    calendar = {
      mode: 'month' as CalendarMode,
      step: 30 as Step,
      month:[

      ]
    }
    convertDate(date){
      if(date !=null){
        return new Date(Number(date.split('-')[0]),Number(date.split('-')[1])+ - +1,Number(date.split('-')[2]),0,0,0)
      }

    }
    checkEmp(date){
      var tempArr=[]
      for(var i=0;i<this.get_leave_data.length;i++){
        if(this.convertDate(this.get_leave_data[i].vacationstartdate)<=date && this.convertDate(this.get_leave_data[i].vacationenddate)>=date){
         tempArr.push(this.get_leave_data[i].initials)
        }
      }
      return tempArr
    }
    checkRDOs(date){
      var updatedDate,startDate,endDate
      updatedDate=new Date(Number(date.split('/')[2]),Number(date.split('/')[0])+ - +1,Number(date.split('/')[1]),0,0,0)
      for(var i=0;i<this.empSelectedShiftlineData.length;i++){
        startDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[2]),0,0,0)
        endDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[2]),0,0,0)

        if(startDate.getTime()<=updatedDate.getTime() && updatedDate.getTime()<=endDate.getTime() ){
          var rdo=''
          // if(updatedDate<new Date(2023,0,15)){
            if(this.empSelectedShiftlineData[i].shiftdurationc==9){
              // console.log(this.empSelectedShiftlineData[i],this.datesForNineHoursShift)
              if(updatedDate.getDay()==0){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){

                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(new Date(this.datesForNineHoursShift[d][day]).getTime()<=updatedDate.getTime() && updatedDate.getTime()<=new Date(this.datesForNineHoursShift[d][day]).getTime()){
                      if(day<7 && day>=0){
                        if(this.empSelectedShiftlineData[i].sun=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].sunshift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==1){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0){
                        if(this.empSelectedShiftlineData[i].mon=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].monshift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==2){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0){
                        if(this.empSelectedShiftlineData[i].tue=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].tueshift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==3){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0){
                        if(this.empSelectedShiftlineData[i].wed=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].wedshift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==4){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0 ){
                        if(this.empSelectedShiftlineData[i].thu=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].thushift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==5){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0 ){
                        if(this.empSelectedShiftlineData[i].fri=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].frishift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }else if(updatedDate.getDay()==6){
                for(var d=0;d<this.datesForNineHoursShift.length;d++){
                  for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                    if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                      if(day<7 && day>=0 ){
                        if(this.empSelectedShiftlineData[i].sat=='X'){
                          rdo='rdo'
                        }
                      }else if(day<14 && day>6){
                        if(this.empSelectedShiftlineData[i].satshift2=='X'){
                          rdo='rdo'
                        }
                      }
                    }
                  }
                }
              }

            return String(rdo)
          }else{
          if(updatedDate.getDay()==0){
            if(this.empSelectedShiftlineData[i].sun=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==1){
            if(this.empSelectedShiftlineData[i].mon=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==2){
            if(this.empSelectedShiftlineData[i].tue=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==3){
            if(this.empSelectedShiftlineData[i].wed=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==4){
            if(this.empSelectedShiftlineData[i].thu=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==5){
            if(this.empSelectedShiftlineData[i].fri=='X'){
              rdo='rdo'
            }
          }else if(updatedDate.getDay()==6){
            if(this.empSelectedShiftlineData[i].sat=='X'){
              rdo='rdo'
            }
          }
        }

          return String(rdo)
        }
      }
    }
    datesForNineHoursShift=[]
    listOfMatrixForNineHours(list){
      var matrix = [], i, k,sun=[],mon=[],tue=[],wed=[],thu=[],fri=[],sat=[],matrixOne = [], j, l,h
      var tempNum=0,tempArr=[],tempArr2=[]
      const res = [];
      for (let i = 0; i < list.length; i += 14) {
          const chunk = list.slice(i, i + 14);
          res.push(chunk);
      }

      this.datesForNineHoursShift=res
    }
    calendarMethod(){
     if (this.calendar.mode === 'month') {
            this.lockSwipeToPrev = true;
      }
      var sDate=[]
    var temp=[]
    this.selectedDate=[]
    this.eventSource=[]
    var temp1=[]
    var t
    var uniqueDate=[]
    for(var i=0;i<this.all_slots.length;i++){
      for(var j=0;j<12;j++){
        uniqueDate.push(new Date(this.all_slots[i].leavestartdate.split("-")[0],j,1,0,0,0))
      }
      for(var j=0;j<12;j++){
        uniqueDate.push(new Date(this.all_slots[i].leaveenddate.split("-")[0],j,1,0,0,0))
      }
    }
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var uniqueDa = uniqueDate.map(s => s.getTime()).filter((s, i, a) => a.indexOf(s) == i).map(s => new Date(s));
    this.calendar.month=uniqueDa
    var tempArr=[]
    var maxDate=Math.max.apply(null,uniqueDa);
    var minDate=Math.min.apply(null,uniqueDa);
    var diffDays = Math.abs(maxDate - minDate);
    diffDays=Math.ceil(diffDays / (1000 * 60 * 60 * 24));
    var dt,month,year,daysInMonth
    for(var i=0;i<uniqueDa.length;i++){
      month =Number(uniqueDa[i].getMonth())+ + + 1;
      year = uniqueDa[i].getFullYear();
        daysInMonth = new Date(year, month, 0).getDate();
        for(var j=0;j<daysInMonth;j++){
          tempArr.push(new Date(year,month+ - +1,j+1,0,0,0))
        }
    }
    sDate=[]
    var obj
    // console.log(tempArr)

    this.listOfMatrixForNineHours(tempArr)

    for(var j=0;j<this.all_slots.length;j++){
      for(var i=0;i<tempArr.length;i++){
        var tempT= !!sDate.find(item => {
        return new Date(item.startDate).getMonth() === tempArr[i].getMonth() && new Date(item.startDate).getFullYear() === tempArr[i].getFullYear() && new Date(item.startDate).getDate() === tempArr[i].getDate()})
        var tempDate=(Number(tempArr[i].getMonth())+ + + 1)+'/'+tempArr[i].getDate()+'/'+tempArr[i].getFullYear()
        if(tempArr[i]<new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0)){
          if(tempT==false){
            obj={"startDate":tempDate,"endDate":tempDate,"title":this.checkRDOs(tempDate),"emp":[],"slot":0}
          sDate.push(obj)
          }
        }else if(tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) ){
                if(tempT==false){
                  if( tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) && tempArr[i]<=new Date(this.all_slots[j].leaveenddate.split("-")[0],Number(this.all_slots[j].leaveenddate.split("-")[1])+ - +1,Number(this.all_slots[j].leaveenddate.split("-")[2]),0,0,0) ){
                    obj={"startDate":tempDate,"endDate":tempDate,"title":this.checkRDOs(tempDate),"emp":[],"slot":this.all_slots[j].leaveslots}
                    sDate.push(obj)
                  }
                  else if(this.all_slots.length<=j+1){
                    obj={"startDate":tempDate,"endDate":tempDate,"title":this.checkRDOs(tempDate),"emp":[],"slot":0}
                    sDate.push(obj)
                  }

                }else if(tempT==true){
                    var tempA=[],slot=0
                    for(var k=0;k<sDate.length;k++){
                      if((Number(sDate[k].startDate.split("/")[0]) ===Number( tempArr[i].getMonth()+ + +1)) &&Number( sDate[k].startDate.split("/")[2]) === tempArr[i].getFullYear() && Number(sDate[k].startDate.split("/")[1] )=== tempArr[i].getDate()){
                        if(tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) && tempArr[i]<=new Date(this.all_slots[j].leaveenddate.split("-")[0],Number(this.all_slots[j].leaveenddate.split("-")[1])+ - +1,Number(this.all_slots[j].leaveenddate.split("-")[2]),0,0,0) ){
                          slot=Number(this.all_slots[j].leaveslots)+ + +Number(sDate[k].slot)
                          obj={"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":slot}
                          tempA.push(obj)
                        }else{
                          obj={"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":sDate[k].slot}
                          tempA.push(obj)
                          }
                      }else{
                        obj={"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":sDate[k].slot}
                        tempA.push(obj)
                      }
                    }
                    sDate=tempA

                }
          }
      }
    }
    for(var d=0;d<sDate.length;d++){
      t=new Date(sDate[d].startDate)
      var emp
      emp=this.checkEmp(t)
      var dayName = days[new Date(t).getDay()];
      if(sDate[d].title=="rdo"){
             var te=t.toISOString().split('T')[0].replaceAll('-', '/')
             this.eventSource.push( {"title": sDate[d].title,"startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
      }
      else{
        var te=t.toISOString().split('T')[0].replaceAll('-', '/')
        this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":emp,"selected":false,"slot":sDate[d].slot})
       }
    }
    this.defaultEventSource=this.eventSource
    this.listToMatrix(this.eventSource)
    this.spinner=false
    this.cdref.detectChanges()
  }
  loadingForReset
  async reset(){
    this.loadingForReset = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner:'bubbles',
      message: '',
      duration: 10000,

    });
    await this.loadingForReset.present();
    this.selectedLeaves=0
    this.rdosInLeave=0
    this.selectedLeaveDates=[]
    this.twoWeekNCSelection=[]
    this.remainingVacationHours=this.defaultremainingVacationHours
    this.eventSource=this.defaultEventSource
    this.listToMatrix(this.eventSource)
    this.loadingForReset.dismiss()
    this.cdref.detectChanges()

  }
  getCancelLine(date){
      if(date.getDate()<10){
        return 'strikethrough-single'
      }else{
        return 'strikethrough'
      }
  }
  onViewTitleChanged(title) {
      this.viewTitle = title;
  }
  loading
  async loader(){
  const loading = await this.loadingController.create({
    message: 'Wait',
    duration: 10000
  });
  await loading.present();
}
  increment(date,indexid){

    var tempArr=[]
      for(var i=0;i<this.selectedLeaveDates.length;i++){
        if(this.selectedLeaveDates[i].startTime!=date.startTime){
          tempArr.push(this.selectedLeaveDates[i])
        }
      }
      this.selectedLeaveDates=tempArr
      tempArr=this.eventSource
      var tempEmpDetailsArr=[],tempEmpDetails
      for(var i=0;i<tempArr.length;i++){
        if(tempArr[i].selected==true && tempArr[i].startTime==date.startTime){
          var tempALlEmp=[]
          for(var k=0;k<tempArr[i].emp.length;k++){
            tempALlEmp.push(tempArr[i].emp[k])
          }
          if(tempALlEmp.indexOf(this.empName) !== -1)
            {
              tempALlEmp = tempALlEmp.filter(e => e !== this.empName);
            }
            tempEmpDetails={"title": tempArr[i].title,"startTime":tempArr[i].startTime,"endTime":tempArr[i].endTime,"allDay":tempArr[i].allDay,"emp":tempALlEmp,"slot":tempArr[i].slot,"selected":false}
          tempEmpDetailsArr.push(tempEmpDetails)
        }else{
        var  tempEmpDetailsthree={"title": tempArr[i].title,"startTime":tempArr[i].startTime,"endTime":tempArr[i].endTime,"allDay":tempArr[i].allDay,"emp":tempArr[i].emp,"slot":tempArr[i].slot,"selected":tempArr[i].selected}
          tempEmpDetailsArr.push(tempEmpDetailsthree)
        }
      }
      this.eventSource=tempEmpDetailsArr
      this.selectedLeaves=0
      this.rdosInLeave=0
      for(var i=0;i<this.selectedLeaveDates.length;i++){
        if(this.selectedLeaveDates[i].title==''){
          if(this.selectedLeaveDates[i].slot-this.selectedLeaveDates[i].emp.length>0){
            var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }else if(this.selectedLeaveDates[i].title!=''){
            this.rdosInLeave++
        }

        }
    if(this.selectedLeaves<1){
      this.rdosInLeave=0
    }
        this.remainingVacationHours=this.defaultremainingVacationHours+ - +(this.selectedLeaves* 8)
         this.clickName='single'
      this.listToMatrix(this.eventSource)
      this.cdref.detectChanges()
    return this.slideOption.initialSlide=indexid

  }
  scrollId
  latestIndex=0
  Nccount=0
  isSingleClick: Boolean = true;
  singleClick(e){

    this.selectedDate=[]
    this.tempSelectedDate=e
    this.selectedDate=[]

    this.selectedDate.push({"event":e})
  }
  loadingT

  async checkRDOSSelection(e, k) {
    console.log('this.empSelectedShiftlineData===',this.empSelectedShiftlineData,e,k)
    var date
    date =e.startTime
    var checkDateIsExistOrNot=false
    var updatedDate,startDate,endDate
      updatedDate=new Date(date)
      for(var i=0;i<this.empSelectedShiftlineData.length;i++){
        startDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[2]),0,0,0)
        endDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[2]),0,0,0)
        if(startDate.getTime()<=updatedDate.getTime() && updatedDate.getTime()<=endDate.getTime() ){
          checkDateIsExistOrNot=true
        }
      }
      this.loadingT.dismiss();
    if(checkDateIsExistOrNot==true){

      if(this.totalEmpVacationHours<8){
        this.checkVacationHrs=true
        if(this.user_data.role=='emp'){
          this.updateNextEmpData()
        }else{
          this.updateNextEmpDataBidManager()
        }
      }else{
        this.dblClickMethod(e,k)
      }


    }else{
        if(!this.alertPresented) {
          var temp="You don't have any schedule for "
          for(var i=0;i<this.donthaveanyscheduledates.length;i++){
            temp= temp+ this.donthaveanyscheduledates[i].shiftlineScheduleName+' ('+this.donthaveanyscheduledates[i].data.shiftdefstartdate+' to '+this.donthaveanyscheduledates[i].data.shiftdefenddate+')'
            if((i+ + +1)!=this.donthaveanyscheduledates.length){
              temp= temp+', '
            }
          }
            if(temp=="You don't have any schedule for "){
              temp="You don't have any schedule for this date"
            }
          this.alertPresented = true
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: temp+" !!",
            buttons: [{text:'OK', handler: () => {
              this.alertPresented = false}
            }]
          });
        await alert.present();
        }
    }
  }
  async dblClickMethod(e,k){

   this.cdref.detectChanges()
    this.currentSelectedDate=e
      if(this.currentSelectedDate===this.tempSelectedDate){
        this.tempSelectedDate=''
      }
    var d=this.currentSelectedDate.startTime
    var tempArr=[] ,temp,date
    var checkEmp
              checkEmp=this.currentSelectedDate.emp.some(el => el === this.empName)
              if(checkEmp==false){

if(this.remainingVacationHours>0){



  //2 Week NC
  if(this.cal_id==0){
    const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
  if(found==false){
    if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
      if(this.currentSelectedDate.title==''){
        if(this.twoWeekNCSelection.length>13){
          this.alertPresented = true
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: "<p style='text-align: left !important;'>You cannot select more than 2 weeks of NC leave.</br></br>Please select Yes if you would like to unselect the previous date picks.</p>",
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  this.alertPresented = false
                }
              },
              {text:'Yes', handler: () => {
              this.alertPresented = false
              this.six()}
            }]
          })
          await alert.present();




        }else{
          this.six()
        }

      }
    }else{
      this.alertPresented = true
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'All slots are filled. Please select other dates.',
        buttons: [{text:'OK', handler: () => {
          this.alertPresented = false}
        }]
      });
      await alert.present();
      }
  }
  else{
    const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
    this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
    this.selectedLeaves=0
    this.rdosInLeave=0
    for(var i=0;i<this.selectedLeaveDates.length;i++){
      if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
        var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
        this.selectedLeaves=this.selectedLeaves+ + +shift_duration
      }
    }
  }
  }
  //2 Week C
  else if(this.cal_id==1){
    const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
  if(found==false){
    if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
      if(this.currentSelectedDate.title==''){this.one()}
    }else{
      this.alertPresented = true
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'All slots are filled. Please select other dates.',
        buttons: [{text:'OK', handler: () => {
          this.alertPresented = false}
        }]
      });
      await alert.present();
      }
  }
  else{
    const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
    this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
    this.selectedLeaves=0
    this.rdosInLeave=0
    for(var i=0;i<this.selectedLeaveDates.length;i++){
      if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
          var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
      }
    }
  }
  }
  //5 Days
   else if(this.cal_id==2){
        const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
      if(found==false){
        if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
          if(this.currentSelectedDate.title==''){this.two()}
        }else{
          this.alertPresented = true
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'All slots are filled. Please select other dates.',
            buttons: [{text:'OK', handler: () => {
              this.alertPresented = false}
            }]
          });
          await alert.present();
          }
      }
      else{
        const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
        this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
        this.selectedLeaves=0
        this.rdosInLeave=0
        for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
              var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }
      }
      }
    //1 Week
    else if(this.cal_id==4){
          const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
        if(found==false){
          if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
            if(this.currentSelectedDate.title==''){

              this.four()
            }
          }else{
            this.alertPresented = true
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Alert',
              message: 'All slots are filled. Please select other dates.',
              buttons: [{text:'OK', handler: () => {
                this.alertPresented = false}
              }]
            });
            await alert.present();
            }
        }
        else{
          const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
          this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
          this.selectedLeaves=0
          this.rdosInLeave=0
          for(var i=0;i<this.selectedLeaveDates.length;i++){
            if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
                var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
            }
          }
        }
      }


    //Up to 10 Days NC
    else if(this.cal_id==3){
          const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
        if(found==false){
          if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
            if(this.currentSelectedDate.title==''){this.three()}
          }else{
            this.alertPresented = true
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Alert',
              message: 'All slots are filled. Please select other dates.',
              buttons: [{text:'OK', handler: () => {
                this.alertPresented = false}
              }]
            });
            await alert.present();
            }
        }
        else{
          const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
          this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
          this.selectedLeaves=0
          this.rdosInLeave=0
          for(var i=0;i<this.selectedLeaveDates.length;i++){
            if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
                var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
            }
          }
        }
      }
//1 Day
    else if(this.cal_id==5){
      const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
    if(found==false){
      if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
        if(this.currentSelectedDate.title==''){
           this.selectedLeaveDates=[]
          var defaultremainingVacationHours=this.defaultremainingVacationHours
          if(defaultremainingVacationHours>7){
            this.selectedLeaveDates.push(this.currentSelectedDate)
          }
            this.selectedLeaves=0
            this.rdosInLeave=0
              for(var i=0;i<this.selectedLeaveDates.length;i++){
                if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
                    var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
            }
          }
      }
      }else{
        this.alertPresented = true
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: 'All slots are filled. Please select other dates.',
          buttons: [{text:'OK', handler: () => {
            this.alertPresented = false}
          }]
        });
        await alert.present();
        }
    }
    else{
      const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
      this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
      this.selectedLeaves=0
      this.rdosInLeave=0
      for(var i=0;i<this.selectedLeaveDates.length;i++){
        if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
            var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
        }
      }
    }

    }

  //Up to 5 Days NC
   else if(this.cal_id==6){
        const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
      if(found==false){
        if(this.currentSelectedDate.emp.length<this.currentSelectedDate.slot){
          if(this.currentSelectedDate.title==''){this.seven()}
        }else{
          this.alertPresented = true
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'All slots are filled. Please select other dates.',
            buttons: [{text:'OK', handler: () => {
              this.alertPresented = false}
            }]
          });
          await alert.present();
          }
      }
      else{
        const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
        this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
        this.selectedLeaves=0
         this.rdosInLeave=0
        for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
              var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }
      }
    }
  }


  else{
    if(this.selectedLeaveDates.length>0){
      const found = this.selectedLeaveDates.some(el => el.startTime === this.currentSelectedDate.startTime);
      if(found==true){
      const indx = this.selectedLeaveDates.findIndex(v => v.startTime === this.currentSelectedDate.startTime);
      this.selectedLeaveDates.splice(indx, indx >= 0 ? 1 : 0);
      this.selectedLeaves=0
       this.rdosInLeave=0
        for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
            var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
            this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }
      }
    }
  }
  this.selectedLeaveDates=this.selectedLeaveDates.sort((a,b)=>{return a.startTime.getTime() - b.startTime.getTime()})
  this.remainingVacationHours=this.defaultremainingVacationHours+ - +(this.selectedLeaves)
 }else{
                this.alertPresented = true
                const alert = await this.alertController.create({
                  cssClass: 'my-custom-class',
                  header: 'Alert',
                  message: 'You already selected this date in a previous round.',
                  buttons: [{text:'OK', handler: () => {
                    this.alertPresented = false}
                  }]
                });
                await alert.present();


            }
  }
  checkscrolle=false

  async selectDate(e,k){
    this.checkscrolle=true

    // this.clickCount++;
    // setTimeout(async () => {
    //     if (this.clickCount==1) {
    //          // single
    //          this.increment(e,k)
    //      } else if(this.clickCount==2) {
    //         // double
            this.clickCount = 0;
            if(this.checkscrolle==true){
              this.cdref.detectChanges()
              this.loadingT = await this.loadingController.create({
                cssClass: 'custom-loading',
                spinner:'bubbles',
                message: '',
                duration: 10000,

              });
              await this.loadingT.present();
            this.checkRDOSSelection(e,k)}
          // }
          // this.clickCount = 0;
    // }, 250)
  }
  qvalue
  test(){

  }
  conditionOne(e){
    return (!(this.tempSelectedDate!=null&&e.selected!==true  && e===this.tempSelectedDate)&&e.selected!==true)
  }
  conditionTwo(e){

    return (e.selected==true)
  }
  conditionThree(e){
    return (this.tempSelectedDate!=null&&e.selected!==true  && e===this.tempSelectedDate)
  }
  checkSelectedDates(data){
    var checkEmp
    checkEmp=data.emp.some(el => el === this.empName)
    if(checkEmp==true){
      return 'selected-leave-background-color '
    }else{
      return ''
    }
  }
  conditionFour(e){
    // var arr=['09/06/2021','10/11/2021','01/11/2021']
    var arr=[]
    var i=0
    do{
      if(new Date(e.date).getDate() === new Date(arr[i]).getDate() && new Date(e.date).getMonth() === new Date(arr[i]).getMonth() && new Date(e.date).getFullYear() === new Date(arr[i]).getFullYear()){
           this.holiday= true
           return (this.holiday= true)
      }else{
        i++
      }
    }while(i<arr.length)
  }
checkSlotsEmp(e){

  var check=false
  if(this.selectedLeaveDates.length>0){


    var checkEmp
    checkEmp=e.emp.some(el => el === this.empName)
    if(checkEmp==false){
    for(var i=0;i<this.selectedLeaveDates.length;i++){
    if(e.startTime.getTime()==this.selectedLeaveDates[i].startTime.getTime()){
      if(this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
         check=true
      }else{
        check=false
      }

    }

  }      }else{
    check = false
  }

  if(check==true){
      return 'visible'
    }else{
      return 'hidden'
    }
  }else{
    return 'hidden'
  }
}
checkSelectedSlotsEmp(e){
  var check=false
  if(this.selectedLeaveDates.length>0){


    var checkEmp
    checkEmp=e.emp.some(el => el === this.empName)
    if(checkEmp==false){
    for(var i=0;i<this.selectedLeaveDates.length;i++){
    if(e.startTime.getTime()==this.selectedLeaveDates[i].startTime.getTime()){
      if(this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
         check=true
      }else{
        check=false
      }

    }

  }      }else{
    check = false
  }


    if(check==true){
      return 'hidden'
    }else{
      return 'visible'
    }
  }else{
    return 'hidvisibleden'
  }
}
  checkConditionTwoDoubleCLick(e){
    var check=false

    if(this.selectedLeaveDates.length>0){


      var checkEmp
      checkEmp=e.emp.some(el => el === this.empName)
      if(checkEmp==false){
      for(var i=0;i<this.selectedLeaveDates.length;i++){
      if(e.startTime.getTime()==this.selectedLeaveDates[i].startTime.getTime()){
        if(this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
           check=true
        }else{
          check=false
        }

      }

    }      }else{
      check = false
    }

    if(check==true){
      return 'double-click font-bold'
    }else{
      return ''
    }
  }else{
    return ''
  }
//     if (e.emp.indexOf(this.empName) !== -1 ) {
//       // if( e.slot-e.emp.length>0){
//
//       // }
//       return true
//     }else{
//       return false
//     }

  }
  checkHoliday(){
    // var arr=['09/06/2021','10/11/2021','01/11/2021']
    var arr=[]
  var i=0


   do{
    for(var j=0;j<this.eventSource.length;j++){
      var e={"date":this.eventSource[j].startTime}

      if(new Date(e.date).getDate() === new Date(arr[i]).getDate() && new Date(e.date).getMonth() === new Date(arr[i]).getMonth() && new Date(e.date).getFullYear() === new Date(arr[i]).getFullYear()){

    i++
    //  'bg-color'
    }else{
      i++
      // return ''
    }}
  }while(i<arr.length)

  }
  cssClassSingle(){
    // this.cdref.detectChanges()
    return this.cssClassForsingleClick
}
cssClassDouble(){
  return 'double-click'
}







// 2 WEEK C
one(){
  var d=this.currentSelectedDate.startTime
  var i=0
  this.t=0
  var rHours=this.defaultremainingVacationHours
  var totalHours=this.totalEmpVacationHours
    var totalRHours=totalHours%8
    if(totalRHours>0){
      totalRHours=8+ - +totalRHours
      totalHours=totalHours + + +totalRHours
    }
    totalHours=totalHours+ - +this.totalgetVacationHours
    if(totalHours<1){
      totalHours=0
    }
    this.selectedLeaveDates=[]
    var date,temp,totalDay=14
    do{
      if(this.t<totalDay){
         d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
      }
      date=this.eventSource[i].startTime
      if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
            temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
            this.t++
            var checkEmp
            checkEmp=this.eventSource[i].emp.some(el => el === this.empName)
            if(checkEmp==false){
            if(this.eventSource[i].slot>this.eventSource[i].emp.length && this.eventSource[i].title!='rdo'){
                 var shift_duration=this.checkShiftDuration(this.eventSource[i].startTime)
                       rHours=rHours+ - +shift_duration
            }
           if(rHours>=0){
            this.selectedLeaveDates.push(temp)
           }
          }
       }
      i++;
     }while (i<this.eventSource.length)
      this.selectedLeaves=0
      this.rdosInLeave=0
        for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
              var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }
  }








//5 Days NC
async seven(){
  var totalHours=this.totalEmpVacationHours
  var shift_duration=this.checkShiftDuration(this.currentSelectedDate.startTime)
  this.totalgetVacationHours=shift_duration
  var totalRHours=totalHours%shift_duration
  if(totalRHours>0){
    totalRHours=shift_duration+ - +totalRHours
    totalHours=totalHours + + +totalRHours
  }
  totalHours=totalHours+ - +this.totalgetVacationHours
  if(totalHours<1){
    totalHours=0
  }
  if(this.remainingVacationHours>7){
    if( this.selectedLeaveDates.length<5){
      var checkEmp
           checkEmp=this.currentSelectedDate.emp.some(el => el === this.empName)
           if(checkEmp==false){


      if( totalHours>0){
        var shift_duration=this.checkShiftDuration(this.currentSelectedDate.startTime)
        totalHours=totalHours+ - +shift_duration
      }
      this.selectedLeaveDates.push(this.currentSelectedDate)
    }

    }else{
      if(!this.alertPresented ) {
        this.alertPresented = true
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: "You cannot select more than 5 days of NC leave. Please unselect a date and select another date.",
          buttons: [{text:'OK', handler: () => {
            this.alertPresented = false}
          }]
          });
        await alert.present();
        }
      }
    }
        this.selectedLeaves=0
      this.rdosInLeave=0
    for(var i=0;i<this.selectedLeaveDates.length;i++){
      if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
          var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
      }
    }
  }





// Up to 10 DAYS
  async three(){

  var totalHours=this.totalEmpVacationHours
  var shift_duration=this.checkShiftDuration(this.currentSelectedDate.startTime)
  this.totalgetVacationHours=shift_duration
  var totalRHours=totalHours%shift_duration
  if(totalRHours>0){
    totalRHours=shift_duration+ - +totalRHours
    totalHours=totalHours + + +totalRHours
  }
  totalHours=totalHours+ - +this.totalgetVacationHours
  if(totalHours<1){
    totalHours=0
  }
  if(this.remainingVacationHours>7){
      if( this.selectedLeaveDates.length<10){
        var checkEmp
            checkEmp=this.currentSelectedDate.emp.some(el => el === this.empName)
            if(checkEmp==false){

        if( totalHours>0){
          totalHours=totalHours+ - +shift_duration
        }
        this.selectedLeaveDates.push(this.currentSelectedDate)
      }
      }else{
        if(!this.alertPresented) {
          this.alertPresented = true
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: "You cannot select more than 10 days of NC leave. Please unselect a date and select another date.",
            buttons: [{text:'OK', handler: () => {
              this.alertPresented = false}
            }]
            });
          await alert.present();
      }
    }
  }
      this.selectedLeaves=0
      this.rdosInLeave=0
    for(var i=0;i<this.selectedLeaveDates.length;i++){
      if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
          var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
      }
    }
  }

//1 Week
four(){
  var d=this.currentSelectedDate.startTime
  var i=0
  this.t=0
  var rHours=this.defaultremainingVacationHours
  var totalHours=this.totalEmpVacationHours
    var totalRHours=totalHours%8
    if(totalRHours>0){
      totalRHours=8+ - +totalRHours
      totalHours=totalHours + + +totalRHours
    }
    totalHours=totalHours+ - +this.totalgetVacationHours
    if(totalHours<1){
      totalHours=0
    }
    this.selectedLeaveDates=[]
    var date,temp,totalDay=7
    do{

      if(this.t<totalDay){
         d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))

         date=this.eventSource[i].startTime
         if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
               temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
               this.t++
               var checkEmp

               checkEmp=this.eventSource[i].emp.some(el => el === this.empName)

               if(checkEmp==false){
                if(this.eventSource[i].slot>this.eventSource[i].emp.length && this.eventSource[i].title!='rdo'){
                      var shift_duration=this.checkShiftDuration(this.eventSource[i].startTime)
                          rHours=rHours+ - +shift_duration
                }
            if(rHours>=0){
              this.selectedLeaveDates.push(temp)
            }
          }
        }
       }
      i++;
     }while (i<this.eventSource.length)
      this.selectedLeaves=0
      this.rdosInLeave=0
        for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
              var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
          }
        }
  }


  two(){
    var d=this.currentSelectedDate.startTime
    var i=0
    this.t=0
    var rHours=this.defaultremainingVacationHours
    var totalHours=this.totalEmpVacationHours
      var totalRHours=totalHours%8
      if(totalRHours>0){
        totalRHours=8+ - +totalRHours
        totalHours=totalHours + + +totalRHours
      }
      totalHours=totalHours+ - +this.totalgetVacationHours
      if(totalHours<1){
        totalHours=0
      }
      this.selectedLeaveDates=[]
      var date,temp,totalDay=5
      do{
        if(this.t<totalDay){
           d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
        }
        date=this.eventSource[i].startTime
        if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
              temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
              this.t++
              var checkEmp
            checkEmp=this.eventSource[i].emp.some(el => el === this.empName)
            if(checkEmp==false){
             if(this.eventSource[i].slot>this.eventSource[i].emp.length && this.eventSource[i].title!='rdo'){
                   var shift_duration=this.checkShiftDuration(this.eventSource[i].startTime)
                       rHours=rHours+ - +shift_duration
             }
            if(rHours>=0){
              this.selectedLeaveDates.push(temp)
            }
          }

         }
        i++;
       }while (i<this.eventSource.length)
        this.selectedLeaves=0
        this.rdosInLeave=0
          for(var i=0;i<this.selectedLeaveDates.length;i++){
            if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
                var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration
            }
          }
    }
    twoWeekNCSelection=[]
// 2 WEEK NC
    six(){

      var d=this.currentSelectedDate.startTime
      var i=0
      this.t=0
      var rHours=this.defaultremainingVacationHours
      var totalHours=this.totalEmpVacationHours
        var totalRHours=totalHours%8
        if(totalRHours>0){
          totalRHours=8+ - +totalRHours
          totalHours=totalHours + + +totalRHours
        }
        totalHours=totalHours+ - +this.totalgetVacationHours
        if(totalHours<1){
          totalHours=0
        }
        if(this.twoWeekNCSelection.length>13){
          this.selectedLeaveDates=[]
          this.twoWeekNCSelection=[]
        }
        if(this.twoWeekNCSelection.length<7){
        var date,temp,totalDay=7
        do{
          if(this.t<totalDay){
             d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
          }
          date=this.eventSource[i].startTime
          if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
                temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
                this.t++
                var checkEmp
                if(this.remainingVacationHours>7){
            checkEmp=this.eventSource[i].emp.some(el => el === this.empName)
            if(checkEmp==false){
                if(this.eventSource[i].slot>this.eventSource[i].emp.length && this.eventSource[i].title!='rdo'){
                 var shift_duration=this.checkShiftDuration(this.eventSource[i].startTime)
                   rHours=rHours+ - +shift_duration
               }
               if(rHours>=0){
                this.selectedLeaveDates.push(temp)
               }
              }
              this.twoWeekNCSelection.push(temp)
            }
           }
          i++;
         }while (i<this.eventSource.length)

        }else if(this.twoWeekNCSelection.length<14){
          var date,temp,totalDay=7
          rHours=this.remainingVacationHours
          do{
            if(this.t<totalDay){
               d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
            }
            date=this.eventSource[i].startTime
            if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
                  temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
                  this.t++
                  var checkEmp

                  if(this.remainingVacationHours>7){

                  checkEmp=this.eventSource[i].emp.some(el => el === this.empName)
                  if(checkEmp==false){
                     if(this.eventSource[i].slot>this.eventSource[i].emp.length){
                       var shift_duration=this.checkShiftDuration(this.eventSource[i].startTime)
                       rHours=rHours+ - +shift_duration
                     }
                     if(rHours>=0){
                       this.selectedLeaveDates.push(temp)
                     }
                    }
                  }
                  this.twoWeekNCSelection.push(temp)
             }
            i++;
           }while (i<this.eventSource.length)
        }
          this.selectedLeaves=0
          this.rdosInLeave=0
          this.selectedLeaveDates=this.selectedLeaveDates.filter((value, index, self) =>index === self.findIndex((t) => (t.startTime === value.startTime && t.endTime === value.endTime)))
            for(var i=0;i<this.selectedLeaveDates.length;i++){
              if(this.selectedLeaveDates[i].title=='' && this.selectedLeaveDates[i].slot>this.selectedLeaveDates[i].emp.length){
                var shift_duration=this.checkShiftDuration(this.selectedLeaveDates[i].startTime)
                  this.selectedLeaves=this.selectedLeaves+ + +shift_duration

              }
            }
            this.remainingVacationHours=this.defaultremainingVacationHours+ - +(this.selectedLeaves)
    }





    checkShiftDuration(date){
      var updatedDate,startDate,endDate
      updatedDate=date
      for(var i=0;i<this.empSelectedShiftlineData.length;i++){
        startDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[2]),0,0,0)
        endDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[2]),0,0,0)
        if(startDate.getTime()<=updatedDate.getTime() && updatedDate.getTime()<=endDate.getTime() ){
          if(this.empSelectedShiftlineData[i].shiftdurationc !=null && this.empSelectedShiftlineData[i].shiftdurationc==undefined){
            return 8
          }else{
            if(this.empSelectedShiftlineData[i].shiftdurationc==9){
              var rdo=9
              // if(updatedDate<new Date(2023,0,15)){
                  // console.log(this.empSelectedShiftlineData[i],this.datesForNineHoursShift)
                  if(updatedDate.getDay()==0){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0){
                            if(this.empSelectedShiftlineData[i].sun!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].sun.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].sunshift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].sunshift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==1){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0){
                            if(this.empSelectedShiftlineData[i].mon!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].mon.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].monshift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].monshift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==2){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0){
                            if(this.empSelectedShiftlineData[i].tue!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].tue.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].tueshift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].tueshift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==3){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0){
                            if(this.empSelectedShiftlineData[i].wed!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].wed.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].wedshift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].wedshift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==4){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0 ){
                            if(this.empSelectedShiftlineData[i].thu!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].thu.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].thushift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].thushift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==5){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0){
                            if(this.empSelectedShiftlineData[i].fri!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].fri.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].frishift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].frishift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }else if(updatedDate.getDay()==6){
                    for(var d=0;d<this.datesForNineHoursShift.length;d++){
                      for(var day=0;day<this.datesForNineHoursShift[d].length;day++){
                        if(this.datesForNineHoursShift[d][day].getTime()<=updatedDate.getTime() && updatedDate.getTime()<=this.datesForNineHoursShift[d][day].getTime()){
                          if(day<7 && day>=0 ){
                            if(this.empSelectedShiftlineData[i].sat!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].sat.split('-')[1])
                            }
                          }else if(day<14 && day>6){
                            if(this.empSelectedShiftlineData[i].satshift2!='X'){
                              rdo=Number(this.empSelectedShiftlineData[i].satshift2.split('-')[1])
                            }
                          }
                        }
                      }
                    }
                  }
              return rdo
            }else{
              return this.empSelectedShiftlineData[i].shiftdurationc
            }

          }
        }
      }
    }






six0(){
  var d=this.currentSelectedDate.startTime
  var totalHours=this.totalEmpVacationHours
  var totalSelectedhours=0
  this.totalgetVacationHours=8
  var totalRHours=totalHours%8
  if(totalRHours>0){
    totalRHours=8+ - +totalRHours
    totalHours=totalHours + + +totalRHours
  }
  totalHours=totalHours+ - +this.totalgetVacationHours
  if(totalHours<1){
    totalHours=0
  }
  var tempArr=[] ,temp,date,arr=new Array()
  if(this.twoWeekNCSelection.length>13){
    this.selectedLeaveDates=[]
    this.twoWeekNCSelection=[]
  }

  var count=0
    for(var i=0;i<this.eventSource.length;i++){
      if(this.eventSource[i].selected==true){

      }
    }
    for(var i=0;i<this.selectedLeaveDates.length;i++)
    {
      d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate())))
      date=this.selectedLeaveDates[i].startTime
      if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
        this.selectedLeaveDates=[]
        this.twoWeekNCSelection=[]
      }
    }
  if(this.twoWeekNCSelection.length<7){
    var i=0
    this.t=0
    var tempArr1=[]
    this.twoWeekNCSelection=[]
    this.selectedLeaveDates=[]
    for(var k=0;k<this.eventSource.length;k++){
      tempArr1.push({"title": this.eventSource[k].title,"startTime":this.eventSource[k].startTime,"endTime":this.eventSource[k].endTime,"allDay": this.eventSource[k].allDay,"emp":this.eventSource[k].emp,"slot":this.eventSource[k].slot,"selected":false})
    }
    this.eventSource=this.defaultEventSource
    var totalDay=7
       do{
         if(this.t<totalDay){
        d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
         }
         date=this.eventSource[i].startTime

         if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
           if(this.eventSource[i].title=='rdo'){
             temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
             this.t++
         }else{
           if(this.eventSource[i].selected==false && totalHours>0){
             temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
             this.t++
             totalHours=totalHours+ - +8
           }else{
             temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
             this.t++

           }
         }
         if( totalHours+ + +8>0){
           this.selectedLeaveDates.push(temp)
           this.twoWeekNCSelection.push(temp)
         }
            tempArr.push(temp)
         }else{
           temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
          tempArr.push(temp)
         }
        i++;
    }while (i<this.eventSource.length)
  }else if(this.twoWeekNCSelection.length<14){
    var i=0
    this.t=0
    var tempArr1=[]
    var totalDaySeven=7
      do{
        if(this.t<totalDaySeven){
          d=(new Date(new Date(this.currentSelectedDate.startTime).setDate(new Date(this.currentSelectedDate.startTime).getDate()+this.t )))
        }
        date=this.eventSource[i].startTime
                for (var c = 0; c < this.selectedLeaveDates.length; c++) {
                    if(new Date(d).getTime() === new Date(this.selectedLeaveDates[c].startTime).getTime() && this.selectedLeaveDates[c].startTime=='') {
                        arr=[]
                        this.eventSource=this.defaultEventSource
                      }
                  }
        if(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()){
          if(this.eventSource[i].title=='rdo'){
            temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
            this.t++
        }
        else{
            if(this.eventSource[i].selected==false && totalHours>0){
              temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":true}
              this.t++
              totalHours=totalHours+ - +8
            }else{
              temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
              this.t++
            }
          }
          if( totalHours+ + +8>0){
            this.selectedLeaveDates.push(temp)
            this.twoWeekNCSelection.push(temp)
          }
          tempArr.push(temp)
        }else{
          temp={"title": this.eventSource[i].title,"startTime":this.eventSource[i].startTime,"endTime":this.eventSource[i].endTime,"allDay": this.eventSource[i].allDay,"emp":this.eventSource[i].emp,"slot":this.eventSource[i].slot,"selected":this.eventSource[i].selected}
         tempArr.push(temp)
        }
        i++;
    }while (i<this.eventSource.length)
  }else{
  this.selectedLeaveDates=[]
  this.twoWeekNCSelection=[]
  tempArr=this.defaultEventSource
  }

var count=0
  for(var i=0;i<tempArr.length;i++){
    if(tempArr[i].selected==true){
      count++
    }
  }
  if(arr.length>2){
  for(var a=0;a<arr.length;a++){
        this.selectedLeaveDates.push(arr[a])
        this.twoWeekNCSelection.push(arr[a])
  }
}

if(count<15){
var tempEmpDetails,tempEmpDetailsArr=[]
for(var i=0;i<tempArr.length;i++){
if(tempArr[i].selected==true){
        if(tempArr[i].emp.length<tempArr[i].slot){
          var tempALlEmp=[]
          for(var k=0;k<tempArr[i].emp.length;k++){
            tempALlEmp.push(tempArr[i].emp[k])
          }
          if(tempALlEmp.indexOf(this.empName) !== -1)
            {

            }   else{
              tempALlEmp.push(this.empName)
            }

            tempEmpDetails={"title": tempArr[i].title,"startTime":tempArr[i].startTime,"endTime":tempArr[i].endTime,"allDay":tempArr[i].allDay,"emp":tempALlEmp,"slot":tempArr[i].slot,"selected":tempArr[i].selected}
          tempEmpDetailsArr.push(tempEmpDetails)
          }else{
            var tempEmpDetailsTwo={"title": tempArr[i].title,"startTime":tempArr[i].startTime,"endTime":tempArr[i].endTime,"allDay":tempArr[i].allDay,"emp":tempArr[i].emp,"slot":tempArr[i].slot,"selected":tempArr[i].selected}
            tempEmpDetailsArr.push(tempEmpDetailsTwo)
          }
  }else{
    var  tempEmpDetailsthree={"title": tempArr[i].title,"startTime":tempArr[i].startTime,"endTime":tempArr[i].endTime,"allDay":tempArr[i].allDay,"emp":tempArr[i].emp,"slot":tempArr[i].slot,"selected":tempArr[i].selected}
      tempEmpDetailsArr.push(tempEmpDetailsthree)
    }
  }
    this.cdref.detectChanges()
    this.selectedLeaveDates=this.selectedLeaveDates.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    var result  = [...new Map(this.selectedLeaveDates.map(item => [item.startTime, item])).values()]
    this.selectedLeaveDates=result
    return tempEmpDetailsArr
  }else{
    return this.eventSource
  }
}



loadingfinal
  async continue(){
  this.loadingfinal = await this.loadingController.create({
    cssClass: 'custom-loading',
    spinner:'bubbles',
    message: '',
    duration: 10000,

  });
  await this.loadingfinal.present();
  if(this.checkduplicate===false){
    this.checkduplicate=true
    this.continueOne()
  }

}
checkduplicate=false
continueOne(){

this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe(async (res)=>{
  var tempObjn,tempArrn=[]
  tempArrn=res
    for(var i=0;i<tempArrn.length;i++){
      if(Number(this.bidSchedule.bidschid)==tempArrn[i].bidschidref && tempArrn[i].roundseq_id==(Number(this.round_id)+ +  +1)){
        tempObjn=tempArrn[i]
      }
    }
    if(tempObjn.vacationbidstatus=='Eligible'){
      var lastDate=[]
      this.selectedLeaveDates=this.selectedLeaveDates.sort((a,b)=>{return a.startTime.getTime() - b.startTime.getTime()})
      for(var i=0;i<this.selectedLeaveDates.length;i++){
          if(this.selectedLeaveDates[i].title=='' ){
            if(this.selectedLeaveDates[i].emp.length<this.selectedLeaveDates[i].slot){
                lastDate.push(new Date(Number(this.selectedLeaveDates[i].startTime.getFullYear()),Number(this.selectedLeaveDates[i].startTime.getMonth()),Number(this.selectedLeaveDates[i].startTime.getDate()),0,0,0))
            }
          }
      }
      var s,e,c=false,sdate=false,tempArr=[],temp,tempArrTwo=[],checkdate,newDate,selectedDate,selectedHours=0,old_shift_duraton=null
      for(var i=0;i<lastDate.length;i++){
          newDate=new Date(Number(lastDate[i].getFullYear()),Number(lastDate[i].getMonth()),Number(lastDate[i].getDate())+ + +1,0,0,0)
          checkdate=!!lastDate.find(item => {return item.getTime() == newDate.getTime()});

            if(checkdate==false){
              var shift_duration=this.checkShiftDuration(lastDate[i])
              if(old_shift_duraton!=shift_duration && old_shift_duraton!=null){
                tempArr.push({"dates":tempArrTwo,"hours":selectedHours,"shift_duration":old_shift_duraton})
                selectedHours=0
                tempArrTwo=[]
                tempArrTwo.push(lastDate[i])
                selectedHours=selectedHours+ + +shift_duration
                tempArr.push({"dates":tempArrTwo,"hours":selectedHours,"shift_duration":shift_duration})
                old_shift_duraton=shift_duration
                selectedHours=0
                tempArrTwo=[]
              }else{
                tempArrTwo.push(lastDate[i])
                selectedHours=selectedHours+ + +shift_duration
                tempArr.push({"dates":tempArrTwo,"hours":selectedHours,"shift_duration":shift_duration})
                old_shift_duraton=shift_duration
                selectedHours=0
                tempArrTwo=[]
              }
            }else{
              var shift_duration=this.checkShiftDuration(lastDate[i])
              if(old_shift_duraton!=shift_duration && old_shift_duraton!=null){
                tempArr.push({"dates":tempArrTwo,"hours":selectedHours,"shift_duration":old_shift_duraton})
                selectedHours=0
                tempArrTwo=[]
                tempArrTwo.push(lastDate[i])
                selectedHours=selectedHours+ + +shift_duration
                old_shift_duraton=shift_duration
              }else{
                tempArrTwo.push(lastDate[i])
                var shift_duration=this.checkShiftDuration(lastDate[i])
                selectedHours=selectedHours+ + +shift_duration
                old_shift_duraton=shift_duration
              }
            }
        }
        var bs,confirmationMsg=[]
        var tempArrTwo=[]
        for(var i=0;i<tempArr.length;i++){
            var startDate=new Date(Math.min.apply(null,tempArr[i].dates))
            var endDate=new Date(Math.max.apply(null,tempArr[i].dates))
          if(this.user_data.role!='emp'){
            bs='Manager Completed'
          }else{
            bs=' Completed'
          }
          var shiftHour=8
          if(tempArr[i].shift_duration==null || tempArr[i].shift_duration==undefined){
            shiftHour=8
          }else{
            shiftHour= tempArr[i].shift_duration
          }
        var tempObj={
          "bidstatus": bs,
          "windowstatus": "",
          "bidschidref": this.bid_schedule_id,
          "bidschename":this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name,
          "empidref": this.empId,
          "initials": this.empName,
          "roundseq_id": Number(this.round_id)+ + +1,
          "vcationhours": tempArr[i].hours,
          "vacationstartdate": startDate,
          "vacationenddate": endDate,
          "actualvacationstartdate":'',
          "actualvacationenddate":'',
          "rdos":this.rdosInLeave,
          "vacation_hours_remain":'',
          "shift_vacation_hours":shiftHour,
          "vacation_seq_no":i+ + +1
        }
        if(tempObj.vcationhours>Number(shiftHour)){
          confirmationMsg.push((startDate.getMonth()+ + +1)+'/'+startDate.getDate()+'-'+(endDate.getMonth()+ + +1)+'/'+endDate.getDate()+ ' ('+shiftHour+'hr)')
        }else{
          if(tempObj.vcationhours>0){
            confirmationMsg.push((startDate.getMonth()+ + +1)+'/'+startDate.getDate()+ ' ('+shiftHour+'hr)')
          }
        }
        tempArrTwo.push(tempObj)
      }
      this.loadingfinal.dismiss()
      if(confirmationMsg.length>0){

      }
      var tempArrThree=[],temp,countVacation=0
      for(var v=0;v<tempArrTwo.length;v++){
        temp=tempArrTwo[v]
        if(temp.vacationstartdate!='Invalid Date' && temp.vacationenddate!='Invalid Date' && temp.vacationstartdate!=null && temp.vacationenddate!=null && temp.vacationstartdate!=undefined && temp.vacationenddate!=undefined){
          countVacation++
          var tempNewObj={
            "bidstatus": temp.bidstatus,
            "windowstatus": "",
            "bidschidref": this.bid_schedule_id,
            "bidschename":this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name,
            "empidref": this.empId,
            "initials": this.empName,
            "roundseq_id": Number(this.round_id)+ + +1,
            "vcationhours":temp.vcationhours,
            "vacationstartdate": temp.vacationstartdate,
            "vacationenddate": temp.vacationenddate,
            "actualvacationstartdate":'',
            "actualvacationenddate":'',
            "rdos":this.rdosInLeave,
            "vacation_hours_remain":'',
            "shift_vacation_hours":temp.shift_vacation_hours,
            "vacation_seq_no":countVacation
          }
          tempArrThree.push(tempNewObj)
        }
      }
      // console.log(tempArrThree)
      var className='leaveSelectionConfirmation-ios'
      if(/iPhone/i.test(navigator.userAgent)){
        className='leaveSelectionConfirmation-ios'
      }else{
        className='leaveSelectionConfirmation'
      }
      const modal = await this.modalCtrl.create({
        component: LeaveSelectionConfirmationComponent,
        cssClass: className,
        componentProps:{confirmation_Msg:confirmationMsg},
        swipeToClose:true
      });
      modal.onDidDismiss()
      .then(async (data) => {
      if(data.role=='yes'){
        this.loadingfinal = await this.loadingController.create({
          cssClass: 'custom-loading',
          spinner:'bubbles',
          message: '',
          duration: 10000,

        });
        await this.loadingfinal.present();
      this.bidWindowSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
        var tempObjn,tempArrn=[]
        tempArrn=res
          for(var i=0;i<tempArrn.length;i++){
            if(Number(this.bidSchedule.bidschid)==tempArrn[i].bidschidref && tempArrn[i].roundseq_id==(Number(this.round_id)+ +  +1)){
              tempObjn=tempArrn[i]
            }
          }
          if(tempObjn.vacationbidstatus=='Eligible'){
            this.bidLeaveSer.saveData(tempArrThree).subscribe((res)=>{
              this.user_data=JSON.parse(sessionStorage.getItem('userData'))
              if(this.user_data.role=='emp'){
                this.final()
              }else{
                this.managerFinal()
              }
            },async (err)=>{console.log(err)
              this.loadingfinal.dismiss()
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: 'Please try again!',
                buttons: [{text:'OK', handler: () => {
                  this.ngOnInit()
                }
                }]
              });
              await alert.present();
            },()=>{})
          }else{
              this.loadingfinal.dismiss()
              this.biddingIsDone()
            }
          },(err)=>{console.log(err)},()=>{})
      }else{
        this.checkduplicate=false
      }
    })
    await modal.present();
  }else{
    this.loadingfinal.dismiss()
    this.biddingIsDone()
  }
  },(err)=>{console.log(err)},()=>{})
}
managerFinal(){
  this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
    var temp
    temp=res

    this.allBidRoundData=[]
    var tempObj
    for(var i=0;i<temp.length;i++){
      if(temp[i].bidschidref===Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

        tempObj=temp[i]

      }
    }
    var today,date,invdate,diff
    date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
    var currentdate = today;
    var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'
//
  var bidstatus=''
  if(this.user_data.role!='emp'){
    bidstatus="Manager Completed"
  }else{
    bidstatus="Completed"
  }
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
        "shiftlinebidstatus": bidstatus,
        "vacationbidstatus":bidstatus,
        "empbid_end_time":tempObj.empbid_end_time ,
        "trans_seq_id":tempObj.trans_seq_id,
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
    }
    this.currentempData=tempNewObj
    this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
        var updatedRes
         updatedRes=res
          // this.sendNotifyAfterCompleteBidding()
         this.headerTitleService.checkBiddingTime('')
         this.loadingfinal.dismiss()
         this.navigate()

    },async (err)=>{console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{text:'OK', handler: () => {

          this.ngOnInit()
        }
        }]
      });
      await alert.present();

    },()=>{})
  },async (err)=>{console.log(err)
    this.loadingfinal.dismiss()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [{text:'OK', handler: () => {

        this.ngOnInit()
      }
      }]
    });
    await alert.present();
},()=>{})
}
final(){
  this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
    var temp
    temp=res

    this.allBidRoundData=[]
    var tempObj
    for(var i=0;i<temp.length;i++){
      if(temp[i].bidschidref===Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

        tempObj=temp[i]

      }
    }
    var today,date,invdate,diff
    date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
    var currentdate = today;
    var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'
//
    var bidstatus=''
    if(this.user_data.role!='emp'){
      bidstatus="Manager Completed"
    }else{
      bidstatus="Completed"
    }
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
        "shiftlinebidstatus": bidstatus,
        "vacationbidstatus":bidstatus,
        "empbid_end_time":updatedCurrentTime ,
        "trans_seq_id":tempObj.trans_seq_id,
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
    }
    this.currentempData=tempNewObj
    this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
        var updatedRes
         updatedRes=res
         this.sendNotifyAfterCompleteBiddingE()
                this.headerTitleService.checkBiddingTime('')
                this.loadingfinal.dismiss()
                this.navigate()

    },async (err)=>{console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{text:'OK', handler: () => {

          this.ngOnInit()
        }
        }]
      });
      await alert.present();

    },()=>{})
  },async (err)=>{console.log(err)
    this.loadingfinal.dismiss()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [{text:'OK', handler: () => {

        this.ngOnInit()
      }
      }]
    });
    await alert.present();
},()=>{})
}

updateNextEmpData(){

  this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
    var temp
    temp=res

    this.allBidRoundData=[]
    var tempObj
    for(var i=0;i<temp.length;i++){
      if(temp[i].bidschidref===Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

        tempObj=temp[i]

      }
    }
    var today,date,invdate,diff
    date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
    var currentdate = today;
    var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'
//
if(this.totalgetVacationHours>=this.totalEmpVacationHours){

}
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
        "shiftlinebidstatus": "Not Eligible",
        "vacationbidstatus":"Not Eligible",
        "empbid_end_time":updatedCurrentTime ,
        "trans_seq_id":tempObj.trans_seq_id,
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
    }
    this.currentempData=tempNewObj
    this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
        var updatedRes
         updatedRes=res
        //  this.sendNotifyAfterCompleteBidding()
        var vactionExhausted=0
        if(this.remainingVacationHours<8){
          vactionExhausted=1
        }else{
          vactionExhausted=0
        }
        this.emailNotify.WhenEmployeeFinishesBiddingForAnyRound(this.bid_schedule_id,this.empId,this.round_id+ + +1,vactionExhausted).subscribe((res)=>{},(err)=>{console.log(err)},()=>{})

        this.widnowTranSer.getBidWindowData(this.bid_schedule_id).subscribe((res)=>{
          var temp
          temp=res
               var tempn
        this.all_window_data=temp
        tempn =temp
        var start,end
        var updateNextEmpID
        updateNextEmpID=(updatedRes.trans_seq_id + + +1)
              for(var l=0;l<tempn.length;l++){



                if(tempn[l].trans_seq_id==updateNextEmpID){
                 if(tempn[l].vacationbidstatus=='Eligible'){
                  updateNextEmpID=updateNextEmpID
                 }else{
                  updateNextEmpID=updateNextEmpID + + +1
                 }
                }
                if(tempn[l].trans_seq_id==(updateNextEmpID) ){

                        tempObj=tempn[l]

                        var  tempNewObj
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
                          "shiftlinebidstatus": tempObj.shiftlinebidstatus,
                          "vacationbidstatus":tempObj.vacationbidstatus,
                          "empbid_end_time":tempObj.empbid_end_time.split('.')[0],
                          "empbid_start_time":updatedRes.empbid_end_time.split('.')[0],
                          "fname": tempObj.fname,
                          "trans_seq_id":tempObj.trans_seq_id,
                          "lname": tempObj.lname,
                          "empseq_id": tempObj.empseq_id

                    }
                  }
              }
              if(updatedRes.trans_seq_id< tempn.length){
                this.widnowTranSer.updateBidWindowData(tempNewObj.duid,tempNewObj).subscribe((res)=>{

                  this.emailNotify.whenBidWindowDurationHasIncreased(this.bid_schedule_id,this.empId,this.round_id+ + +1).subscribe((res)=>{},(err)=>{console.log(err)},()=>{})
                  // this.sendNotifytoNextEmp()
                  this.headerTitleService.checkBiddingTime('')
                  this.navigateForNotEligible()

                },async (err)=>{console.log(err)
                  this.loadingfinal.dismiss()
                  const alert = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: 'Error',
                    message: 'Please try again!',
                    buttons: [{text:'OK', handler: () => {

                      this.ngOnInit()
                    }
                    }]
                  });
                  await alert.present();
                  },()=>{})

              }else if(updatedRes.trans_seq_id==tempn.length){
                // this.sendNotifytoNextEmp()
                this.headerTitleService.checkBiddingTime('')
                this.navigateForNotEligible()

              }


      },async (err)=>{console.log(err)
        this.loadingfinal.dismiss()
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: 'Please try again!',
          buttons: [{text:'OK', handler: () => {

            this.ngOnInit()
          }
          }]
        });
        await alert.present();
},()=>{})
    },async (err)=>{console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{text:'OK', handler: () => {

          this.ngOnInit()
        }
        }]
      });
      await alert.present();
},()=>{})
  },async (err)=>{console.log(err)
    this.loadingfinal.dismiss()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [{text:'OK', handler: () => {

        this.ngOnInit()
      }
      }]
    });
    await alert.present();
},()=>{})
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


async navigateForNotEligible(){
  this.spinner=false
  if(this.checkVacationHrs==false && this.remainingVacationHours<=0){

        if(this.user_data.role!='emp'){

          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'No vacation left for '+ this.currentempData.fname +' '+this.currentempData.lname+' ('+this.currentempData.initials+').',
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
            message: 'No vacation left for you.',
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

  }else{
    if(this.user_data.role!='emp'){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: "Don't have enough vacation balance for "+ this.currentempData.fname +' '+this.currentempData.lname+' ('+this.currentempData.initials+').',
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
        message: "You don't have enough vacation balance. ",
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
}
  async navigate(){
  if(this.user_data.role!='emp'){
    if(this.round_id==0){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Done',
      message: 'Shiftline and Vacation Leave Selection completed for <b>'+ this.currentempData.fname +' '+this.currentempData.lname+' ('+this.currentempData.initials+')</b>.',
      buttons: [{text:'OK', handler: () => {
        var vactionExhausted=0
        if(this.remainingVacationHours<8){
          vactionExhausted=1
        }else{
          vactionExhausted=0
        }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            round:this.round_id,
            vactionExhausted:vactionExhausted
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
      header: 'Done',
      message: 'Vacation Leave Selection completed for <b>'+ this.currentempData.fname +' '+this.currentempData.lname+' ('+this.currentempData.initials+')</b>.',
      buttons: [{text:'OK', handler: () => {
        var vactionExhausted=0
        if(this.remainingVacationHours<8){
          vactionExhausted=1
        }else{
          vactionExhausted=0
        }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            round:this.round_id,
            vactionExhausted:vactionExhausted
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
    }

  }else{
    if(this.round_id==0){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Done',
        message: 'You completed the Shiftline and Vacation Leave Selection.',
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

    }else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Done',
        message: 'You completed the Vacation Leave Selection.',
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
}
sendNotifyAfterCompleteBiddingE(){
  var vactionExhausted=0
  if(this.remainingVacationHours<8){
    vactionExhausted=1
  }else{
    vactionExhausted=0
  }
  this.emailNotify.whenEmployeeFinishesBiddingForAnyRound(this.bid_schedule_id,this.empId,this.round_id+ + +1,vactionExhausted).subscribe((res)=>{},(err)=>{console.log(err)},()=>{})
}
sendNotifyAfterCompleteBidding(){
  var vactionExhausted=0
  if(this.remainingVacationHours<8){
    vactionExhausted=1
  }else{
    vactionExhausted=0
  }
  this.emailNotify.WhenEmployeeFinishesBiddingForAnyRound(this.bid_schedule_id,this.empId,this.round_id+ + +1,vactionExhausted).subscribe((res)=>{},(err)=>{console.log(err)},()=>{})
}
sendNotifytoNextEmp(empid,roundid){
  this.emailNotify.whenBidWindowDurationHasIncreased(this.bid_schedule_id,empid,roundid).subscribe((res)=>{},(err)=>{console.log(err)},()=>{})
}

currentSource=[]
async listToMatrix(list) {
        var matrix = [], i, k,sun=[],mon=[],tue=[],wed=[],thu=[],fri=[],sat=[],matrixOne = [], j, l,h
      var tempNum=0,tempArr=[],tempArr2=[]
      for (j = 0;j < list.length; j++) {
        if(list[j-1]!=undefined){

          if(list[j].startTime.getMonth()==list[j-1].startTime.getMonth() ){
            tempArr.push(list[j])
            if((Number(list.length)+ - +1)===j){
              matrixOne.push(tempArr)
              tempArr=[]
            }
          }else{

            matrixOne.push(tempArr)
            tempArr=[]
            tempArr.push(list[j])
          }
      }else{
        if(list[j+1]==undefined ){
          matrixOne.push(tempArr)
          tempArr=[]
        }else{
          tempArr.push(list[j])
        }

      }



      }
      var newArr=[]
      for(var a=0;a<matrixOne.length;a++){
        newArr=new Array()
        if(matrixOne[a][0].startTime.getDay()==0){
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==1){
          for(var p=0;p<1;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==2){
          for(var p=0;p<2;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==3){
          for(var p=0;p<3;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==4){
          for(var p=0;p<4;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==5){
          for(var p=0;p<5;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        if(matrixOne[a][0].startTime.getDay()==6){
          for(var p=0;p<6;p++){
            newArr.push(undefined);
          }
          for(var b=0;b<matrixOne[a].length;b++){
            newArr.push(matrixOne[a][b])
          }
        }
        matrix.push(newArr)
      }

  this.currentSource = matrix
  console.log('this.currentSource===', this.currentSource,this.currentEmpData.initials);
  let checker = false;
  for (let i = 0; i < this.currentSource.length; i++) {
    const element = this.currentSource[i];
    for (let j = 0; j < element.length; j++) {
      const el = element[j];
      if (el) {
        if (el.slot > 0) {
          if (el.title !== 'rdo') {
            if (el.emp.includes(this.currentEmpData.initials)) {
              
            } else {
              checker = true;
            }
          }
        }
        
      }
    }
    
  }
  if (!checker) {
    // this.alertPresented = true
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: "You don't have selectable date ",
      buttons: [{
        text: 'OK', handler: async() => {
          this.notEligableMade()
          // this.alertPresented = false;
          // await alert.onDidDismiss()
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
        this.notEligableMade()
        let navigationExtras: NavigationExtras = {
          queryParams: {
            round:this.round_id,
          }
        };
        this.navCtrl.navigateBack(straightlines_io_apis.apis.my_bidding,navigationExtras)
      }
  } else {
    
    this.cdref.detectChanges()
    this.cdref.detectChanges()
  }
}
updateNextEmpDataBidManager(){
  this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
    var temp
    temp=res

    this.allBidRoundData=[]
    var tempObj
    for(var i=0;i<temp.length;i++){
      if(temp[i].bidschidref===Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

        tempObj=temp[i]

      }
    }
    var today,date,invdate,diff
    date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
    var currentdate = today;
    var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'
//
if(this.totalgetVacationHours>=this.totalEmpVacationHours){

}
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
        "shiftlinebidstatus": "Not Eligible",
        "vacationbidstatus":"Not Eligible",
        "empbid_end_time":tempObj.empbid_end_time.split('.')[0] ,
        "trans_seq_id":tempObj.trans_seq_id,
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
    }
    this.currentempData=tempNewObj
    this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
        var updatedRes
         updatedRes=res
         this.headerTitleService.checkBiddingTime('')
         this.navigateForNotEligible()
    },async (err)=>{console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{text:'OK', handler: () => {

          this.ngOnInit()
        }
        }]
      });
      await alert.present();
    },()=>{})
  },async (err)=>{console.log(err)
    this.loadingfinal.dismiss()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [{text:'OK', handler: () => {

        this.ngOnInit()
      }
      }]
    });
    await alert.present();
},()=>{})
}
@ViewChild(IonContent, { static: true }) content: IonContent;




checkSameDate(date1,date2){
  date1=new Date(date1)
  date2=new Date(date2)
  if(date1.getFullYear()==date2.getFullYear() && date1.getMonth()==date2.getMonth() && date1.getDate()==date2.getDate()){
    return true
  }else{
    return false
  }
  }

viewBidWindow(){
  return 'test'
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
  
  notEligableMade() {
    this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
      var temp
      temp=res
  
      this.allBidRoundData=[]
      var tempObj
      for(var i=0;i<temp.length;i++){
        if(temp[i].bidschidref===Number(this.bid_schedule_id) && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){
  
          tempObj=temp[i]
  
        }
      }
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
        "shiftlinebidstatus": "Not Eligible",
        "vacationbidstatus":"Not Eligible",
        "empbid_end_time":tempObj.empbid_end_time.split('.')[0] ,
        "trans_seq_id":tempObj.trans_seq_id,
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "empseq_id": tempObj.empseq_id
    }
    this.currentempData=tempNewObj
    this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
        var updatedRes
         updatedRes=res
         this.headerTitleService.checkBiddingTime('')
        //  this.navigateForNotEligible()
    },async (err)=>{console.log(err)
      this.loadingfinal.dismiss()
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please try again!',
        buttons: [{text:'OK', handler: () => {

          this.ngOnInit()
        }
        }]
      });
      await alert.present();
    },()=>{})
  },async (err)=>{console.log(err)
    this.loadingfinal.dismiss()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [{text:'OK', handler: () => {

        this.ngOnInit()
      }
      }]
    });
    await alert.present();
},()=>{})
  }
}




