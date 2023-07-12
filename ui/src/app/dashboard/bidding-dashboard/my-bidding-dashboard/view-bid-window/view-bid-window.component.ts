import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidRoundsService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-rounds/bid-rounds.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MyBiddingService } from '../my-bidding.service';
import { Buffer } from 'buffer';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import moment from 'moment';

@Component({
  selector: 'app-view-bid-window',
  templateUrl: './view-bid-window.component.html',
  styleUrls: ['./view-bid-window.component.scss'],
})
export class ViewBidWindowComponent implements OnInit {
  @Input() rid;
  @Input() windowsData;
  @Input() isModal;
  @Input() bid_schedule_name;
  @Input() isEditBidSchedule: boolean = false;
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  rowCount=0
  _nextId
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  _chars
  spinner=false
  popUpEmpId
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
   days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  all_SBP_rounds=[]
  bidShculeTimeZone='US/Eastern'
  currentSelectedRound
  roundDuration
checkData=true
  currentactiveRoundNumber=0
  roundStartTime: any;
  roundStartDate: Date;
  currentBidRoundData: any[];
  allScheduleData: any[];
  allEmpForBidding: any[];
  roundEndTime: any;
  finalViewBidWindowData: any[];
  interval: any;
  distance: any;
  seconds: any;
  minutes: any;
  oldPopUpId: any;
  timePopUpId: any;
  oldTimePopUpId: any;
  currentPopupId: any;
  all_Bid_schedule_list=[]
  checkClickForPopup=false;
  user_data
  currentBidScheduleData
  defaultMAxLeave: number;
  maxLeave: number;
  totalBidRounds: number;
  allRoundInfo: any[];
  totalEmp=0;
  totalDefaultEmp: any;
  all_bid_round_data: any[];
  all_window_data=[]
  allEmployee=[]
  shiftLinesSchedule: any[];
  all_final_data_for_total_emp: any[];
  bidSchedule: any;
  round_id;
  intervalDuration: string = '';
  intervalStartTime: string = '';
  managerIds=[]
  shiftlineScheduleData: any;
  tempObj;
  constructor(private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private newBidScheduleSer:CreateNewBidScheduleService,
    private scheduleService:GeneratedScheduleService,
    private getAllEmp:AddNewEmployeeService,
    private bidWindowSer:BidWindowService,
    private headerTitleService: HeaderTitleService,
    private bidRoundsSer: BidRoundsService,
    private timezoneSer: TimezoneService,
    private http: HttpClient,
    private localData: LocalDataService,
    private myBiddingSer:MyBiddingService,) {
    this.route.params.subscribe(params => {
      this.bid_schedule_name = params['_bidScheduleName'];
      this.round_id = params['_rid'] || this.rid;
      this.passBidScheduleName.emit(this.bid_schedule_name)
      this.passroundId.emit(this.round_id)
  });
   }

