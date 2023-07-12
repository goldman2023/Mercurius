import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { Console } from 'console';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MyBiddingService } from '../../my-bidding.service';

@Component({
  selector: 'app-skip-bid-leave',
  templateUrl: './skip-bid-leave.component.html',
  styleUrls: ['./skip-bid-leave.component.scss'],
})
export class SkipBidLeaveComponent implements OnInit {
  skipBidLeaveForm
  checkShiftLineScheduleId
  user_data
  all_window_data=[]
  allBidRoundData=[]
  selected_schedule_for_bidding
  bid_schedule_id
  round_id
  finalArr=[]
  buttonDisable=true
  empId
  bidShculeTimeZone='US/Eastern'
  empName
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    public modalCtrl: ModalController,
    private bidService:BidScheduleService,
    private headerTitleService: HeaderTitleService,
    private setUPbidRoundSer:SetupBidRoundService,
    private myBiddingSer:MyBiddingService,
    private emailNotificationsSer:EmailNotificationsService,
    private fb:FormBuilder,    private timezoneSer: TimezoneService, private newBidScheduleSer:CreateNewBidScheduleService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private widnowTranSer:BidWindowService,
    private scheduleService:GeneratedScheduleService,
    private localData: LocalDataService
  ) {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.route.queryParams.subscribe(params=>{
      if(this.user_data.empid==undefined){
        this.bid_schedule_id=params.bidId
        this.round_id=params.round,
        this.empName=params.i,
        this.empId=Number(params.eid)
      }else{
        this.bid_schedule_id=Number(params.bidId)
        this.round_id=Number(params.round)
        this.empId=this.user_data.empid
        this.empName=this.user_data.initials
      }

    })
   }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.selected_schedule_for_bidding=JSON.parse(this.localData.getItem('myBiddingData'))
    this.skipBidLeaveForm = this.formBuilder.group({
      skipRoundType:new FormControl(""),
    })
    this.getAllDataBasedOnScheduleName()
  }
  get skipRoundType(){
    return  this.skipBidLeaveForm.get("skipRoundType")
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
    bidSchedule
    getAllDataBasedOnScheduleName(){
      this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.bid_schedule_id).subscribe((res)=>{
        this.bidSchedule=res
        this.bidShculeTimeZone=this.bidSchedule.timezone
        this.getTimeZone()

      },(err)=>{console.log(err)},()=>{})
    }
    checkSkipRoundType(){
      this.buttonDisable=false
      if(this.skipBidLeaveForm.value.skipRoundType==='skipCurrentRound'){
        this.skipCurrentRound()
      }else{
        this.skipAllRound()
      }
    }
  close(){
    this.modalCtrl.dismiss({"check":false})
  }
  accept(){
    // console.log(this.finalArr)
      for(var i=0;i<this.finalArr.length;i++){
        var currentdate
        var tempObj=this.finalArr[i]
            var today,date,invdate,diff
            date = new Date();
              invdate = new Date(date.toLocaleString('en-US', {
                timeZone: this.bidShculeTimeZone
              }));
               diff = date.getTime() - invdate.getTime();
               currentdate=new Date(date.getTime() - diff)

            var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'
            var  tempNewObj

              if(this.user_data.empid==undefined){
                updatedCurrentTime=tempObj.empbid_end_time
              }else{
                if((Number(this.round_id)+ + +1)!=tempObj.roundseq_id){
                  updatedCurrentTime=tempObj.empbid_end_time
                }
              }
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
                "empbid_end_time":updatedCurrentTime ,
                "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
                "fname": tempObj.fname,
                "lname": tempObj.lname,
                "vacationbidstatus":tempObj.vacationbidstatus,
                "trans_seq_id":tempObj.trans_seq_id,
                "empseq_id": tempObj.empseq_id
            }

          this.widnowTranSer.updateBidWindowData(this.finalArr[i].duid,tempNewObj).subscribe((res)=>{
                 var updatedRes
                 updatedRes=res

            },(err)=>{console.log(err)},()=>{})

      }
      if(this.user_data.empid!=undefined){
        if(this.skipBidLeaveForm.value.skipRoundType==='skipCurrentRound'){
          if(Number(this.round_id)+ + +1==1){
            this.emailNotificationsSer.WhenEmployeeFinishesBiddingForAnyRoundWithSkippedVacation(this.bid_schedule_id,this.empId,Number(this.round_id)+ + +1,0).subscribe((res)=>{},
            (err)=>{console.log(err)},()=>{})
          }
        }else{
          if(Number(this.round_id)+ + +1==1){
            this.emailNotificationsSer.WhenEmployeeFinishesBiddingForAnyRoundWithSkippedVacation(this.bid_schedule_id,this.empId,Number(this.round_id)+ + +1,1).subscribe((res)=>{},
            (err)=>{console.log(err)},()=>{})
          }else{
            this.emailNotificationsSer.skipVacationBidding(this.bid_schedule_id,this.empId,Number(this.round_id)+ + +1,1).subscribe((res)=>{},
            (err)=>{console.log(err)},()=>{})
          }

        }
      }
    this.modalCtrl.dismiss({"check":true,'skipdata':this.skipBidLeaveForm.value.skipRoundType})
  }
  skipCurrentRound(){

    this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
      var temp=res
      this.allBidRoundData=[]
      var tempObj
    this.finalArr=[]
      for(var i=0;i<temp.length;i++){
        if(temp[i].bidschidref==this.bid_schedule_id && (Number(this.round_id)+ + +1)==temp[i].roundseq_id){
          tempObj=temp[i]

        }
      }
      var tempNewObj
      if(tempObj.vacationbidstatus=="Eligible"){
        var end
        if(Number(this.round_id)+ + +1!=tempObj.roundseq_id){
          end=tempObj.empbid_start_time.split('.')[0]
        }else{
          end=tempObj.empbid_end_time.split('.')[0]
        }
        var shiftlineskippedstatus='Skipped',skippedstatus='Skipped'
        if(this.user_data.empid==undefined){
          skippedstatus= 'Manager Skipped'
          shiftlineskippedstatus='Manager Skipped'
        }

        if(tempObj.roundseq_id==1){
          if(this.user_data.empid==undefined){
            skippedstatus= 'Manager Skipped'
            shiftlineskippedstatus='Manager Completed'
          }else{
            skippedstatus= 'Skipped'
            shiftlineskippedstatus='Completed'
          }
        }
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
          "empbid_end_time":tempObj.empbid_end_time.split('.')[0],
          "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
          "shiftlinebidstatus": shiftlineskippedstatus,
          "vacationbidstatus":skippedstatus,
          "fname": tempObj.fname,
          "lname": tempObj.lname,
          "trans_seq_id":tempObj.trans_seq_id,
          "empseq_id": tempObj.empseq_id
      }
    }else{
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
        "empbid_end_time":tempObj.empbid_end_time.split('.')[0],
        "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
        "shiftlinebidstatus": tempObj.shiftlinebidstatus,
        "vacationbidstatus":tempObj.vacationbidstatus,
        "fname": tempObj.fname,
        "lname": tempObj.lname,
        "trans_seq_id":tempObj.trans_seq_id,
        "empseq_id": tempObj.empseq_id
    }
    }
      this.finalArr.push(tempNewObj)
    },(err)=>{console.log(err)},()=>{})
  }
  skipAllRound(){

    this.widnowTranSer.getBidWindowDataBasedOnempId(this.empId).subscribe((res)=>{
      var temp=res
      this.allBidRoundData=[]
      var tempObj
    this.finalArr=[]

      for(var i=0;i<temp.length;i++){
        tempObj=temp[i]
        var tempNewObj
        if(temp[i].bidschidref==this.bid_schedule_id){
        if(  temp[i].vacationbidstatus=="Eligible"){
          var end
          if(Number(this.round_id)+ + +1!=tempObj.roundseq_id){
            end=tempObj.empbid_start_time.split('.')[0]
          }else{
            end=tempObj.empbid_end_time.split('.')[0]
          }

          if(this.user_data.empid!=undefined){
            end=tempObj.empbid_start_time.split('.')[0]
          }
          var shiftlineskippedstatus='Skipped',skippedstatus='Skipped'
          if(this.user_data.empid==undefined){
            skippedstatus= 'Manager Skipped'
            shiftlineskippedstatus='Manager Skipped'
          }

          if(tempObj.roundseq_id==1){
            if(this.user_data.empid==undefined){
              skippedstatus= 'Manager Skipped'
              shiftlineskippedstatus='Manager Completed'
            }else{
              skippedstatus= 'Skipped'
              shiftlineskippedstatus='Completed'
            }
          }
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
              "empbid_end_time":end,
              "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
              "shiftlinebidstatus":shiftlineskippedstatus,
              "vacationbidstatus":skippedstatus,
              "fname": tempObj.fname,
              "trans_seq_id":tempObj.trans_seq_id,
              "lname": tempObj.lname,
              "empseq_id": tempObj.empseq_id
          }
          this.finalArr.push(tempNewObj)
        }
      else{

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
          "empbid_end_time":tempObj.empbid_end_time.split('.')[0],
          "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
          "shiftlinebidstatus": tempObj.shiftlinebidstatus,
          "vacationbidstatus":tempObj.vacationbidstatus,
          "fname": tempObj.fname,
          "lname": tempObj.lname,
          "trans_seq_id":tempObj.trans_seq_id,
          "empseq_id": tempObj.empseq_id
      }
    }

    }

  }
  //     this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
  //
  // },(err)=>{console.log(err)},()=>{})
    },(err)=>{console.log(err)},()=>{})
  }

}
