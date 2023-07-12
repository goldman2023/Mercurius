import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { ScheduleDataService } from 'src/app/services/schedule-data.service';
import { WorkLoadService } from 'src/app//services/work-load.service';
import defData from 'src/app//json/work-load-data.json';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { HeaderTitleForModalPageService } from 'src/app/dashboard/nav-bar-footer/header-title-for-modal-page.service';
import { CreateNewShiftDefintionPage } from 'src/app/dashboard/work_load_data/create-new-shift-defintion/create-new-shift-defintion.page';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-edit-schedule-data',
  templateUrl: './edit-schedule-data.page.html',
  styleUrls: ['./edit-schedule-data.page.scss'],
})

export class EditScheduleDataPage  implements OnInit {
  // scheduleShiftLine=scheduleShiftLines
  pdfSrc = "../assets/document/FAA Order 7210_2_6_7_BasicWatchSchedule.pdf ";
  checkUserAccess=false
  workShiftLine=[] as any;
  resultShiftLine=[] as any
  finalResultShiftLine=[]as any
  scheduleDataId: any;
  scheduleData: any;
  errorMsg: any;
  scheduleDataSunSat: any;
  // workLoadData: any;
  selected_shift_duration=8
  default_selected_shift_duration=8
da1=[] as any
  wDataThree: any;
  wDataTwelve: any;
  wDataOne: any;
  wDataTwo: any;
  wDataFour: any;
  wDataElevenNight: any;
  wDataEleven: any;
  wDataTen: any;
  wDataNine: any;
  wDataEight: any;
  wDataSeven: any;
  wDataSix: any;
  wDataFive: any;
  ishidden = false;
  x
  status: boolean = true;
  editScheduleDataForm: FormGroup;
  disableAddButton=true
  public HideId: boolean = false;
  public showHideText: boolean = false;
  editData: any;
   exampleArray = []
  valid: any =true;
  tempScheduleDataStored: any[];
  data1: any[];
  gapBetweenshift: any;
  da: any[];
  static urlArray;
  workD: any;
  scheduleShiftLine: any;
  scheduleLData: any;
  workLoadData: any=defData;
  testing: any[];
  static data5;
  data2: any;
  pattern
  work_Pattern: any;
  dat1: any;
  WED: any;
  workPattern
  workPatternResult
  convertStringToCharLeft
  convertStringToCharRight
  patternLeft
  patternRight
  allShiftName=[] as any
  hrs=40
  allShiftData
  shift_Pattern
  shift_line: {};
  temp: any;
  schedule_id
  resetScheduleData
  resetschedule_id
  resetButtonCheck = false
  shiftCategoryName = [
    'MID', 'EVE', 'DAY', 'M/D', 'D/E', 'E/M'
  ];
  user_data: any;

  constructor(private route:Router,
              public workLoadDataService:WorkLoadService,
              public navCtrl: NavController,
              public dataService:ScheduleDataService,
              public busniessRulesValidation:BusinessRulesValidationService,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public viewCtrl: ModalController,
              private headerTitleService: HeaderTitleForModalPageService,
             public formBuilder: FormBuilder,
             private localData: LocalDataService,
             private cd: ChangeDetectorRef
    ) {

      EditScheduleDataPage.urlArray ="false";
      this.scheduleData=navParams.get('scheduleData')
      this.headerTitleService.setTitle('Edit Shift Line');
      this.schedule_id=navParams.get('schedule_id')
      this.resetScheduleData=this.scheduleData
      this.resetschedule_id=this.schedule_id

    let countValueOfX=0
    let countValueOfM=0
    this.selected_shift_duration=this.scheduleData.shiftdurationc
    this.da =[this.scheduleData.id,this.scheduleData.Sun+'-'+this.selected_shift_duration,this.scheduleData.Mon+'-'+this.selected_shift_duration,this.scheduleData.Tue+'-'+this.selected_shift_duration,this.scheduleData.Wed+'-'+this.selected_shift_duration,this.scheduleData.Thu+'-'+this.selected_shift_duration,this.scheduleData.Fri+'-'+this.selected_shift_duration,this.scheduleData.Sat+'-'+this.selected_shift_duration,this.scheduleData.Pattern,this.scheduleData.SL]
      this.tempScheduleDataStored = [this.scheduleData.Sun,this.scheduleData.Mon,this.scheduleData.Tue,this.scheduleData.Wed,this.scheduleData.Thu,this.scheduleData.Fri,this.scheduleData.Sat]
      this.shift_Pattern=''
     for(var j=0;j<this.tempScheduleDataStored.length;j++){
           this.shift_Pattern=this.shift_Pattern+this.tempScheduleDataStored[j]
     }

      var right_text = this.shift_Pattern.substring(7, this.shift_Pattern.indexOf("X"),this.shift_Pattern.indexOf("X"));
      var left_text = this.shift_Pattern.substring(0, this.shift_Pattern.indexOf("X"),this.shift_Pattern.indexOf("X"));
      this.convertStringToCharLeft=Array.from(left_text)
      this.convertStringToCharRight=Array.from(right_text)
      this.patternRight=''
      this.patternLeft=''
     for(var i=0;i<this.convertStringToCharRight.length;i++){
       if(this.convertStringToCharRight[i]!=='X'){
         this.patternRight=this.patternRight+this.convertStringToCharRight[i]
       }
     }
     for(var i=0;i<this.convertStringToCharLeft.length;i++){
       if(this.convertStringToCharLeft[i]!=='X'){
         this.patternLeft=this.patternLeft+this.convertStringToCharLeft[i]
       }
     }
     this.shift_Pattern=this.patternRight+this.patternLeft
     this.workPattern=''
     this.convertStringToCharLeft=Array.from(this.shift_Pattern)
     this.da1=[]
        for(var i=0;i<this.da.length;i++){
        this.da1.push(String(this.da[i]))
        }
        this.selected_shift_duration=Number(this.scheduleData.shiftdurationc)
    if(this.selected_shift_duration==undefined){
      this.selected_shift_duration=8
    }
    this.default_selected_shift_duration=this.selected_shift_duration
    }

