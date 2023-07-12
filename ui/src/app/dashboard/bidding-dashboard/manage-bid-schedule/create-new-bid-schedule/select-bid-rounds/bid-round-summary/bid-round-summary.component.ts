import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { ChangeDetectorRef } from '@angular/core';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { TimezoneService } from 'src/app/services/manage-bid-schedule/timezone/timezone.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-bid-round-summary',
  templateUrl: './bid-round-summary.component.html',
  styleUrls: ['./bid-round-summary.component.scss'],
})
export class BidRoundSummaryComponent implements OnInit {
  user_data: any;
  all_bid_rounds=[]
  view_bid_schedule_id
  editBidSchedule=false
  newBidSchedule
  bidScheduleTimeZone
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private scheduleService:GeneratedScheduleService,
    private fb:FormBuilder,
    private cdr: ChangeDetectorRef,
    private getAllEmp:AddNewEmployeeService,
    public alertController: AlertController,
    public alertCtrl: AlertController,
    private timezoneSer: TimezoneService,
    private bidScheduleSer:CreateNewBidScheduleService,
    private localData: LocalDataService
  ) {
    this.view_bid_schedule_id=navParams.get('view_bid_schedule_id')
    this.editBidSchedule=navParams.get('editBidSchedule');

   }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))

this.getTimeZone()
  }
bidRoundSUmmaryData(){
    var temp
    this.all_bid_rounds=[]

    if(this.view_bid_schedule_id==undefined){
      var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
      for(var i=0;i<tempObj.roundmap.length;i++){
        var tempTime=Number(tempObj.roundmap[i].roundduration.split(":")[1])+ + +Number(tempObj.roundmap[i].roundduration.split(":")[0])*60
           temp={"id":i,"startDate":tempObj.roundmap[i].roundstartdate,"endDate":tempObj.roundmap[i].roundenddate,"bidleavereason":tempObj.roundmap[i].bidleavereason,"leaveseq_id":tempObj.roundmap[i].roundseq_id,"roundStartTime": this.convertTimeTo24(tempObj.roundmap[i].actual_bidround_start_time),"roundEndTime":this.convertTimeTo24(tempObj.roundmap[i].actual_bidround_end_time),"duration":tempTime}
           this.all_bid_rounds.push(temp)
    }



    for(var i=0;i<this.allTimeZone.length;i++){
      if(this.allTimeZone[i].location==tempObj.timezone){
        this.bidScheduleTimeZone=this.allTimeZone[i].acronym+' - '+this.allTimeZone[i].location
    }
    }
  }else{
    if(this.editBidSchedule==true){
      var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))
      for(var i=0;i<tempObj.roundmap.length;i++){

        var tempTime=Number(tempObj.roundmap[i].roundduration.split(":")[1])+ + +Number(tempObj.roundmap[i].roundduration.split(":")[0])*60
             temp={"id":i,"startDate":tempObj.roundmap[i].roundstartdate,"endDate":tempObj.roundmap[i].roundenddate,"bidleavereason":tempObj.roundmap[i].bidleavereason,"leaveseq_id":tempObj.roundmap[i].roundseq_id,"roundStartTime": this.convertTimeTo24(tempObj.roundmap[i].actual_bidround_start_time),"roundEndTime":this.convertTimeTo24(tempObj.roundmap[i].actual_bidround_end_time),"duration":tempTime}
             this.all_bid_rounds.push(temp)
      }
      for(var i=0;i<this.allTimeZone.length;i++){
        if(this.allTimeZone[i].location==tempObj.timezone){
          this.bidScheduleTimeZone=this.allTimeZone[i].acronym+' - '+this.allTimeZone[i].location
      }
      }
    }else{
      this.viewBidScheduleData()
    }

  }
}
allTimeZone
getTimeZone(){
  this.timezoneSer.getAllTimeZone().subscribe((res)=>{

    this.allTimeZone=res
    this.bidRoundSUmmaryData()
  },(err)=>{console.log(err)
  this.allTimeZone=[];
  this.allTimeZone.push({'location':'US/Eastern','acronym':'EST'}), this.bidRoundSUmmaryData()},()=>{})
}
viewBidScheduleData(){
  this.bidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.view_bid_schedule_id).subscribe((res)=>{
    this.newBidSchedule=res

    var temp
    for(var i=0;i<this.newBidSchedule.roundmap.length;i++){
      var tempTime=Number(this.newBidSchedule.roundmap[i].roundduration.split(":")[1])+ + +Number(this.newBidSchedule.roundmap[i].roundduration.split(":")[0])*60
      temp={"id":i,"startDate":this.newBidSchedule.roundmap[i].roundstartdate,"endDate":this.newBidSchedule.roundmap[i].roundenddate,"bidleavereason":this.newBidSchedule.roundmap[i].bidleavereason,"roundseq_id":this.newBidSchedule.roundmap[i].roundseq_id,"roundStartTime": this.convertTimeTo24(this.newBidSchedule.roundmap[i].actual_bidround_start_time),"roundEndTime":this.convertTimeTo24(this.newBidSchedule.roundmap[i].actual_bidround_end_time),"duration":tempTime}
      this.all_bid_rounds.push(temp)
    }
    for(var i=0;i<this.allTimeZone.length;i++){
      if(this.allTimeZone[i].location==this.newBidSchedule.timezone){
        this.bidScheduleTimeZone=this.allTimeZone[i].acronym+' - '+this.allTimeZone[i].location
    }
    }
  },(err)=>{},()=>{})
}
convertTimeTo24(Time){
  var time=Time.split(":")
  var tempTime=Number(time[0])

  if(Number(tempTime)==24 ||Number(tempTime)==0){
    return 12+':'+time[1]+' AM'
  }else if(Number(tempTime)==12){
    return tempTime+':'+time[1]+' PM'
  }else if(Number(tempTime)>12){

    return tempTime+':'+time[1]+' PM'
  }else{
    return tempTime+':'+time[1]+' AM'
  }
}
  close(){
    this.modalCtrl.dismiss()
  }

}
