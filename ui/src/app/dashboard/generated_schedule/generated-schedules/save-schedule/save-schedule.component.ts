import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { WorkforceService } from 'src/app/services/workforce/workforce.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-save-schedule',
  templateUrl: './save-schedule.component.html',
  styleUrls: ['./save-schedule.component.scss'],
})
export class SaveScheduleComponent implements OnInit {

  scheduleNameForm: FormGroup;
  select_shiftline_schedule=['Trimester1_Shiftline Schedule','Trimester2_Shiftline Schedule','Trimester3_Shiftline Schedule']
  saveSchedule=[];
  all_Schedule: any;
  updateScheduleId: any;
  schedule__name: any;
  allShiftData=[]
  user_data: any;
  scheduleNameUnique=true;
  saveDuplicateSchedule=[];
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private headerTitleService: HeaderTitleService,
    private scheduleService: GeneratedScheduleService,
    private workforceService: WorkforceService,
    private localData: LocalDataService,
    private fb:FormBuilder) {
      this.saveSchedule=navParams.get('saveSchedule')
      this.saveDuplicateSchedule=navParams.get('schedule')

   }

  ngOnInit() {
    this.allShiftData=  JSON.parse(this.localData.getItem('allShiftRequiredData'))
    this.updateScheduleId=JSON.parse(this.localData.getItem('updateScheduleId'))

    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.allShiftData=[]
    // if(this.updateScheduleId==''){
    //   this.schedule__name=''
    // }
    // else{
    // for(var i=0;i<this.all_Schedule.length;i++){
    //   if(i===Number(this.updateScheduleId)){
    //     this.schedule__name=this.all_Schedule[i].schedule_name;
    //   }
    // }}
    this.scheduleNameForm = this.fb.group({
     schedule_name:new FormControl(this.schedule__name,Validators.compose([Validators.required,Validators.pattern(/^[ A-Za-z0-9_-]*$/)])),
    })



  }
  get schedule_name(){
    return this.scheduleNameForm.get('schedule_name')
  }

  scheduleShiftLine(){}
  submit2(){


var tempObj={},tempShiftObj={}
var tempArr=[],shiftlineScheduleDurationLength=8
var tempShiftDefintionArr=[]


if(this.saveSchedule.length>0){
  shiftlineScheduleDurationLength=this.saveSchedule[0].shiftdurationp
for(var i=0;i<this.saveSchedule.length;i++){

  tempObj={
      "seq_id": this.saveSchedule[i].id,
      "mon": this.saveSchedule[i].Mon,
      "tue": this.saveSchedule[i].Tue,
      "wed": this.saveSchedule[i].Wed,
      "thu": this.saveSchedule[i].Thu,
      "fri": this.saveSchedule[i].Fri,
      "sat": this.saveSchedule[i].Sat,
      "sun": this.saveSchedule[i].Sun,
      "monshift2": this.saveSchedule[i].Monshift2,
      "tueshift2": this.saveSchedule[i].Tueshift2,
      "wedshift2": this.saveSchedule[i].Wedshift2,
      "thushift2": this.saveSchedule[i].Thushift2,
      "frishift2": this.saveSchedule[i].Frishift2,
      "satshift2": this.saveSchedule[i].Satshift2,
      "sunshift2": this.saveSchedule[i].Sunshift2,
      "schedulename": this.scheduleNameForm.value.schedule_name,
      "shiftname": this.saveSchedule[i].SL,
      "shiftdurationc":this.saveSchedule[i].shiftdurationc,
      "areaid": 4,
      "pattern":this.saveSchedule[i].Pattern,
      "userid": this.user_data.id
  }
  tempArr.push(tempObj)
}
}else{
  shiftlineScheduleDurationLength=this.saveDuplicateSchedule[0].shiftdurationp
  for(var i=0;i<this.saveDuplicateSchedule.length;i++){
    tempObj={
        "seq_id": this.saveDuplicateSchedule[i].seq_id,
        "mon": this.saveDuplicateSchedule[i].mon,
        "tue": this.saveDuplicateSchedule[i].tue,
        "wed": this.saveDuplicateSchedule[i].wed,
        "thu": this.saveDuplicateSchedule[i].thu,
        "fri": this.saveDuplicateSchedule[i].fri,
        "sat": this.saveDuplicateSchedule[i].sat,
        "sun": this.saveDuplicateSchedule[i].sun,
        "monshift2": this.saveDuplicateSchedule[i].monshift2,
        "tueshift2": this.saveDuplicateSchedule[i].tueshift2,
        "wedshift2": this.saveDuplicateSchedule[i].wedshift2,
        "thushift2": this.saveDuplicateSchedule[i].thushift2,
        "frishift2": this.saveDuplicateSchedule[i].frishift2,
        "satshift2": this.saveDuplicateSchedule[i].satshift2,
        "sunshift2": this.saveDuplicateSchedule[i].sunshift2,
        "schedulename": this.scheduleNameForm.value.schedule_name,
        "shiftname": this.saveDuplicateSchedule[i].shiftname,
        "areaid": this.saveDuplicateSchedule[i].areaid,
        "shiftdurationc":this.saveDuplicateSchedule[i].shiftdurationc,
        "pattern":this.saveDuplicateSchedule[i].pattern,
        "userid": this.user_data.id
    }
    tempArr.push(tempObj)
  }
}
tempShiftDefintionArr=[]
for(var i=0;i<this.allShiftData.length;i++){
  tempShiftObj={
    "schedulename": this.scheduleNameForm.value.schedule_name,
    "userid": this.user_data.id,
    "shiftdurationp":shiftlineScheduleDurationLength,
    "shiftname": this.allShiftData[i].shiftName,
    "starttime": this.allShiftData[i].startTime

  }
  tempShiftDefintionArr.push(tempShiftObj)
}
this.scheduleService.checkScheduleName({"schedulename":this.scheduleNameForm.value.schedule_name}).subscribe((res)=>{

    var message=res['message']
    if(message==='Duplicate'){
      this.scheduleNameUnique=false
    }
    else if(message=== 'Unique'){
      this.scheduleNameUnique=true

      this.scheduleService.saveAllShiftLine(tempArr).subscribe((res)=>{
                Swal.fire({
              title: 'Success!',
              html: 'Your schedule is saved!',
              icon: 'success',
              showCancelButton: false,
              imageHeight:'250px',
              heightAuto:false,
              confirmButtonColor:'#ff6700',
            }).then((result) => {
            })
        },(error)=>{
          console.log(error)
          Swal.fire({
            title: 'Error!',
            html: 'Please try again later!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor:'#ff6700',
            imageHeight:'250px',
            heightAuto:false,
          }).then((result) => {
          })

        },()=>{

              this.modalCtrl.dismiss()
        })
    }
},(error)=>{
  console.log(error)
},()=>{
})


  }
  close(){
    this.modalCtrl.dismiss()
  }
  addNewShiftlineSchedule(){
    var tempObj={},tempShiftObj={}
var tempArr=[]
var tempShiftDefintionArr=[]

var shiftlineScheduleDurationLength=8
if(this.saveSchedule.length>0){
  shiftlineScheduleDurationLength=this.saveSchedule[0].shiftdurationp
for(var i=0;i<this.saveSchedule.length;i++){

  tempObj={
      "seq_id": this.saveSchedule[i].id,
      "mon": this.saveSchedule[i].Mon,
      "tue": this.saveSchedule[i].Tue,
      "wed": this.saveSchedule[i].Wed,
      "thu": this.saveSchedule[i].Thu,
      "fri": this.saveSchedule[i].Fri,
      "sat": this.saveSchedule[i].Sat,
      "sun": this.saveSchedule[i].Sun,
      "monshift2": this.saveSchedule[i].Monshift2,
      "tueshift2": this.saveSchedule[i].Tueshift2,
      "wedshift2": this.saveSchedule[i].Wedshift2,
      "thushift2": this.saveSchedule[i].Thushift2,
      "frishift2": this.saveSchedule[i].Frishift2,
      "satshift2": this.saveSchedule[i].Satshift2,
      "sunshift2": this.saveSchedule[i].Sunshift2,
      "shiftname": this.saveSchedule[i].SL,
      // "areaid": 4,
      "shiftdurationc":this.saveSchedule[i].shiftdurationc,
      "pattern":this.saveSchedule[i].Pattern,
      // "userid": this.user_data.id



    }
  tempArr.push(tempObj)
}
}else{
  shiftlineScheduleDurationLength=this.saveDuplicateSchedule[0].shiftdurationp
  for(var i=0;i<this.saveDuplicateSchedule.length;i++){
    tempObj={
        "seq_id": this.saveDuplicateSchedule[i].seq_id,
        "mon": this.saveDuplicateSchedule[i].mon,
        "tue": this.saveDuplicateSchedule[i].tue,
        "wed": this.saveDuplicateSchedule[i].wed,
        "thu": this.saveDuplicateSchedule[i].thu,
        "fri": this.saveDuplicateSchedule[i].fri,
        "sat": this.saveDuplicateSchedule[i].sat,
        "sun": this.saveDuplicateSchedule[i].sun,
        "monshift2": this.saveDuplicateSchedule[i].monshift2,
        "tueshift2": this.saveDuplicateSchedule[i].tueshift2,
        "wedshift2": this.saveDuplicateSchedule[i].wedshift2,
        "thushift2": this.saveDuplicateSchedule[i].thushift2,
        "frishift2": this.saveDuplicateSchedule[i].frishift2,
        "satshift2": this.saveDuplicateSchedule[i].satshift2,
        "sunshift2": this.saveDuplicateSchedule[i].sunshift2,
        "shiftdurationc":this.saveDuplicateSchedule[i].shiftdurationc,
        "schedulename": this.scheduleNameForm.value.schedule_name,
        "shiftname": this.saveDuplicateSchedule[i].shiftname,
        "areaid": this.saveDuplicateSchedule[i].areaid,
        "pattern":this.saveDuplicateSchedule[i].pattern,
        "userid": this.user_data.id
    }
    tempArr.push(tempObj)
  }
}
var finalScheduleData={
  "schedulename":this.scheduleNameForm.value.schedule_name,
  "areaid":4,
  "shiftdurationp":shiftlineScheduleDurationLength,
  "userid": this.user_data.id,
"schild":tempArr
}

    this.scheduleService.newcheckScheduleName(this.scheduleNameForm.value.schedule_name,this.user_data.id).subscribe((res)=>{
      var message=res
      if(res['message']=== "name exists"){
        this.scheduleNameUnique=false
      }
      else if(res['message']=== "unique name"){
        this.scheduleNameUnique=true

        this.scheduleService.newSaveAllShiftLine(finalScheduleData).subscribe((res)=>{

                  Swal.fire({
                title: 'Success!',
                html: 'Your schedule is saved!',
                icon: 'success',
                showCancelButton: false,
                imageHeight:'250px',
                heightAuto:false,
                confirmButtonColor:'#ff6700',
              }).then((result) => {
              })
              var work_load_data = JSON.parse(
                this.localData.getItem('updatedallShiftRequiredData')
              );
              var arr_work_force_data = [];
              var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              work_load_data.forEach((data) => {
                days.forEach((day) => {
                  arr_work_force_data.push({
                    shiftDay: day,
                    shiftDuration: data.shift_duration,
                    shiftLineScheduleIdRef: res.sh_schedule_id,
                    shiftName: data.shiftName,
                    shiftTime: data.startTime,
                    managerIdRef: this.user_data.id,
                    countOfEmp: data[day],
                    systemShiftIdRef: data.shift_created_by == 'system' ? data.id : 0,
                    userShiftIdRef: data.shift_created_by == 'user' ? data.id : 0
                  });
                });
              });
              this.workforceService.saveWorkforceDetails(arr_work_force_data).subscribe((res) => {})
          },(error)=>{
            console.log(error)
            Swal.fire({
              title: 'Error!',
              html: 'Please try again later!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor:'#ff6700',
              imageHeight:'250px',
              heightAuto:false,
            }).then((result) => {
            })

          },()=>{

                this.modalCtrl.dismiss()
          })
      }
  },(error)=>{
    console.log(error)
  },()=>{
  })
  }
}