    get staticUrlArray() {
      return EditScheduleDataPage.urlArray
    }
  ngOnInit() {
    if(sessionStorage.getItem('token')!=undefined){
      this.checkUserAccess=true
    }else{
     this.checkUserAccess=false
    }
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.updateLocalShiftData();
      this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
      this.data2=JSON.parse(this.localData.getItem('workData'))
      this.workLoadData=this.data2
    const test=[]
    if(Number(this.selected_shift_duration)!=9){
        for(var j = 0;j<this.tempScheduleDataStored.length;j++){
          for(var i=0;i<this.allShiftName.length;i++){
            if(this.allShiftName[i].shiftName==this.tempScheduleDataStored[j]){
              this.temp =this.allShiftName[i].shift_StartTime
            }else if(this.tempScheduleDataStored[j]=='X'){
              this.temp='X'
            }
          }
        test.push(this.temp)
        }

    this.shift_line={
      "shift_line": test,
        "shift_length":Number(this.selected_shift_duration)
    }

      this.busniessRulesValidation.businessRulesCheck(this.shift_line).subscribe(
        async (res)=>{
          var tempRule
          tempRule=res
          this.valid=tempRule.business_rules
      },
      (error: any)=>{this.errorMsg=error;console.log(this.errorMsg)},
      async () => {});
    this.scheduleShiftLine=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
    this.scheduleShiftLine=this.scheduleShiftLine[this.schedule_id]
    this.data2=JSON.parse(this.localData.getItem('workData'))
    this.workLoadData=this.data2
    this.hrs=Number(Array.from(this.da1[8]).length*Number(this.selected_shift_duration))

    this.work_Pattern=this.da1[8]
    this.editScheduleDataForm = this.formBuilder.group({
      id:[this.scheduleData.id],
      Mon: [this.checkRdo(this.da1[2])],
      Tue:[this.checkRdo(this.da1[3])],
      Wed: [this.checkRdo(this.da1[4])],
      Thu: [this.checkRdo(this.da1[5])],
      Fri: [this.checkRdo(this.da1[6])],
      Sat: [this.checkRdo(this.da1[7])],
      Sun: [this.checkRdo(this.da1[1])],
      // Pattern:[this.da1[8]],
      BMLRule: [this.valid],
      SL:[this.scheduleData.SL]

    })
    this.oldValue= [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];

    return  this.wDataOne,this.wDataTwo,this.wDataThree,this.wDataFour,this.wDataFive,this.wDataSix,this.wDataSeven,this.wDataEight,this.wDataNine,this.wDataTen,this.wDataEleven,this.wDataElevenNight, this.wDataTwelve
  }else{
    this.ngOnInitForNineHours()
  }
  }
  checkRdo(value){
    if(value.split('-')[0]=='X'){
      return 'X'
    }else{
      return value
    }
  }
 async segmentChanged(event){
    this.selected_shift_duration = Number(event.detail.value)
    if(this.selected_shift_duration!=9){
      if(Number(this.resetScheduleData.shiftdurationc) == this.selected_shift_duration){
        this.allShiftName=[];
        await this.ngOnInit()

      }else{
        this.updateDataBasedOntheChagedShiftLength();
      }
    }else{
      if(Number(this.resetScheduleData.shiftdurationc) == this.selected_shift_duration){
        this.allShiftName=[];
        await this.ngOnInitForNineHours()

      }else{
        this.updateDataBasedon9HoursShiftLength();
      }
    }
  }

