import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { SaveScheduleComponent } from 'src/app/dashboard/generated_schedule/generated-schedules/save-schedule/save-schedule.component';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-edit-schedule-action-sheet',
  templateUrl: './edit-schedule-action-sheet.component.html',
  styleUrls: ['./edit-schedule-action-sheet.component.scss'],
})
export class EditScheduleActionSheetComponent implements OnInit {
  scheduleShift
  fileName= 'Schedule Data.xlsx';
  defscheduleShift
  deletedShiftLines
  shiftline_schedule_name
  allShiftDataWithIncludeExclude
  user_data
  edit_schedule_id
  defReqVsGeneData
 ReqVsGeneData
  reqvsgenDefDataShiftTime=[];reqvsgenDefDataSun=[];reqvsgenDefDataMon=[];reqvsgenDefDataTue=[];reqvsgenDefDataWed=[];reqvsgenDefDataThu=[];reqvsgenDefDataFri=[];reqvsgenDefDataSat=[]
  reqvsgenDataShiftTime=[];reqvsgenDataSun=[];reqvsgenDataMon=[];reqvsgenDataTue=[];reqvsgenDataWed=[];reqvsgenDataThu=[];reqvsgenDataFri=[];reqvsgenDataSat=[]
  allShiftData=[]
  all_schedule=[]
  bid_schedule
  all_bid_schedule=[]
  shiftline_Schedule_data
  allScheduleName=[]
  defrdosArr=[]
  rdosArr=[]
  constructor(
    public modalCtrl: ModalController,
              private route:Router,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private scheduleService:GeneratedScheduleService,
              private headerTitleService: HeaderTitleService,
              private activaRouter: ActivatedRoute,public navParams: NavParams,
              public navCtrl: NavController,
              private cdref: ChangeDetectorRef,
              private bidSer:BidScheduleService,
              private localData: LocalDataService,
              public formBuilder: FormBuilder,
              public busniessRulesValidation:BusinessRulesValidationService,
              public actionsheetCtrl: ActionSheetController,
  ) {
    this.edit_schedule_id=navParams.get('edit_schedule_id')
    this.shiftline_schedule_name=navParams.get('shiftline_schedule_name')
    this.scheduleShift=navParams.get('scheduleShift')
    this.defscheduleShift=navParams.get('defscheduleShift')
    this.defReqVsGeneData=navParams.get('defReqVsGeneData')
    this.ReqVsGeneData=navParams.get('ReqVsGeneData')
    this.reqvsgenDefDataShiftTime=navParams.get('reqvsgenDefDataShiftTime')
    this.reqvsgenDefDataSun=navParams.get('reqvsgenDefDataSun')
    this.reqvsgenDefDataMon=navParams.get('reqvsgenDefDataMon')
    this.reqvsgenDefDataTue=navParams.get('reqvsgenDefDataTue')
    this.reqvsgenDefDataWed=navParams.get('reqvsgenDefDataWed')
    this.reqvsgenDefDataThu=navParams.get('reqvsgenDefDataThu')
    this.reqvsgenDefDataFri=navParams.get('reqvsgenDefDataFri')
    this.reqvsgenDefDataSat=navParams.get('reqvsgenDefDataSat')
    this.reqvsgenDataShiftTime=navParams.get('reqvsgenDataShiftTime')
    this.reqvsgenDataSun=navParams.get('reqvsgenDataSun')
    this.reqvsgenDataMon=navParams.get('reqvsgenDataMon')
    this.reqvsgenDataTue=navParams.get('reqvsgenDataTue')
    this.reqvsgenDataWed=navParams.get('reqvsgenDataWed')
    this.reqvsgenDataThu=navParams.get('reqvsgenDataThu')
    this.reqvsgenDataFri=navParams.get('reqvsgenDataFri')
    this.reqvsgenDataSat=navParams.get('reqvsgenDataSat')
    this.rdosArr=navParams.get('rdosArr')
    this.defrdosArr=navParams.get('defrdosArr')
  }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))

    if(this.shiftline_schedule_name!=undefined && this.shiftline_schedule_name!='' && this.shiftline_schedule_name!=null ){
      this.fileName=this.shiftline_schedule_name +' Shiftline-Schedule Data.xlsx'
    }
    this.allShiftDataWithIncludeExclude=JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
    this.getAllBidSchedule()
    this.getSchedule()
  }

  async checkforupdateData(){
    var count=0
      for(var i=0;i<this.allScheduleName.length;i++){
        if(this.allScheduleName[i]==this.edit_schedule_id){
          count++

        }
      }
      if(count<1){
        this.update()
      }else{

        const confirm = await this.alertCtrl.create({
          header: 'Alert',
          message: "Can't update the Shiftline Schedule because it is included in a Bid Schedule.",
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        })
        await confirm.present();
      }
  }

  getAllBidSchedule(){

      this.bidSer.getAllBidSchedule(this.user_data.id).subscribe((res)=>{
      var temp
      temp=this.multiDimensionalUnique(res);
      this.bid_schedule=temp
      this.all_bid_schedule=this.bid_schedule
      var temp
      },(err)=>{
        console.log(err)
      },()=>{})
  }
  multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    var tempArr=[]
    this.allScheduleName=[]
    for(var i=0;i<uniques.length;i++){
      if(uniques[i].shiftdefmap.length>0){
    var dates=[],tempFinalArr=[]
    for(var j=0;j<uniques[i].shiftdefmap.length;j++){
    this.allScheduleName.push(uniques[i].shiftdefmap[j].shiftdefref)
    }
      }
    }
  }

  getSchedule(){
      var tempObj={}
      var tempArr=[]
      var all_shift_data=[]
      for(var i=0;i<this.allShiftData.length;i++){

      all_shift_data.push({
      "id": this.allShiftData[i].id,
      "shiftCategory": this.allShiftData[i].shiftCategory,
      "shiftName": this.allShiftData[i].shiftName,
      "startTime": this.allShiftData[i].startTime})
    }
    this.scheduleService.newgetAllSchedule(this.user_data.id).subscribe((res)=>{

    this.all_schedule=res
    if(this.all_schedule.length>0){
    this.all_schedule=  this.all_schedule.sort((a, b)=>{return b.sh_schedule_id - a.sh_schedule_id});
    }

    return this.all_schedule

    },(error)=>{
    console.log(error)
    },()=>{
    })
  }

  close(){
    this.modalCtrl.dismiss()
  }
  async update(){
    if(this.edit_schedule_id=='I'){
      var obj,tempArr=[]

      for(var i=0;i<this.scheduleShift.length;i++){

          if( this.scheduleShift[i].id!==null){
              obj={
                "shiftdurationc":this.scheduleShift[i].shiftdurationc,
              "id": this.scheduleShift[i].seq_id,
              "Mon": this.scheduleShift[i].Mon,
              "Tue": this.scheduleShift[i].Tue,
              "Wed": this.scheduleShift[i].Wed,
              "Thu": this.scheduleShift[i].Thu,
              "Fri": this.scheduleShift[i].Fri,
              "Sat": this.scheduleShift[i].Sat,
              "Sun": this.scheduleShift[i].Sun,
              "Sunshift2": this.scheduleShift[i].Sunshift2,
              "Wedshift2": this.scheduleShift[i].Wedshift2,
              "Monshift2": this.scheduleShift[i].Monshift2,
              "Frishift2":this.scheduleShift[i].Frishift2,
              "Satshift2": this.scheduleShift[i].Satshift2,
              "Thushift2": this.scheduleShift[i].Thushift2,
              "Tueshift2":this.scheduleShift[i].Tueshift2,
              "Pattern": this.scheduleShift[i].Pattern,
              "SL": this.scheduleShift[i].SL,
              }
              tempArr.push(obj)
          }}
    var saveSchedule={"new":[],"duplicate":tempArr}
    const modal = await this.modalCtrl.create({
      component: SaveScheduleComponent,
      // componentProps: { days: day_summary,schedule_id:this.schedule_id },
      cssClass: 'saveSchedule',
      componentProps: { saveSchedule:saveSchedule,schedule:[]},
      swipeToClose:true
    });
    return await modal.present();
            }else{
              //Update schedule function
              this.saveInDataBase()
            }
  }
  async saveAsnew(){
    var tempArr=[],newShiftLine=[]
    var all_shift_data=[],obj
    for(var i=0;i<this.scheduleShift.length;i++){
      {
        obj={
        "seq_id": this.scheduleShift[i].seq_id,
        "mon": this.scheduleShift[i].Mon,
        "tue": this.scheduleShift[i].Tue,
        "wed": this.scheduleShift[i].Wed,
        "thu": this.scheduleShift[i].Thu,
        "fri": this.scheduleShift[i].Fri,
        "sat": this.scheduleShift[i].Sat,
        "monshift2": this.scheduleShift[i].Monshift2,
        "tueshift2": this.scheduleShift[i].Tueshift2,
        "wedshift2": this.scheduleShift[i].Wedshift2,
        "thushift2": this.scheduleShift[i].Thushift2,
        "frishift2": this.scheduleShift[i].Frishift2,
        "satshift2": this.scheduleShift[i].Satshift2,
        "sunshift2": this.scheduleShift[i].Sunshift2,
        "shiftdurationc":this.scheduleShift[i].shiftdurationc,
        "sun": this.scheduleShift[i].Sun,
        "shiftdurationp":this.scheduleShift[i].shiftdurationp,
        "pattern": this.scheduleShift[i].Pattern,
        "schedulename": this.scheduleShift[i].schedulename,
        "shiftname": this.scheduleShift[i].SL,
        "areaid": this.scheduleShift[i].areaid,
        "userid": this.scheduleShift[i].userid}
        tempArr.push(obj)

    }
    }
    this.modalCtrl.dismiss()
    const modal = await this.modalCtrl.create({
      component: SaveScheduleComponent,
      // componentProps: { days: day_summary,schedule_id:this.schedule_id },
      cssClass: 'saveSchedule',
      componentProps: { schedule:tempArr,saveSchedule:[] },
      swipeToClose:true
    });
    return await modal.present();
  }
    async saveInDataBase(){
          var tempArr=[],newShiftLine=[]
          var all_shift_data=[],obj
          var shiftlineScheduleDurationLength=8
          shiftlineScheduleDurationLength=this.scheduleShift[0].shiftdurationp
          for(var i=0;i<this.scheduleShift.length;i++){
            {
              obj={
                "schedule_id": this.scheduleShift[i].schedule_id,
                "id": this.scheduleShift[i].id,

                "shiftdurationc":this.scheduleShift[i].shiftdurationc,
              "seq_id": this.scheduleShift[i].seq_id,
              "mon": this.scheduleShift[i].Mon,
              "tue": this.scheduleShift[i].Tue,
              "wed": this.scheduleShift[i].Wed,
              "thu": this.scheduleShift[i].Thu,
              "fri": this.scheduleShift[i].Fri,
              "sat": this.scheduleShift[i].Sat,
              "sun": this.scheduleShift[i].Sun,
              "monshift2": this.scheduleShift[i].Monshift2,
              "tueshift2": this.scheduleShift[i].Tueshift2,
              "wedshift2": this.scheduleShift[i].Wedshift2,
              "thushift2": this.scheduleShift[i].Thushift2,
              "frishift2": this.scheduleShift[i].Frishift2,
              "satshift2": this.scheduleShift[i].Satshift2,
              "sunshift2": this.scheduleShift[i].Sunshift2,
              "pattern": this.scheduleShift[i].Pattern,
              "schedulename": this.scheduleShift[i].schedulename,
              "shiftname": this.scheduleShift[i].SL,
              "areaid": this.scheduleShift[i].areaid,
              "userid": this.scheduleShift[i].userid}
              tempArr.push(obj)

          }

          }

          var tempObj={},tempShiftObj={}
          var tempNewArr=[]

          for(var i=0;i<tempArr.length;i++){

              tempObj={
                "sh_line_id": tempArr[i].id,
                "seq_id": tempArr[i].seq_id,
                "mon": tempArr[i].mon,
                "tue": tempArr[i].tue,
                "wed": tempArr[i].wed,
                "thu":tempArr[i].thu,
                "fri": tempArr[i].fri,
                "monshift2": tempArr[i].monshift2,
                "tueshift2": tempArr[i].tueshift2,
                "wedshift2": tempArr[i].wedshift2,
                "thushift2": tempArr[i].thushift2,
                "frishift2":tempArr[i].frishift2,
                "satshift2": tempArr[i].satshift2,
                "sunshift2": tempArr[i].sunshift2,
                "shiftdurationc":tempArr[i].shiftdurationc,
                "sat": tempArr[i].sat,
                "sun": tempArr[i].sun,
                "pattern": tempArr[i].pattern,
                "schedulename": tempArr[i].schedulename,
                "shiftname": tempArr[i].shiftname,
                "shidref": tempArr[i].schedule_id,
            }
            tempNewArr.push(tempObj)
          }
          var finalScheduleDataOfUpdate={
            "schedulename":this.shiftline_schedule_name,
            "areaid":tempArr[0].areaid,
            "userid": this.user_data.id,
            "shiftdurationp":shiftlineScheduleDurationLength,
               "sh_schedule_id":Number(this.edit_schedule_id),
          "schild":tempNewArr
          }
          this.deletedShiftLines=JSON.parse(this.localData.getItem('deletedShiftLines'))
          if(this.deletedShiftLines!=null){
          for(var i=0;i<this.deletedShiftLines.length;i++){
            if(this.deletedShiftLines[i]!=null ){
              if( this.deletedShiftLines[i].id!=null ){
                this.scheduleService.newdeleteShiftLine(this.deletedShiftLines[i].id).subscribe(
                  (res)=>{

                  },
                  (err)=>{console.log(err);},()=>{})
              }
            }
          }
          this.localData.removeItem('deletedShiftLines')
        }

          this.scheduleService.newupdateSchedule(finalScheduleDataOfUpdate.sh_schedule_id,finalScheduleDataOfUpdate).subscribe(
            (res)=>{

              this.modalCtrl.dismiss()
              Swal.fire({
                title: 'Updated successfully!',
                icon: 'success',
                showCancelButton: false,
                imageHeight:'250px',
                confirmButtonColor:'#ff6700',
                heightAuto:false,
              }).then((result) => {
                // this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
                if(this.user_data.role=='bidmanager'){
                  this.localData.removeItem('editCustomizedScheduleShiftLine')
                  this.localData.removeItem('editDefaultScheduleShiftLine')
                  this.localData.removeItem('allShiftRequiredDataForEditSchedule')
                  this.localData.removeItem('focusShiftLine')
                  this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
                }else{
                  this.localData.removeItem('editCustomizedScheduleShiftLine')
                  this.localData.removeItem('editDefaultScheduleShiftLine')
                  this.localData.removeItem('allShiftRequiredDataForEditSchedule')
                  this.localData.removeItem('focusShiftLine')
                  this.navCtrl.navigateBack([straightlines_io_apis.apis.guest_manage_shift_line_schedule])
                }
              })
            },
            (err)=>{
              console.log(err);
              this.modalCtrl.dismiss()
              Swal.fire({
                title: 'Error!',
                html: 'Please try again later!',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor:'#ff6700',
                imageHeight:'250px',
                heightAuto:false,
              }).then((result) => {
                this.localData.removeItem('editCustomizedScheduleShiftLine')
                this.localData.removeItem('editDefaultScheduleShiftLine')
                this.localData.removeItem('allShiftRequiredDataForEditSchedule')
                this.localData.removeItem('focusShiftLine')
                this.navCtrl.navigateBack([straightlines_io_apis.apis.manage_shift_line_schedule])
              })

            },
            ()=>{}
          )
    }
}