  ngOnInit() {
    this.spinner=true
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.managerIds.push(this.user_data.id)
    if(this.user_data.managerId!=null && this.user_data.managerId!=undefined){
      this.managerIds.push(this.user_data.managerId)
    }
    this.tempObj = JSON.parse(this.localData.getItem(this.isEditBidSchedule ? 'editBidSchedule' : 'newBidSchedule'));
    if (!this.isModal) {
      this.headerTitleService.setDefaultHeader(true)
      this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? straightlines_io_apis.apis.my_bidding : straightlines_io_apis.apis.my_bidding);
      this.headerTitleService.setForwardUrl(null);this.headerTitleService.checkBiddingTime('biddingheader')
      this.myBiddingSer.setTitle('viewBidWindow')
      

      this.passBidScheduleName.emit(this.bid_schedule_name)
      this.passroundId.emit(this.round_id)
    }
    if(this.bid_schedule_name!=='select bid schedule name' || (this.isModal && !this.windowsData.length)){
      this.checkData=true
      this.allBidScheduleList()

    }else{
      this.spinner=false
      this.checkData=false
    }

  }
  allBidScheduleList(){
    this.all_Bid_schedule_list=[]
    var count=0
    if (this.isModal && this.windowsData.length) {
      var temp
      temp=this.tempObj;
      this.all_Bid_schedule_list.push(temp)
      count = this.tempObj.length;
      this.getAllNewBidSchedule();
    }
    else {
      if (this.user_data.role == "emp") {
        this.bidWindowSer.getBidscheduleDetailsBasedonEmpid(this.user_data.empid).subscribe((res) => {
          this.all_Bid_schedule_list = res;
          this.getAllNewBidSchedule()
        })
      } else {
        
        for(var i=0;i<this.managerIds.length;i++){
          this.newBidScheduleSer.getAllBidScheduleData(this.managerIds[i]).subscribe((res)=>{
            var temp
            temp=res
            for(var j=0;j<temp.length;j++){
              this.all_Bid_schedule_list.push(temp[j])
            }
            count++
            if(count==this.managerIds.length){
              this.getAllNewBidSchedule()
            }
          },(err)=>{console.log(err)
  
            },()=>{})
        }
      }
    }
  }
  convertToMinutes(timeString) {
    var time = moment.duration(timeString);
    var totalMinutes = time.asMinutes();
    return String(totalMinutes);
  }
  getAllNewBidSchedule(){
    if (this.isModal && this.windowsData.length) {
      this.currentBidScheduleData=this.all_Bid_schedule_list[0];
      this.bidSchedule=this.all_Bid_schedule_list[0];
      this.bidShculeTimeZone=this.bidSchedule.timezone;
    }
    else {
      for(var i=0;i<this.all_Bid_schedule_list.length;i++){
        if(this.all_Bid_schedule_list[i].bidschename===this.bid_schedule_name){
          this.currentBidScheduleData=this.all_Bid_schedule_list[i];
          this.bidSchedule=this.all_Bid_schedule_list[i];
          this.bidShculeTimeZone=this.bidSchedule.timezone;
        }
      }
    }
    this.intervalStartTime=this.bidSchedule?.intervalstarttime;
    let intervaltime = this.bidSchedule?.intervalduration;
    this.intervalDuration = this.convertToMinutes(intervaltime);
      this.getTimeZone()
      this.viewBidWindowData()
  }
  bidShculeTimeZoneacronym='(GMT-05:00) Eastern Time (US & Canada) (EST)'
  allTimeZone=[]
  bidshculeTimeZoneacronym='EST'
  getTimeZone(){
    this.timezoneSer.getAllTimeZone().subscribe((res)=>{

      this.allTimeZone=res
      for(var i=0;i<this.allTimeZone.length;i++){
      if(this.bidShculeTimeZone==this.allTimeZone[i].location){
        this.bidShculeTimeZoneacronym= this.allTimeZone[i].timezone+' ('+this.allTimeZone[i].acronym+')'
        this.bidshculeTimeZoneacronym=this.allTimeZone[i].acronym
      }
      }
    },(err)=>{
      console.log(err)
      this.bidshculeTimeZoneacronym='EST'
    this.bidShculeTimeZoneacronym='(GMT-05:00) Eastern Time (US & Canada) (EST)'},()=>{})
  }

