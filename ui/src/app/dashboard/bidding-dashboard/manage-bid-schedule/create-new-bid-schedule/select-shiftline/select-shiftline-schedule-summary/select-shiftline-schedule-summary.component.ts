import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { ChangeDetectorRef } from '@angular/core';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';

@Component({
  selector: 'app-select-shiftline-schedule-summary',
  templateUrl: './select-shiftline-schedule-summary.component.html',
  styleUrls: ['./select-shiftline-schedule-summary.component.scss'],
})
export class SelectShiftlineScheduleSummaryComponent implements OnInit {
  schedule_data
  scheduleName
  temp
  editHide=true
  all_ScheduleListData=[]
  schedule_id
  editBidSchedule=false
  user_data
  scheduleListForm: any;
  view_bid_schedule_id
  newBidSchedule;
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
    private bidScheduleSer:CreateNewBidScheduleService,
    private localData: LocalDataService
  ) {
    // this.schedule_data=navParams.get('schedule_data')
    // this.schedule_id=navParams.get('schedule_id')
    this.view_bid_schedule_id=navParams.get('view_bid_schedule_id')
    this.editBidSchedule=navParams.get('editBidSchedule');

  }

  ngOnInit() {

    this.user_data=JSON.parse(sessionStorage.getItem('userData'))

    if(this.view_bid_schedule_id==undefined){
   var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
  //
   var temp
   this.all_ScheduleListData=[]
   for(var i=0;i<tempObj.shiftdefmap.length;i++){
    this.getScheduleName(tempObj.shiftdefmap[i].shiftdefref,tempObj.shiftdefmap[i],i)

   }

   this.scheduleListForm  = this.fb.group({
        allScheduleListData: this.fb.array([]) ,
      });
    }else{
      if(this.editBidSchedule==true){
        var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))
  //
   var temp
   this.all_ScheduleListData=[]
   for(var i=0;i<tempObj.shiftdefmap.length;i++){
    this.getScheduleName(tempObj.shiftdefmap[i].shiftdefref,tempObj.shiftdefmap[i],i)

   }

   this.scheduleListForm  = this.fb.group({
        allScheduleListData: this.fb.array([]) ,
      });
      }else{
        this.viewBidScheduleData()
      }
    }

}
viewBidScheduleData(){
  this.bidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.view_bid_schedule_id).subscribe((res)=>{
    this.newBidSchedule=res
    var temp
    for(var i=0;i<this.newBidSchedule.shiftdefmap.length;i++){
      this.getScheduleName(this.newBidSchedule.shiftdefmap[i].shiftdefref,this.newBidSchedule.shiftdefmap[i],i)
    }
  },(err)=>{},()=>{})
}
getScheduleName(scheduleId,scheduleData,index){
  var tempscheduleName,temp
  this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(scheduleId).subscribe(
    (res)=>{
      tempscheduleName=res[0].schedulename
      temp={"id":index,"startDate":scheduleData.shiftdefstartdate,"endDate":scheduleData.shiftdefenddate,"scheduleName":tempscheduleName,'scheduleID':scheduleId}
      this.all_ScheduleListData.push(temp)
      this.all_ScheduleListData=this.all_ScheduleListData.sort((a,b)=> {return new Date(a.startDate).getTime()-new Date(b.startDate).getTime()})
    },
    (err)=>{console.log(err)},()=>{})
}
  get allScheduleListData() : FormArray {
    return this.scheduleListForm .get("allScheduleListData") as FormArray
   }
   newWorkLoadData(): FormGroup {
    return this.fb.group({
      id:new FormControl(),
      scheduleName:new FormControl(),
      startDate:new FormControl(),
      endDate:new FormControl(),

      scheduleID:new FormControl(),

    })
  }
  shiftLineForm(){
    var temp
    var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
    this.all_ScheduleListData=[]
    for(var i=0;i<tempObj.shiftdefmap.length;i++){
    //  if(tempObj.shiftdefmap[i].shiftdefref===this.schedule_data.shiftdefref){
            temp=[{"id":0,"startDate":tempObj.shiftdefmap[i].shiftdefstartdate,"endDate":tempObj.shiftdefmap[i].shiftdefenddate,"scheduleName":this.scheduleName,'scheduleID':this.schedule_data.shiftdefref}]
        this.all_ScheduleListData.push(temp)
    //  }
    }

  }
  close(){
    this.modalCtrl.dismiss()
  }
  submit(){
    if(this.editHide==true){
      this.editHide=false
    }else{
      this.editHide=true
    }

    var temp=[]
    var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
    var tempNewObj

    for(var i=0;i<tempObj.shiftdefmap.length;i++){
      if(tempObj.shiftdefmap[i].shiftdefref===this.schedule_data.shiftdefref){
        if(this.scheduleListForm.value.allScheduleListData[0].startDate!=null && this.scheduleListForm.value.allScheduleListData[0].endDate!=null ){
          temp.push({
            "shiftdefref": this.scheduleListForm.value.allScheduleListData[0].scheduleID,
            "shiftdefstartdate":this.scheduleListForm.value.allScheduleListData[0].startDate,
            "shiftdefenddate": this.scheduleListForm.value.allScheduleListData[0].endDate}
            )
        }else{
          temp.push({
            "shiftdefref":tempObj.shiftdefmap[i].shiftdefref,
            "shiftdefstartdate":tempObj.shiftdefmap[i].shiftdefstartdate,
            "shiftdefenddate": tempObj.shiftdefmap[i].shiftdefenddate}
            )
        }
      }
      else{
          temp.push({
            "shiftdefref":tempObj.shiftdefmap[i].shiftdefref,
            "shiftdefstartdate":tempObj.shiftdefmap[i].shiftdefstartdate,
            "shiftdefenddate": tempObj.shiftdefmap[i].shiftdefenddate}
            )

      }
     }
     if(tempObj==null){
      tempNewObj={
        "bidschename": 'MySchedule',
        "bidmanagerid": this.user_data.id,
        "timezone":"",
        "weekendstatus": false,
        "bidschstartdate":null ,
        "bidschenddate": null,
        "schedulesavestatus": 0,
        "leavesavestatus": 0,
        "roundsavestatus": 0,
        "shiftdefmap": temp,
        "employeemap": [],
        "leavemap": [],
        "roundmap": []
      }
    }else{
      tempNewObj={
        "bidschename": tempObj.bidschename,
        "bidmanagerid": this.user_data.id,
        "bidschstartdate":tempObj.bidschstartdate,
        "timezone":tempObj.timezone,
        "weekendstatus": tempObj.weekendstatus,
        "bidschenddate":tempObj.bidschenddate,
        "schedulesavestatus": tempObj.schedulesavestatus,
        "leavesavestatus": tempObj.leavesavestatus,
        "roundsavestatus": tempObj.roundsavestatus,
        "shiftdefmap": temp,
        "employeemap": tempObj.employeemap,
        "leavemap": tempObj.leavemap,
        "roundmap": tempObj.roundmap
      }

    }
    this.localData.setItem('newBidSchedule',JSON.stringify(tempNewObj))
    this.ngOnInit()
  }
  dateRangeChange(){

  }
  onClick(){
    if(this.editHide==true){
      this.editHide=false
    }else{
      this.editHide=true
    }

  }
}