    updateDataBasedOntheChagedShiftLength(){
      this.work_Pattern=''
      this.hrs=0
      this.valid=false
      this.disableAddButton=true
      this. oldValue=['X','X','X','X','X','X','X']
      if(this.resetButtonCheck==false || this.selected_shift_duration!=9){
        this.editScheduleDataForm = this.formBuilder.group({
          id:[this.scheduleData.id],
          Mon: ['X'],
          Tue:['X'],
          Wed: ['X'],
          Thu: ['X'],
          Fri: ['X'],
          Sat: ['X'],
          Sun: ['X'],
          SL:[this.scheduleData.SL]
        })
      }
    }
    oldValue=['X','X','X','X','X','X','X']
     oldtempScheduleDataStoredForNineHoursOne=['X','X','X','X','X','X','X']
    oldtempScheduleDataStoredForNineHoursTwo=['X','X','X','X','X','X','X']
    async checkAddNewShiftDefintion(){
      this.tempScheduleDataStored =  [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];
    var checkAddNew=false
    for(var j=0;j<this.tempScheduleDataStored.length;j++){
      if(this.tempScheduleDataStored[j]=='add'){
        checkAddNew=true

        if(j==0){this.editScheduleDataForm.controls.Sun.setValue(this.oldValue[0])}else if(j==1){this.editScheduleDataForm.controls.Mon.setValue(this.oldValue[1])}else if(j==2){this.editScheduleDataForm.controls.Tue.setValue(this.oldValue[2])}else if(j==3){this.editScheduleDataForm.controls.Wed.setValue(this.oldValue[3])}else if(j==4){this.editScheduleDataForm.controls.Thu.setValue(this.oldValue[4])}else if(j==5){this.editScheduleDataForm.controls.Fri.setValue(this.oldValue[5])}else if(j==6){this.editScheduleDataForm.controls.Sat.setValue(this.oldValue[6])}
      }
    }
    this.oldValue= [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];
    if(checkAddNew==true){
      if(this.checkUserAccess==true){
        const modal = await this.modalCtrl.create({
          component: CreateNewShiftDefintionPage,
          componentProps: { shift_duration:this.selected_shift_duration },
          cssClass: 'AddNewShiftDefintion',
          swipeToClose:true
        });
        modal.onDidDismiss().then(()=>{

          this.updateShiftDefintionData()
         })
        return await modal.present();
      }else{
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          message: "Sorry, you don't have access to create a new shift! Please upgrade your plan.",
          buttons: ['OK']
        });

        await alert.present();
      }
    }else{
        this.businessRuleValidation()
    }
    }
    async updateLocalShiftData() {
      var all_defined_shifts = await this.workLoadDataService
        .getAllSystemDefinedShiftDefinition(8)
        .toPromise();
      
      var system_defined_ten_hours_shifts = await this.workLoadDataService
        .getAllSystemDefinedShiftDefinition(10)
        .toPromise();
      
      system_defined_ten_hours_shifts.forEach((shift) => all_defined_shifts.push(shift));
      
      var user_defined_shifts = await this.workLoadDataService
        .getAllShiftDefinition(this.user_data.id)
        .toPromise();
      
      user_defined_shifts.map((data) => ({
          id: data.sh_id,
          startTime: data.sh_starttime,
          shiftName: data.sh_name,
          shiftCategory: data.sh_category_id,
          shift_duration: data.sh_duration,
          shift_created_by: data.sh_created_by,
          sh_include_exclude: data.sh_include_exclude,
          shift_category_name: data.sh_category_name_ref,
          sun: '0',
          mon: '0',
          tue: '0',
          wed: '0',
          thu: '0',
          fri: '0',
          sat: '0'
        })).forEach((data) => {
          all_defined_shifts.push(data);
        });
      
      all_defined_shifts = all_defined_shifts.map((data) => ({
                            ...data,
                            Sun: data.sun,
                            Mon: data.mon,
                            Tue: data.tue,
                            Wed: data.wed,
                            Thu: data.thu,
                            Fri: data.fri,
                            Sat: data.sat,
                            sunOutlier: false,
                            monOutlier: false,
                            tueOutlier: false,
                            wedOutlier: false,
                            thuOutlier: false,
                            friOutlier: false,
                            satOutlier: false,
                            startTime: data.startTime
                              .substring(0, data.startTime.length - 3)
                              .replace(':', ''),
                          }))
                          .sort((a, b) => 
                            a.startTime.localeCompare(b.startTime)
                          ).sort((a, b) => {
                            return (Number(a.startTime) >= 2200) ? -1 : 1
                          });

      this.allShiftName = [];
      this.allShiftData = all_defined_shifts;
      this.allShiftData.forEach((shift) => {
        if (shift.sh_include_exclude == 'I' &&
            (Number(this.selected_shift_duration) == 9 ||
            Number(this.selected_shift_duration) != 9 && shift.shift_duration == Number(this.selected_shift_duration))) {
          this.allShiftName.push({
            "shiftName": shift.shiftName,
            "shiftCategory": shift.shiftCategory,
            "shift_StartTime": shift.startTime,
            "shift_category_name": this.shiftCategoryName[shift.shiftCategory - 1],
            "shift_duration": shift.shift_duration,
            "shiftData": String(shift.shiftName) + '-' + String(shift.shift_duration)
          })
        }
      });
      
      this.localData.setItem(
        'updatedallShiftRequiredData',
        JSON.stringify(all_defined_shifts)
      );
    }
  async updateShiftDefintionData(){
    await this.updateLocalShiftData();
  this.editScheduleDataForm = this.formBuilder.group({
    id:[this.scheduleData.id],
    Mon: [this.editScheduleDataForm.controls.Mon.value],
    Tue:[this.editScheduleDataForm.controls.Tue.value],
    Wed: [this.editScheduleDataForm.controls.Wed.value],
    Thu: [this.editScheduleDataForm.controls.Thu.value],
    Fri: [this.editScheduleDataForm.controls.Fri.value],
    Sat: [this.editScheduleDataForm.controls.Sat.value],
    Sun: [this.editScheduleDataForm.controls.Sun.value],
    // Pattern:[''],
    // BMLRule: [this.valid],
    SL:[this.scheduleData.SL]

  })
  this.businessRuleValidation()
  }
  businessRuleValidation(){
    var count=0
    this.tempScheduleDataStored = [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];

    for(var j=0;j<this.tempScheduleDataStored.length;j++){
      if(this.tempScheduleDataStored[j]=='X'){
        count++
      }
    }
    this.work_Pattern=''
  for(var j=0;j<this.tempScheduleDataStored.length;j++){
    if(this.tempScheduleDataStored[j]!='X'){
     for(var k=0;k<this.allShiftName.length;k++){
       if(this.tempScheduleDataStored[j]==this.allShiftName[k].shiftData){
         this.work_Pattern=this.work_Pattern+this.allShiftName[k].shiftCategory
       }
      }
      }else{
        this.work_Pattern=this.work_Pattern+'X'
     }
   }
    var right_text = this.work_Pattern.substring(7, this.work_Pattern.indexOf("X"),this.work_Pattern.indexOf("X"));
    var left_text = this.work_Pattern.substring(0, this.work_Pattern.indexOf("X"),this.work_Pattern.indexOf("X"));
    this.convertStringToCharLeft=Array.from(left_text)
    this.convertStringToCharRight=Array.from(right_text)
    this.patternRight=''
    this.patternLeft=''
    for(var i=0;i<this.convertStringToCharRight.length;i++){
      if(this.convertStringToCharRight[i]!=='X'){
        this.patternRight=this.patternRight+this.convertStringToCharRight[i]
      }
    }
    for(var i=0;i<this.convertStringToCharLeft.length;i++){
      if(this.convertStringToCharLeft[i]!=='X'){
        this.patternLeft=this.patternLeft+this.convertStringToCharLeft[i]
      }
    }
    this.work_Pattern=this.patternRight+this.patternLeft
    this.workPattern=''
    this.convertStringToCharLeft=Array.from(this.work_Pattern)
    for(var i=0;i<this.convertStringToCharLeft.length;i++){
      if(this.convertStringToCharLeft[i]=='1'||this.convertStringToCharLeft[i]==1){
        this.workPattern=this.workPattern+'M'
      }
      else if(this.convertStringToCharLeft[i]=='2'||this.convertStringToCharLeft[i]==2){
        this.workPattern=this.workPattern+'E'
      }
      else if(this.convertStringToCharLeft[i]=='3'||this.convertStringToCharLeft[i]==3){
        this.workPattern=this.workPattern+'D'
      }
      else if(this.convertStringToCharLeft[i]=='4'||this.convertStringToCharLeft[i]==4){
        this.workPattern=this.workPattern+'S'
      }
      else if(this.convertStringToCharLeft[i]=='5'||this.convertStringToCharLeft[i]==5){
        this.workPattern=this.workPattern+'S'
      }else if(this.convertStringToCharLeft[i]=='6'||this.convertStringToCharLeft[i]==6){
        this.workPattern=this.workPattern+'S'
      }

    }
    this.work_Pattern=this.workPattern
    this.hrs=Number(Array.from(this.work_Pattern).length*Number(this.selected_shift_duration))

    if(Number(this.selected_shift_duration)==8){
      if(count==2){
        this.disableAddButton=false
        this.nextValidation()
      }else{
        this.disableAddButton=true
      }
    }else{
    if(Number(this.selected_shift_duration)==10){
      if(count==3){
          this.disableAddButton=false
          this.nextValidation()
        }else{
          this.disableAddButton=true
        }
      }
    }
  }