viewBidWindowData(){
  if (this.isModal && this.windowsData.length) {
    this.all_window_data = this.windowsData;
    this.getBidRounds()
  }
  else {
    this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.bid_schedule_name).subscribe((res)=>{
      var temp
      temp=res
      this.all_window_data = []
      for (var i = 0; i < temp.length; i++){
        if (this.user_data.role == "emp") {
          if (this.bidSchedule.bidschid === temp[i].bidschidref && temp[i].empidref == this.user_data.empid) {
            this.all_window_data.push(temp[i])
          }
        } else {
          if(this.bidSchedule.bidschid===temp[i].bidschidref){
            this.all_window_data.push(temp[i])
          }
        }
      }

    this.getBidRounds()

    },(err)=>{console.log(err)},()=>{})
  }


}
intervalForUpdateStatus
intervalForIncompleteStatus
ngOnDestroy() {

  if(this.intervalForUpdateStatus != null){
    clearInterval(this.intervalForUpdateStatus)// Clear interval on page unmount
}
if(this.intervalForIncompleteStatus != null){
clearInterval(this.intervalForIncompleteStatus)// Clear interval on page unmount
}
}
getBidRounds(){
  if (this.isModal && this.windowsData.length) {
    this.all_SBP_rounds=this.bidSchedule.roundmap;
    this.displayRoundData(Number(this.round_id),this.all_SBP_rounds[Number(this.round_id)])
  }
  else {
    this.bidRoundsSer.getBidRounds(this.bidSchedule.bidschid).subscribe((res)=>{
      this.all_SBP_rounds=res
      this.displayRoundData(Number(this.round_id),this.all_SBP_rounds[Number(this.round_id)])
    },(err)=>{console.log(err)},()=>{})
  }
}





  displayRoundData(i,data){
    this.currentactiveRoundNumber=i
    this.roundDuration=Number(data.roundduration.split(":")[1])+ + +Number(data.roundduration.split(":")[0])*60
    var temp =this.all_window_data
    var today,date,invdate,diff

    var start,end,actualStart,actualEnd
    if(this.currentactiveRoundNumber==i){
      this.finalViewBidWindowData=[]
          for(var l=0;l<temp.length;l++){
            var defStartDate=temp[l].empbid_start_time.split(" ")
            var defendDate=temp[l].empbid_end_time.split(" ")
            actualStart=new Date(Number(defStartDate[0].split("-")[0]),Number(defStartDate[0].split("-")[1])+ - +1,Number(defStartDate[0].split("-")[2]),Number(defStartDate[1].split(':')[0]),Number(defStartDate[1].split(':')[1]),0)
            actualEnd=new Date(Number(defendDate[0].split("-")[0]),Number(defendDate[0].split("-")[1])+ - +1,Number(defendDate[0].split("-")[2]),Number(defendDate[1].split(':')[0]),Number(defendDate[1].split(':')[1]),0)
            start=new Date(Number(temp[l].bidstartdate.split("-")[0]),Number(temp[l].bidstartdate.split("-")[1])+ - +1,Number(temp[l].bidstartdate.split("-")[2]),Number(temp[l].bidstarttime.split(':')[0]),Number(temp[l].bidstarttime.split(':')[1]),Number(temp[l].bidstarttime.split(':')[2]))
            end=new Date(Number(temp[l].bidenddate.split("-")[0]),Number(temp[l].bidenddate.split("-")[1])+ - +1,Number(temp[l].bidenddate.split("-")[2]),Number(temp[l].bidendtime.split(':')[0]),Number(temp[l].bidendtime.split(':')[1]),Number(temp[l].bidendtime.split(':')[2]))
            date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
            if(today>=actualStart){
              if(today>actualEnd){
                if((i+ + +1)==temp[l].roundseq_id){
                  if(temp[l].vacationbidstatus=="Incomplete")
                  {
                    this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":3,"actualEnd":actualEnd,"actualStart":actualStart,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                  }else{
                    this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"actualEnd":actualEnd,"actualStart":actualStart,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                  }
                }
              }else{
                if((i+ + +1)==temp[l].roundseq_id){
                  this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":1,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                }
              }
            }else if(today<actualStart){
                if((i+ + +1)==temp[l].roundseq_id){
                  if(temp[l].vacationbidstatus=='Skipped' || temp[l].vacationbidstatus=='Manager Skipped'){
                    this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                  }else{
                    if(temp[l].shiftlinebidstatus=='Not Eligible'){
                      this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                    }else{
                      this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":0,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
                    }

                }
              }

            }
          }
        }
        this.spinner=false
    this.interval=setInterval( ()=> {
     if(this.currentactiveRoundNumber==i){
      this.finalViewBidWindowData=[]

      for(var l=0;l<temp.length;l++){

        var defStartDate=temp[l].empbid_start_time.split(" ")
        var defendDate=temp[l].empbid_end_time.split(" ")
        actualStart=new Date(Number(defStartDate[0].split("-")[0]),Number(defStartDate[0].split("-")[1])+ - +1,Number(defStartDate[0].split("-")[2]),Number(defStartDate[1].split(':')[0]),Number(defStartDate[1].split(':')[1]),0)
        actualEnd=new Date(Number(defendDate[0].split("-")[0]),Number(defendDate[0].split("-")[1])+ - +1,Number(defendDate[0].split("-")[2]),Number(defendDate[1].split(':')[0]),Number(defendDate[1].split(':')[1]),0)
        start=new Date(Number(temp[l].bidstartdate.split("-")[0]),Number(temp[l].bidstartdate.split("-")[1])+ - +1,Number(temp[l].bidstartdate.split("-")[2]),Number(temp[l].bidstarttime.split(':')[0]),Number(temp[l].bidstarttime.split(':')[1]),Number(temp[l].bidstarttime.split(':')[2]))
        end=new Date(Number(temp[l].bidenddate.split("-")[0]),Number(temp[l].bidenddate.split("-")[1])+ - +1,Number(temp[l].bidenddate.split("-")[2]),Number(temp[l].bidendtime.split(':')[0]),Number(temp[l].bidendtime.split(':')[1]),Number(temp[l].bidendtime.split(':')[2]))
        date = new Date();
        invdate = new Date(date.toLocaleString('en-US', {
          timeZone: this.bidShculeTimeZone
        }));
         diff = date.getTime() - invdate.getTime();
         today=new Date(date.getTime() - diff)
        if(today>=actualStart){
          if(today>actualEnd){
            if((i+ + +1)==temp[l].roundseq_id){
              if(temp[l].vacationbidstatus=="Incomplete")
              {
                this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":3,"actualEnd":actualEnd,"actualStart":actualStart,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
              }else{
                this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"actualEnd":actualEnd,"actualStart":actualStart,"endTime":end,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
              }
            }
          }else{
            if((i+ + +1)==temp[l].roundseq_id){
              this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":1,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
            }
          }
        }else if(today<actualStart){
          if((i+ + +1)==temp[l].roundseq_id){
            if(temp[l].vacationbidstatus=='Skipped' || temp[l].vacationbidstatus=='Manager Skipped'){
              this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
            }else{
              if(temp[l].shiftlinebidstatus=='Not Eligible'){
                this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":2,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
              }else{
                this.finalViewBidWindowData.push({"id":l+1,"startTime":start,"status":0,"endTime":end,"actualEnd":actualEnd,"actualStart":actualStart,"empName":temp[l].fname+' ' +temp[l].lname ,"empInitial":temp[l].initials,"round":temp[l].roundseq_id,"rank":temp[l].rank,"vacationbidstatus":temp[l].vacationbidstatus,"shiftlinebidstatus":temp[l].shiftlinebidstatus})
              }
            }
          }
        }
      }
    }
        }, 5000);
// console.log(this.finalViewBidWindowData)
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
displayRoundDataOne(all_SBP_rounds,i){

}

  identify(index, item){
    return item.status;
 }




  getIndicatorClass(index){
    if(this.currentactiveRoundNumber===index){
      return ' app-background-mercurius-secondary-color'
    }else{
      return 'app-font-mercurius-secondary-color'
    }

  }
  convertNumber(num){
    return Number(num)
  }
   tConvert (time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
  timePopUp(i) {
    this.timePopUpId=i
    this.currentPopupId=i
    this.checkClickForPopup=true
    var popupTime = document.getElementById("myPopup"+this.timePopUpId);
    popupTime.style.visibility='visible'
    if(this.oldTimePopUpId==this.timePopUpId){
        if(this.oldTimePopUpId!=undefined ){
          var oldTimePopup = document.getElementById("myPopup"+this.oldTimePopUpId);
          if(oldTimePopup!=null){
            oldTimePopup.style.visibility='hidden'
          }
        }
        if(this.oldPopUpId!=undefined ){
          var popupTwo = document.getElementById("myPopupEmp"+this.oldPopUpId);
          if(popupTwo!=null){
            popupTwo.style.visibility='hidden'
          }
        }
        this.oldPopUpId=undefined
        this.oldTimePopUpId=undefined
    }else{
      if(this.oldTimePopUpId!=undefined  && this.timePopUpId!=this.oldTimePopUpId){
        var oldTimePopup = document.getElementById("myPopup"+this.oldTimePopUpId);
        if(oldTimePopup!=null){
          oldTimePopup.style.visibility='hidden'
        }
      }
      if(this.oldPopUpId!=undefined ){
        var popupTwo = document.getElementById("myPopupEmp"+this.oldPopUpId);
        if(popupTwo!=null){
          popupTwo.style.visibility='hidden'
        }

      }
      this.oldTimePopUpId=this.timePopUpId
    }
    this.oldPopUpId=undefined
  }
  disablePopup(){

    if(this.checkClickForPopup==false){
      if(this.oldTimePopUpId!=undefined && this.oldTimePopUpId!=null){
        var oldTimePopup = document.getElementById("myPopup"+this.oldTimePopUpId);
        if(oldTimePopup!=null){
          oldTimePopup.style.visibility='hidden'
        }
      }
      if(this.oldPopUpId!=undefined){
        var popupTwo = document.getElementById("myPopupEmp"+this.oldPopUpId);
        popupTwo.style.visibility='hidden'
        if(popupTwo!=null){
          popupTwo.style.visibility='hidden'
        }
      }
    }
     this.checkClickForPopup=false
  }
  popUpEmp(i){
    this.popUpEmpId=i

    this.checkClickForPopup=true
    var popup = document.getElementById("myPopupEmp"+this.popUpEmpId);
    popup.style.visibility='visible'
    if(this.oldPopUpId==this.popUpEmpId){
        if(this.oldPopUpId!=undefined){
          var popupEmpTwo = document.getElementById("myPopupEmp"+this.oldPopUpId);
          if(popupEmpTwo!=null){
            popupEmpTwo.style.visibility='hidden'
          }
        }
        if(this.oldTimePopUpId!=undefined ){
          var oldPopup = document.getElementById("myPopup"+this.oldTimePopUpId);
          if(oldPopup!=null){
            oldPopup.style.visibility='hidden'
          }

        }
        this.oldPopUpId=undefined
        this.oldTimePopUpId=undefined
    }
    else{
      if(this.oldPopUpId!=undefined&& this.popUpEmpId!==this.oldPopUpId){
        var popupEmpTwo = document.getElementById("myPopupEmp"+this.oldPopUpId);
        if(popupEmpTwo!=null){
          popupEmpTwo.style.visibility='hidden'
        }

      }
      if(this.oldTimePopUpId!=undefined ){
        var oldPopup = document.getElementById("myPopup"+this.oldTimePopUpId);
        if(oldPopup!=null){
          oldPopup.style.visibility='hidden'
        }
      }
      this.oldPopUpId=this.popUpEmpId
    }
    this.oldTimePopUpId=undefined
  }

  checkStatus(start,end){

    var today,date,invdate,diff
    date = new Date();
            invdate = new Date(date.toLocaleString('en-US', {
              timeZone: this.bidShculeTimeZone
            }));
             diff = date.getTime() - invdate.getTime();
             today=new Date(date.getTime() - diff)
    if(today>=start){
      if(today>end){
        //2
        return 2
      }else{
        return 1
      }

    }else if(today<start){
     return 0
    }

  }
  export(){

    var tempArr=[],arr=[]
    for(var i=0;i<this.all_SBP_rounds.length;i++){
      tempArr=[]
      for(var j=0;j<this.all_window_data.length;j++){
        if(this.all_SBP_rounds[i].roundseq_id==this.all_window_data[j].roundseq_id){
            tempArr.push(this.all_window_data[j])
        }
      }
      arr.push(tempArr)
    }

    this.download(arr)
  }
  nextCol() {
    const r = [];
    for (const char of this._nextId) {
      r.unshift(this._chars[char]);
    }
    this._increment();
    return r.join('');
  }

  _increment() {
    for (let i = 0; i < this._nextId.length; i++) {
      const val = ++this._nextId[i];
      if (val >= this._chars.length) {
        this._nextId[i] = 0;
      } else {
        return;
      }
    }
    this._nextId.push(0);
  }

  *[Symbol.iterator]() {
    while (true) {
      yield this.nextCol();
    }
  }
  convertDate(date){
    return new Date(Number(date.split('-')[0]),Number(date.split('-')[1])+ - +1,Number(date.split('-')[2]),0,0,0)
  }

  formatAMPM(time) {
    var hours = time.split(':')[0];
    var minutes = time.split(':')[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = Number(hours) % 12;
    hours = Number(hours) ? Number(hours) : 12; // the hour '0' should be '12'
    hours = Number(hours) < 10 ? '0'+Number(hours) : Number(hours);
    minutes = Number(minutes) < 10 ? '0'+Number(minutes) : Number(minutes);
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  async download(arr){
    var tempArr2=[]
    var tempArrDates=[],mergeCellsArr=[]
    tempArr2=arr
    const workbook = new Workbook();

    var temp

    var tempMonth
    var allData=[]
    this._chars = this.chars;
      this._nextId = [0];

    var uniqueArray

    const customized_worksheet = workbook.addWorksheet("Schedule and Leave Bid Times");
    const customizedimageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
    const customizedbase64Image = Buffer.from(customizedimageData).toString('base64');
    const logoCustomizedSchedule = workbook.addImage({
      base64: customizedbase64Image,
      extension: 'png',
    });
    customized_worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.1, row: 0.2 },ext: { width: 50, height: 50 } });


    for(var k=0;k<tempArr2.length;k++){
      temp=this.nextCol()
      this.rowCount=1

      tempArrDates=[]
      for(var j=0;j<tempArr2[k].length;j++){
        tempArrDates.push(tempArr2[k][j].bidstartdate)

      }
      uniqueArray = tempArrDates.filter(function(item, pos) {
        return tempArrDates.indexOf(item) == pos;
    })
      const header=customized_worksheet.getRow(1);
      header.height = 40;
      const header_value = customized_worksheet.getCell('A1')
      header_value.value='Schedule and Leave Bid Times'
      header_value.alignment={ vertical: 'middle',horizontal: 'center' ,wrapText:true  }
      header_value.font = {bold: true,  size: 22};


      this.rowCount++
      this.rowCount=this.rowCount+++1
      var defrowCount=this.rowCount+ + +1
      for(var j=0;j<tempArr2[k].length;j++){
        if( k==0){
          defrowCount++
          const defCompData=customized_worksheet.getCell(temp+defrowCount);
            defCompData.value=j+ + +1
            defCompData.border = {
              // bottom: {style:'thin'},
              //   left: {style:'thin'},
              //   right: {style:'thin'},
              //   top: {style:'thin'},
              };
              defCompData.alignment={ vertical: 'middle', horizontal: 'center' };
              if(j%2==0){
                defCompData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d8d8d8'}};
              }
            }
        }
        if(k==0){
          temp=this.nextCol()
          }
         defrowCount=this.rowCount+ + +1
      for(var j=0;j<tempArr2[k].length;j++){
        if( k==0){
          defrowCount++
          const defCompData=customized_worksheet.getCell(temp+defrowCount);
            defCompData.value=tempArr2[k][j].initials
            defCompData.border = {
              bottom: {style:'thin'},
                left: {style:'thin'},
                right: {style:'thin'},
                top: {style:'thin'},
              };
              defCompData.alignment={ vertical: 'middle', horizontal: 'center' };
              if(j%2==0){
                defCompData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d8d8d8'}};
              }

        }
      }
      if(k==0){
      temp=this.nextCol()
      }
      var defRowCount=this.rowCount
      var defColName=temp
      for(var t=0;t<uniqueArray.length;t++){
        const defheader=customized_worksheet.getCell(temp+2);
      defheader.value='Round '+ (k+ + +1)
      defheader.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };
      defheader.alignment={ vertical: 'middle',horizontal: 'center' ,wrapText:true  }
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.rowCount=defRowCount+ + +1
      const defCompDay=customized_worksheet.getCell(temp+3);
      defCompDay.value=this.days[this.convertDate(uniqueArray[t]).getDay()]
      defCompDay.font = {bold: true};
      defCompDay.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompDay.border = {
            // bottom: {style:'thin'},
              left: {style:'thin'},
              right: {style:'thin'},
              top: {style:'thin'},
            };
        this.rowCount=defRowCount+ + +2
      const defCompDate=customized_worksheet.getCell(temp+4);
        defCompDate.value=this.convertDate(uniqueArray[t]).getDate()+'-'+this.monthNames[this.convertDate(uniqueArray[t]).getMonth()]
        defCompDate.font = {bold: true};
        defCompDate.alignment={ vertical: 'middle', horizontal: 'center' };
        defCompDate.border = {
            bottom: {style:'thin'},
              left: {style:'thin'},
              right: {style:'thin'},
              // top: {style:'thin'},
            };
            this.rowCount=defRowCount+ + +2
        for(var j=0;j<tempArr2[k].length;j++){
          const defCompData=customized_worksheet.getCell(temp+this.rowCount);
          customized_worksheet.getColumn(temp).width=15
          this.rowCount++
          if(uniqueArray[t]==tempArr2[k][j].bidstartdate){
              defCompData.value=this.formatAMPM(tempArr2[k][j].bidstarttime) +' '+ this.bidshculeTimeZoneacronym
          }else{
            defCompData.value=''
          }
          defCompData.alignment={ vertical: 'middle', horizontal: 'center' };
          defCompData.border = {
            bottom: {style:'thin'},
              left: {style:'thin'},
              right: {style:'thin'},
              top: {style:'thin'},
            };
            if(j%2==0){
              defCompData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d8d8d8'}};
            }
            if(uniqueArray.length==(t+ + +1)){
              if(tempArr2[k].length===(j+ + +1)){
                mergeCellsArr.push(defColName+2+':'+temp+2)
              }
            }
        }

        if(uniqueArray.length!==(t+ + + 1)){
          temp=this.nextCol()

        }else{
          defColName=temp
        }

    }
  }
  customized_worksheet.mergeCells('A1:'+temp+'1');
  for(var i=0;i<mergeCellsArr.length;i++){
    customized_worksheet.mergeCells(mergeCellsArr[i]);
  }


  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Schedule and Leave Bid Times');
  })

  }
  close() {
    this.modalCtrl.dismiss();
  }
  next() {
    const r = [];
    for (const char of this._nextId) {
      r.unshift(this._chars[char]);
    }
    this._increment();
    return r.join('');
  }
}
