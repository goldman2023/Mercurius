import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { ChangeDetectorRef } from '@angular/core';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { ActivatedRoute } from '@angular/router';
import { LocalDataService } from 'src/app/services/data/local-data.service';

@Component({
  selector: 'app-select-vacation-slot-summary',
  templateUrl: './select-vacation-slot-summary.component.html',
  styleUrls: ['./select-vacation-slot-summary.component.scss'],
})
export class SelectVacationSlotSummaryComponent implements OnInit {
  vacation_slot_id
  vacation_slot_data
  temp
  editHide=true
  schedule_id
  all_slots=[]
  user_data
  vacationSlotForm: any;
  view_bid_schedule_id
  newBidSchedule;
  editBidSchedule=false
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
    private activaRouter: ActivatedRoute,
    public alertCtrl: AlertController,
    private bidScheduleSer:CreateNewBidScheduleService,
    private localData: LocalDataService
  ) {
    this.view_bid_schedule_id=navParams.get('view_bid_schedule_id')
    this.editBidSchedule=navParams.get('editBidSchedule');
  }

  ngOnInit() {

    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
if(this.view_bid_schedule_id==undefined){
    var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))

    var temp
    this.all_slots=[]
    for(var i=0;i<tempObj.leavemap.length;i++){
           temp={"id":i,"startDate":tempObj.leavemap[i].leavestartdate,"endDate":tempObj.leavemap[i].leaveenddate,"slots":tempObj.leavemap[i].leaveslots,"leaveseq_id":tempObj.leavemap[i].leaveseq_id}
           this.all_slots.push(temp)
    }
  }else{
    if(this.editBidSchedule==true){
      var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))

      var temp
      this.all_slots=[]
      for(var i=0;i<tempObj.leavemap.length;i++){
             temp={"id":i,"startDate":tempObj.leavemap[i].leavestartdate,"endDate":tempObj.leavemap[i].leaveenddate,"slots":tempObj.leavemap[i].leaveslots,"leaveseq_id":tempObj.leavemap[i].leaveseq_id}
             this.all_slots.push(temp)
      }
    }else{
    this.viewBidScheduleData()
    }
  }
}
viewBidScheduleData(){
  this.bidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.view_bid_schedule_id).subscribe((res)=>{
    this.newBidSchedule=res
    var temp
  this.all_slots=[]
    for(var i=0;i<this.newBidSchedule.leavemap.length;i++){
           temp={"id":i,"startDate":this.newBidSchedule.leavemap[i].leavestartdate,"endDate":this.newBidSchedule.leavemap[i].leaveenddate,"slots":this.newBidSchedule.leavemap[i].leaveslots,"leaveseq_id":this.newBidSchedule.leavemap[i].leaveseq_id}
           this.all_slots.push(temp)
    }
  },(err)=>{},()=>{})
}
  close(){
    this.modalCtrl.dismiss()
  }
  submit(){
}
}