nextValidation(){
  const test=[]

  for(var j = 0;j<this.tempScheduleDataStored.length;j++){
    for(var i=0;i<this.allShiftName.length;i++){
    if(this.allShiftName[i].shiftData==this.tempScheduleDataStored[j]){
      this.temp =this.allShiftName[i].shift_StartTime
    }else if(this.tempScheduleDataStored[j]=='X'){
      this.temp='X'
    }
  }
  test.push(this.temp)
}
  this.shift_line={
    "shift_line": test,
      "shift_length":Number(this.selected_shift_duration)
  }

  this.busniessRulesValidation.businessRulesCheck(this.shift_line).subscribe(
     (res)=>{
      var tempRule
      tempRule=res
      this.valid=tempRule.business_rules
  },
  (error: any)=>{this.errorMsg=error;console.log(this.errorMsg)},
  async () => {
  }
  );
}
get Mon(){
  return this.editScheduleDataForm.get('Mon')
}

get Tue(){
  return this.editScheduleDataForm.get('Tue')
}
get Wed(){
  return this.editScheduleDataForm.get('Wed')
}
get Thu(){
  return this.editScheduleDataForm.get('Thu')
}
get Fri(){
  return this.editScheduleDataForm.get('Fri')
}
get Sat(){
  return this.editScheduleDataForm.get('Sat')
}
get Sun(){
  return this.editScheduleDataForm.get('Sun')
}
get Mon1(){
  return this.addScheduleDataFormForNineHours.get('Mon')
}

get Tue1(){
  return this.addScheduleDataFormForNineHours.get('Tue1')
}
get Wed1(){
  return this.addScheduleDataFormForNineHours.get('Wed1')
}
get Thu1(){
  return this.addScheduleDataFormForNineHours.get('Thu1')
}
get Fri1(){
  return this.addScheduleDataFormForNineHours.get('Fri1')
}
get Sat1(){
  return this.addScheduleDataFormForNineHours.get('Sat1')
}
get Sun1(){
  return this.addScheduleDataFormForNineHours.get('Sun1')
}
get Mon2(){
  return this.addScheduleDataFormForNineHours.get('Mon2')
}

get Tue2(){
  return this.addScheduleDataFormForNineHours.get('Tue2')
}
get Wed2(){
  return this.addScheduleDataFormForNineHours.get('Wed2')
}
get Thu2(){
  return this.addScheduleDataFormForNineHours.get('Thu2')
}
get Fri2(){
  return this.addScheduleDataFormForNineHours.get('Fri2')
}
get Sat2(){
  return this.addScheduleDataFormForNineHours.get('Sat2')
}
get Sun2(){
  return this.addScheduleDataFormForNineHours.get('Sun2')
}
get BMRule(){
  return this.editScheduleDataForm.get('BMRule')
}
// get Pattern(){
//   return this.editScheduleDataForm.get('Pattern')
// }


  async update(index){
    if(this.selected_shift_duration!=9){
          this.editData=
          {
            "id":this.editScheduleDataForm.value.id,
            "Mon":this.editScheduleDataForm.value.Mon.split('-')[0],
            "Tue": this.editScheduleDataForm.value.Tue.split('-')[0],
            "Wed": this.editScheduleDataForm.value.Wed.split('-')[0],
            "Thu": this.editScheduleDataForm.value.Thu.split('-')[0],
            "Fri": this.editScheduleDataForm.value.Fri.split('-')[0],
            "Sat": this.editScheduleDataForm.value.Sat.split('-')[0],
            "Sun": this.editScheduleDataForm.value.Sun.split('-')[0],
            "SL": this.editScheduleDataForm.value.SL,
            "shiftdurationc":Number(this.selected_shift_duration),
            "BMLRule":this.valid,
            "shiftdurationp":this.scheduleData.shiftdurationp,
            "seq":this.scheduleData.seq,
            "Pattern":this.work_Pattern,
          }
            this.editData.BMLRule=this.valid
          if(isNaN(this.editData.Sun)==false){
            this.editData.Sun=Number(this.editData.Sun)
          }else{
            this.editData.Sun=this.editData.Sun
          }
          if(isNaN(this.editData.Mon)==false){
            this.editData.Mon=Number(this.editData.Mon)
          }else{
            this.editData.Mon=this.editData.Mon
          }
          if(isNaN(this.editData.Tue)==false){
            this.editData.Tue=Number(this.editData.Tue)
          }else{
            this.editData.Tue=this.editData.Tue
          }
          if(isNaN(this.editData.Wed)==false){
            this.editData.Wed=Number(this.editData.Wed)
          }else{
            this.editData.Wed=this.editData.Wed
          }
          if(isNaN(this.editData.Thu)==false){
            this.editData.Thu=Number(this.editData.Thu)
          }else{
            this.editData.Thu=this.editData.Thu
          }
          if(isNaN(this.editData.Fri)==false){
            this.editData.Fri=Number(this.editData.Fri)
          }else{
            this.editData.Fri=this.editData.Fri
          }
          if(isNaN(this.editData.Sat)==false){
            this.editData.Sat=Number(this.editData.Sat)
          }else{
            this.editData.Sat=this.editData.Sat
          }
        }else{
          this.editData=
          {
            "id":this.addScheduleDataFormForNineHours.controls.id.value,
            "Mon":this.addScheduleDataFormForNineHours.controls.Mon1.value,
            "Tue":this.addScheduleDataFormForNineHours.controls.Tue1.value,
            "Wed": this.addScheduleDataFormForNineHours.controls.Wed1.value,
            "Thu": this.addScheduleDataFormForNineHours.controls.Thu1.value,
            "Fri": this.addScheduleDataFormForNineHours.controls.Fri1.value,
            "Sat": this.addScheduleDataFormForNineHours.controls.Sat1.value,
            "Sun": this.addScheduleDataFormForNineHours.controls.Sun1.value,
            "Monshift2":this.addScheduleDataFormForNineHours.controls.Mon2.value,
            "Tueshift2":this.addScheduleDataFormForNineHours.controls.Tue2.value,
            "Wedshift2": this.addScheduleDataFormForNineHours.controls.Wed2.value,
            "Thushift2": this.addScheduleDataFormForNineHours.controls.Thu2.value,
            "Frishift2": this.addScheduleDataFormForNineHours.controls.Fri2.value,
            "Satshift2": this.addScheduleDataFormForNineHours.controls.Sat2.value,
            "Sunshift2": this.addScheduleDataFormForNineHours.controls.Sun2.value,
            "SL": this.addScheduleDataFormForNineHours.controls.SL.value,
            "shiftdurationc":Number(this.selected_shift_duration),
            "shiftdurationp":this.scheduleData.shiftdurationp,
            "BMLRule":this.valid,
            "seq":this.scheduleData.seq,
            "Pattern":this.work_Pattern,
          }
        }
        for(var i=0;i<this.scheduleShiftLine.length;i++)
        {
          if(this.scheduleShiftLine[i]?.id!=this.editData.id)
          {
            this.finalResultShiftLine.push(this.scheduleShiftLine[i])
          }
          else{
            this.finalResultShiftLine.push(this.editData)
          }
        }

  this.resultShiftLine =Object.assign(this.finalResultShiftLine,this.editData)
    var current_customized_schedule=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
    var temp_schedule,after_edit=[]

    for(var i=0;i<current_customized_schedule.length;i++){
      if(i==Number(this.schedule_id)){
        temp_schedule=this.finalResultShiftLine
      }else{
        temp_schedule=current_customized_schedule[i]
      }
      after_edit.push(temp_schedule)
    }
            this.localData.removeItem('customizedScheduleShiftLine')
            this.localData.setItem('customizedScheduleShiftLine',JSON.stringify(after_edit))
            this.localData.setItem('focusShiftLine',JSON.stringify({"shift_line":this.editData,"schedule_id":this.schedule_id}))
            this.localData.setItem('hideBLrulesLabels',JSON.stringify({"hideBLrulesLabels":true}))
            this.modalCtrl.dismiss();
                  const alert = await this.alertCtrl.create({
                    cssClass: 'my-custom-class',
                    header: 'Alert',
                    message: "Successfully updated!!!",
                    buttons: ['OK']
                  });
                  await alert.present();
              this.modalCtrl.dismiss();
                  // location.reload()
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  async BusinessRulesPdf(){
    this.showHideText = !this.showHideText;
  }


  reset(){
        EditScheduleDataPage.urlArray ="false";
        this.scheduleData=this.resetScheduleData
        this.headerTitleService.setTitle('Edit Shift Line');
        this.schedule_id=this.resetschedule_id
        let countValueOfX=0
        let countValueOfM=0
        this.selected_shift_duration=this.scheduleData.shiftdurationc
        this.da =[this.scheduleData.id,this.scheduleData.Sun+'-'+this.selected_shift_duration,this.scheduleData.Mon+'-'+this.selected_shift_duration,this.scheduleData.Tue+'-'+this.selected_shift_duration,this.scheduleData.Wed+'-'+this.selected_shift_duration,this.scheduleData.Thu+'-'+this.selected_shift_duration,this.scheduleData.Fri+'-'+this.selected_shift_duration,this.scheduleData.Sat+'-'+this.selected_shift_duration,this.scheduleData.Pattern,this.scheduleData.SL]
        this.tempScheduleDataStored = [this.scheduleData.Sun,this.scheduleData.Mon,this.scheduleData.Tue,this.scheduleData.Wed,this.scheduleData.Thu,this.scheduleData.Fri,this.scheduleData.Sat]
        this.shift_Pattern=''
        for(var j=0;j<this.tempScheduleDataStored.length;j++){
              this.shift_Pattern=this.shift_Pattern+this.tempScheduleDataStored[j]
        }

        var right_text = this.shift_Pattern.substring(7, this.shift_Pattern.indexOf("X"),this.shift_Pattern.indexOf("X"));
        var left_text = this.shift_Pattern.substring(0, this.shift_Pattern.indexOf("X"),this.shift_Pattern.indexOf("X"));
        this.convertStringToCharLeft=Array.from(left_text)
        this.convertStringToCharRight=Array.from(right_text)
        this.patternRight=''
        this.patternLeft=''
        for(var i=0;i<this.convertStringToCharRight.length;i++){
          if(this.convertStringToCharRight[i]!=='X'){
            this.patternRight=this.patternRight+this.convertStringToCharRight[i]
          }
        }
        for(var i=0;i<this.convertStringToCharLeft.length;i++){
          if(this.convertStringToCharLeft[i]!=='X'){
            this.patternLeft=this.patternLeft+this.convertStringToCharLeft[i]
          }
        }
        this.shift_Pattern=this.patternRight+this.patternLeft
        this.workPattern=''
        this.convertStringToCharLeft=Array.from(this.shift_Pattern)
        this.da1=[]
          for(var i=0;i<this.da.length;i++){
          this.da1.push(String(this.da[i]))
          }
          this.selected_shift_duration=Number(this.scheduleData.shiftdurationc)
          if(this.selected_shift_duration==undefined){
            this.selected_shift_duration=8
          }
          this.default_selected_shift_duration=this.selected_shift_duration
          this.resetButtonCheck=true
    this.ngOnInit()
  }
  deleteShiftLines=[]
  afterdeleteShiftLines=[]
  scheduleShift=[]
  async removeItem(sd){
        sd=this.scheduleData
        this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
        this.scheduleShift=this.scheduleShift[this.schedule_id]
        const confirm = await this.alertCtrl.create({
          header: 'Are you sure?',
          message: 'Are you sure you want to delete the record?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

              }
            },
            {
              text: 'Delete',
              role: 'delete',
              handler: async () => {

                let j = 0;
                this.afterdeleteShiftLines=[]
                this.deleteShiftLines=[]
            do {
            if( this.scheduleShift[j].id==sd.id){
                if(this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Sun == 'X' && this.scheduleShift[j]?.Mon == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Mon == 'X' && this.scheduleShift[j]?.Tue == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Tue == 'X' && this.scheduleShift[j]?.Wed == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Wed == 'X' && this.scheduleShift[j]?.Thu == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Thu == 'X' && this.scheduleShift[j]?.Fri == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }
                else if(this.scheduleShift[j]?.Fri == 'X' && this.scheduleShift[j]?.Sat == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
                  this.scheduleShift.splice( this.scheduleShift.indexOf(sd), 1);
                }

              }else{
                this.afterdeleteShiftLines.push(this.scheduleShift[j])
              }

              j++;
            }while(j < this.scheduleShift.length)
            for(var i=0;i<this.afterdeleteShiftLines.length;i++){
              if(this.afterdeleteShiftLines[i]!=null){
                this.deleteShiftLines.push(this.afterdeleteShiftLines[i])
              }
            }

    var current_customized_schedule=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
    var temp_schedule,after_delete=[]

    for(var i=0;i<current_customized_schedule.length;i++){
      if(i==this.schedule_id){
        temp_schedule=this.deleteShiftLines
      }else{
        temp_schedule=current_customized_schedule[i]
      }
      after_delete.push(temp_schedule)
    }
            this.localData.removeItem('customizedScheduleShiftLine')
            this.localData.setItem('customizedScheduleShiftLine',JSON.stringify(after_delete))
            this.localData.setItem('focusShiftLine',JSON.stringify({"shift_line":'',"schedule_id":this.schedule_id}))
            // location.reload()
            this.modalCtrl.dismiss()
            const alert = await this.alertCtrl.create({
              cssClass: 'my-custom-class',
              header: 'Alert',
              message: "Successfully deleted!!!",
              buttons: ['OK']
            });
            await alert.present();
        this.modalCtrl.dismiss();
                  }
                }
              ]
            });
        await confirm.present();

    }
    addScheduleDataFormForNineHours
    tempScheduleDataStoredForNineHoursTwo=[]
    tempScheduleDataStoredForNineHoursOne=[]
  ngOnInitForNineHours() {
    this.updateLocalShiftData();
      this.tempScheduleDataStoredForNineHoursOne= [this.scheduleData.Sun,this.scheduleData.Mon,this.scheduleData.Tue,this.scheduleData.Wed,this.scheduleData.Thu,this.scheduleData.Fri,this.scheduleData.Sat];
           this.tempScheduleDataStoredForNineHoursTwo=  [this.scheduleData.Sunshift2,this.scheduleData.Monshift2,this.scheduleData.Tueshift2,this.scheduleData.Wedshift2,this.scheduleData.Thushift2,this.scheduleData.Frishift2,this.scheduleData.Satshift2];;
           this.hrs=0
           this.shift_Pattern=''
           for(var j=0;j<this.tempScheduleDataStoredForNineHoursOne.length;j++){
            this.shift_Pattern=this.shift_Pattern+this.tempScheduleDataStoredForNineHoursOne[j].split('-')[0]
             if(this.tempScheduleDataStoredForNineHoursOne[j]!='X' && this.tempScheduleDataStoredForNineHoursOne[j]!=undefined){
               this.hrs=this.hrs+ + +Number(this.tempScheduleDataStoredForNineHoursOne[j].split('-')[1])
             }
           }
           for(var j=0;j<this.tempScheduleDataStoredForNineHoursTwo.length;j++){
            this.shift_Pattern=this.shift_Pattern+this.tempScheduleDataStoredForNineHoursTwo[j].split('-')[0]
             if(this.tempScheduleDataStoredForNineHoursTwo[j]!='X' && this.tempScheduleDataStoredForNineHoursTwo[j]!=undefined){
               this.hrs=this.hrs+ + +Number(this.tempScheduleDataStoredForNineHoursTwo[j].split('-')[1])
             }
           }
      this.scheduleShiftLine=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
      this.scheduleShiftLine=this.scheduleShiftLine[this.schedule_id]
      this.data2=JSON.parse(this.localData.getItem('workData'))
      this.workLoadData=this.data2

      this.work_Pattern=this.da1[8]
      this.addScheduleDataFormForNineHours = this.formBuilder.group({
        id:[this.scheduleData.id],
        Mon1: [this.tempScheduleDataStoredForNineHoursOne[1]],
        Tue1:[this.tempScheduleDataStoredForNineHoursOne[2]],
        Wed1: [this.tempScheduleDataStoredForNineHoursOne[3]],
        Thu1: [this.tempScheduleDataStoredForNineHoursOne[4]],
        Fri1: [this.tempScheduleDataStoredForNineHoursOne[5]],
        Sat1: [this.tempScheduleDataStoredForNineHoursOne[6]],
        Sun1: [this.tempScheduleDataStoredForNineHoursOne[0]],
        Mon2: [this.tempScheduleDataStoredForNineHoursTwo[1]],
        Tue2:[this.tempScheduleDataStoredForNineHoursTwo[2]],
        Wed2: [this.tempScheduleDataStoredForNineHoursTwo[3]],
        Thu2: [this.tempScheduleDataStoredForNineHoursTwo[4]],
        Fri2: [this.tempScheduleDataStoredForNineHoursTwo[5]],
        Sat2: [this.tempScheduleDataStoredForNineHoursTwo[6]],
        Sun2: [this.tempScheduleDataStoredForNineHoursTwo[0]],
        Pattern:[''],
        // Pattern:[this.da1[8]],
        BMLRule: [this.valid],
        SL:[this.scheduleData.SL]

      })
      this.cd.detectChanges()
      this.businessRuleValidationForNineHours()
      return  this.wDataOne,this.wDataTwo,this.wDataThree,this.wDataFour,this.wDataFive,this.wDataSix,this.wDataSeven,this.wDataEight,this.wDataNine,this.wDataTen,this.wDataEleven,this.wDataElevenNight, this.wDataTwelve
    }
    updateDataBasedon9HoursShiftLength(){
      this.work_Pattern=''
      this.hrs=0
      this.valid=false
      if(this.resetButtonCheck==false && (this.default_selected_shift_duration ==8 || this.default_selected_shift_duration==10)){
        this.addScheduleDataFormForNineHours = this.formBuilder.group({
          id:[this.scheduleData.id],
          Mon1: ['X'],
          Tue1:['X'],
          Wed1: ['X'],
          Thu1: ['X'],
          Fri1: ['X'],
          Sat1: ['X'],
          Sun1: ['X'],
          Mon2: ['X'],
          Tue2:['X'],
          Wed2: ['X'],
          Thu2: ['X'],
          Fri2: ['X'],
          Sat2: ['X'],
          Sun2: ['X'],
          Pattern:[''],
          BMLRule: [this.valid],
          SL:[this.scheduleData.SL]
        })

      }

      if(this.default_selected_shift_duration==9){
        this.businessRuleValidationForNineHours()
      }
    }
    async checkAddNewShiftDefintionForNineHours(){
      this.tempScheduleDataStoredForNineHoursTwo= [this.addScheduleDataFormForNineHours.controls.Sun2.value,this.addScheduleDataFormForNineHours.controls.Mon2.value,this.addScheduleDataFormForNineHours.controls.Tue2.value,this.addScheduleDataFormForNineHours.controls.Wed2.value,this.addScheduleDataFormForNineHours.controls.Thu2.value,this.addScheduleDataFormForNineHours.controls.Fri2.value,this.addScheduleDataFormForNineHours.controls.Sat2.value];
      this.tempScheduleDataStoredForNineHoursOne= [this.addScheduleDataFormForNineHours.controls.Sun1.value,this.addScheduleDataFormForNineHours.controls.Mon1.value,this.addScheduleDataFormForNineHours.controls.Tue1.value,this.addScheduleDataFormForNineHours.controls.Wed1.value,this.addScheduleDataFormForNineHours.controls.Thu1.value,this.addScheduleDataFormForNineHours.controls.Fri1.value,this.addScheduleDataFormForNineHours.controls.Sat1.value];
      var checkAddNew=false
      for(var j=0;j<this.tempScheduleDataStoredForNineHoursOne.length;j++){
        if(this.tempScheduleDataStoredForNineHoursOne[j]=='add'){
          checkAddNew=true
          if(j==0){this.addScheduleDataFormForNineHours.controls.Sun1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[0])}
            else if(j==1){this.addScheduleDataFormForNineHours.controls.Mon1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[1])}
            else if(j==2){this.addScheduleDataFormForNineHours.controls.Tue1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[2])}
            else if(j==3){this.addScheduleDataFormForNineHours.controls.Wed1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[3])}
            else if(j==4){this.addScheduleDataFormForNineHours.controls.Thu1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[4])}
            else if(j==5){this.addScheduleDataFormForNineHours.controls.Fri1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[5])}
            else if(j==6){this.addScheduleDataFormForNineHours.controls.Sat1.setValue(this.oldtempScheduleDataStoredForNineHoursOne[6])}
        }
      }
      for(var j=0;j<this.tempScheduleDataStoredForNineHoursTwo.length;j++){
        if(this.tempScheduleDataStoredForNineHoursTwo[j]=='add'){
          checkAddNew=true
          if(j==0){this.addScheduleDataFormForNineHours.controls.Sun2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[0])}
          else if(j==1){this.addScheduleDataFormForNineHours.controls.Mon2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[1])}
          else if(j==2){this.addScheduleDataFormForNineHours.controls.Tue2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[2])}
          else if(j==3){this.addScheduleDataFormForNineHours.controls.Wed2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[3])}
          else if(j==4){this.addScheduleDataFormForNineHours.controls.Thu2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[4])}
          else if(j==5){this.addScheduleDataFormForNineHours.controls.Fri2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[5])}
          else if(j==6){this.addScheduleDataFormForNineHours.controls.Sat2.setValue(this.oldtempScheduleDataStoredForNineHoursTwo[6])}
        }
      }
      this.oldtempScheduleDataStoredForNineHoursTwo= [this.addScheduleDataFormForNineHours.controls.Sun2.value,this.addScheduleDataFormForNineHours.controls.Mon2.value,this.addScheduleDataFormForNineHours.controls.Tue2.value,this.addScheduleDataFormForNineHours.controls.Wed2.value,this.addScheduleDataFormForNineHours.controls.Thu2.value,this.addScheduleDataFormForNineHours.controls.Fri2.value,this.addScheduleDataFormForNineHours.controls.Sat2.value];
        this.oldtempScheduleDataStoredForNineHoursOne= [this.addScheduleDataFormForNineHours.controls.Sun1.value,this.addScheduleDataFormForNineHours.controls.Mon1.value,this.addScheduleDataFormForNineHours.controls.Tue1.value,this.addScheduleDataFormForNineHours.controls.Wed1.value,this.addScheduleDataFormForNineHours.controls.Thu1.value,this.addScheduleDataFormForNineHours.controls.Fri1.value,this.addScheduleDataFormForNineHours.controls.Sat1.value];
      if(checkAddNew==true){
        if(this.checkUserAccess==true){
          const modal = await this.modalCtrl.create({
            component: CreateNewShiftDefintionPage,
            componentProps: { shift_duration:this.selected_shift_duration },
            cssClass: 'AddNewShiftDefintion',
            swipeToClose:true
          });
          modal.onDidDismiss().then(async ()=>{
            if(this.selected_shift_duration==9){
              await this.updateLocalShiftData();
              this.addScheduleDataFormForNineHours = this.formBuilder.group({
                id:[this.scheduleData.id],
                Mon1: [this.tempScheduleDataStoredForNineHoursOne[1]],
                Tue1:[this.tempScheduleDataStoredForNineHoursOne[2]],
                Wed1: [this.tempScheduleDataStoredForNineHoursOne[3]],
                Thu1: [this.tempScheduleDataStoredForNineHoursOne[4]],
                Fri1: [this.tempScheduleDataStoredForNineHoursOne[5]],
                Sat1: [this.tempScheduleDataStoredForNineHoursOne[6]],
                Sun1: [this.tempScheduleDataStoredForNineHoursOne[0]],
                Mon2: [this.tempScheduleDataStoredForNineHoursTwo[1]],
                Tue2:[this.tempScheduleDataStoredForNineHoursTwo[2]],
                Wed2: [this.tempScheduleDataStoredForNineHoursTwo[3]],
                Thu2: [this.tempScheduleDataStoredForNineHoursTwo[4]],
                Fri2: [this.tempScheduleDataStoredForNineHoursTwo[5]],
                Sat2: [this.tempScheduleDataStoredForNineHoursTwo[6]],
                Sun2: [this.tempScheduleDataStoredForNineHoursTwo[0]],
                Pattern:[''],
                // Pattern:[this.da1[8]],
                BMLRule: [this.valid],
                SL:[this.scheduleData.SL]

              })
              this.businessRuleValidationForNineHours()
            }else{
              this.ngOnInit()
            }
            })

          return await modal.present();
        }else{
          const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: "Sorry, you don't have access to create a new shift! Please upgrade your plan.",
            buttons: ['OK']
          });

          await alert.present();
        }
      }else{
          this.businessRuleValidationForNineHours()
        }
    }
    businessRuleValidationForNineHours(){
      var countOne=0,count=0
      for(var j=0;j<this.tempScheduleDataStoredForNineHoursOne.length;j++){
        if(this.tempScheduleDataStoredForNineHoursOne[j]=='X'){
          countOne++
        }
      }
      for(var j=0;j<this.tempScheduleDataStoredForNineHoursTwo.length;j++){
        if(this.tempScheduleDataStoredForNineHoursTwo[j]=='X'){
          count++
        }
      }

        this.work_Pattern=''
        var tempBLRuleArray=[]


        for(var j=0;j<this.tempScheduleDataStoredForNineHoursOne.length;j++){
          if(this.tempScheduleDataStoredForNineHoursOne[j]=='X'){
            tempBLRuleArray.push({"sd":'X',"sdu":'X',"id":j})
          }else{
          for(var k=0;k<this.allShiftName.length;k++){
            if(this.tempScheduleDataStoredForNineHoursOne[j]==this.allShiftName[k].shiftData){

              tempBLRuleArray.push({"sd":this.allShiftName[k].shift_StartTime,"sdu":this.allShiftName[k].shift_duration,"id":j})
              this.work_Pattern=this.work_Pattern+this.allShiftName[k].shiftCategory
            }
          }
        }
        }
        for(var j=0;j<this.tempScheduleDataStoredForNineHoursTwo.length;j++){
          if(this.tempScheduleDataStoredForNineHoursTwo[j]=='X'){
            tempBLRuleArray.push({"sd":'X',"sdu":'X',"id":(j+ + +this.tempScheduleDataStoredForNineHoursOne.length)})
          }else{
          for(var k=0;k<this.allShiftName.length;k++){
            if(this.tempScheduleDataStoredForNineHoursTwo[j]==this.allShiftName[k].shiftData){
              this.work_Pattern=this.work_Pattern+this.allShiftName[k].shiftCategory
              tempBLRuleArray.push({"sd":this.allShiftName[k].shift_StartTime,"sdu":this.allShiftName[k].shift_duration,"id":j+ ++this.tempScheduleDataStoredForNineHoursOne.length})
            }
          }
        }
      }


        var right_text = this.work_Pattern.substring(14, this.work_Pattern.indexOf("X"),this.work_Pattern.indexOf("X"));
        var left_text = this.work_Pattern.substring(0, this.work_Pattern.indexOf("X"),this.work_Pattern.indexOf("X"));
        this.convertStringToCharLeft=Array.from(left_text)
        this.convertStringToCharRight=Array.from(right_text)
        this.patternRight=''
        this.patternLeft=''
        for(var i=0;i<this.convertStringToCharRight.length;i++){
          if(this.convertStringToCharRight[i]!=='X'){
            this.patternRight=this.patternRight+this.convertStringToCharRight[i]
          }
        }
        for(var i=0;i<this.convertStringToCharLeft.length;i++){
          if(this.convertStringToCharLeft[i]!=='X'){
            this.patternLeft=this.patternLeft+this.convertStringToCharLeft[i]
          }
        }
        this.work_Pattern=this.patternRight+this.patternLeft
        this.workPattern=''
        this.convertStringToCharLeft=Array.from(this.work_Pattern)

        for(var i=0;i<this.convertStringToCharLeft.length;i++){
          if(this.convertStringToCharLeft[i]=='1'||this.convertStringToCharLeft[i]==1){
            this.workPattern=this.workPattern+'M'
          }
          else if(this.convertStringToCharLeft[i]=='2'||this.convertStringToCharLeft[i]==2){
            this.workPattern=this.workPattern+'E'
          }
          else if(this.convertStringToCharLeft[i]=='3'||this.convertStringToCharLeft[i]==3){
            this.workPattern=this.workPattern+'D'
          }
          else if(this.convertStringToCharLeft[i]=='4'||this.convertStringToCharLeft[i]==4 || this.convertStringToCharLeft[i]=='5'||this.convertStringToCharLeft[i]==5 || this.convertStringToCharLeft[i]=='6'||this.convertStringToCharLeft[i]==6){
            this.workPattern=this.workPattern+'S'
          }
        }
        this.work_Pattern=this.workPattern

          this.hrs=0
          for(var j=0;j<this.tempScheduleDataStoredForNineHoursOne.length;j++){
            if(this.tempScheduleDataStoredForNineHoursOne[j]!='X' && this.tempScheduleDataStoredForNineHoursOne[j]!=undefined){
              this.hrs=this.hrs+ + +Number(this.tempScheduleDataStoredForNineHoursOne[j].split('-')[1])
            }
          }
          for(var j=0;j<this.tempScheduleDataStoredForNineHoursTwo.length;j++){
            if(this.tempScheduleDataStoredForNineHoursTwo[j]!='X' && this.tempScheduleDataStoredForNineHoursTwo[j]!=undefined){
              this.hrs=this.hrs+ + +Number(this.tempScheduleDataStoredForNineHoursTwo[j].split('-')[1])
            }
          }
          tempBLRuleArray=tempBLRuleArray.sort((a,b)=>{return a.id-b.id})
          this.shift_line={
            "SUN": {"shift":tempBLRuleArray[0].sd, "length": tempBLRuleArray[0].sdu},
            "MON": {"shift":tempBLRuleArray[1].sd, "length": tempBLRuleArray[1].sdu},
            "TUE": {"shift":tempBLRuleArray[2].sd, "length": tempBLRuleArray[2].sdu},
            "WED": {"shift":tempBLRuleArray[3].sd, "length": tempBLRuleArray[3].sdu},
            "THU": {"shift":tempBLRuleArray[4].sd, "length": tempBLRuleArray[4].sdu},
            "FRI": {"shift":tempBLRuleArray[5].sd, "length": tempBLRuleArray[5].sdu},
            "SAT": {"shift":tempBLRuleArray[6].sd, "length": tempBLRuleArray[6].sdu},
            "SUN2": {"shift":tempBLRuleArray[7].sd, "length": tempBLRuleArray[7].sdu},
            "MON2": {"shift":tempBLRuleArray[8].sd, "length": tempBLRuleArray[8].sdu},
            "TUE2": {"shift":tempBLRuleArray[9].sd, "length": tempBLRuleArray[9].sdu},
            "WED2": {"shift":tempBLRuleArray[10].sd, "length": tempBLRuleArray[10].sdu},
            "THU2": {"shift":tempBLRuleArray[11].sd, "length": tempBLRuleArray[11].sdu},
            "FRI2": {"shift":tempBLRuleArray[12].sd, "length": tempBLRuleArray[12].sdu},
            "SAT2": {"shift":tempBLRuleArray[13].sd, "length": tempBLRuleArray[13].sdu},
        }
        if(this.hrs==80){

          this.busniessRulesValidation.businessRulesCheckForHybridShiftLines(this.shift_line).subscribe(
             (res)=>{

              var tempRes,tempObj,tempArr=[]
              tempRes=res
              this.valid=tempRes.business_rules
              for(var j=0;j<tempBLRuleArray.length;j++){
                if(tempBLRuleArray[j]!=undefined && tempBLRuleArray[j].sd!=undefined&& tempBLRuleArray[j].sd!=null&&tempBLRuleArray[j].sd!='X'){
                    tempArr.push(tempBLRuleArray[j].sd)
                  }else{
                    tempArr.push('X')
                 }
               }
               var tempObj
               tempObj={
                  "shift_line": tempArr,
               }

                 this.disableAddButton=false

            },
          (error: any)=>{
            this.disableAddButton=true
            this.errorMsg=error;console.log(this.errorMsg)},
           () => {
          }

          );
        }
          if((countOne==2 && count==3) ||(countOne==3 && count==2) ){

       }
    }
}
export function someFunction(){

}


















