import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';

import { WorkLoadService } from 'src/app//services/work-load.service';
import data222 from 'src/app//json/work-load-data.json';
import { ScheduleDataService } from 'src/app/services/schedule-data.service';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { HeaderTitleForModalPageService } from 'src/app/dashboard/nav-bar-footer/header-title-for-modal-page.service';
import { CreateNewShiftDefintionPage } from 'src/app/dashboard/work_load_data/create-new-shift-defintion/create-new-shift-defintion.page';
import { RequiredWorkforceService } from 'src/app/services/required-workforce.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-add-new-shift-line',
  templateUrl: './add-new-shift-line.page.html',
  styleUrls: ['./add-new-shift-line.page.scss'],
})
export class AddNewShiftLinePage implements OnInit {
  selected_shift_duration=8
  selected_shiftline_schedule_duration=8
  workShiftLine=[] as any;
  resultShiftLine=[] as any
  finalResultShiftLine=[]as any
  scheduleDataId: any;
  scheduleData: any;
  errorMsg: any;
  scheduleDataSunSat: any;
  // workLoadData: any;
da1=[] as any
  wDataThree: any;
  wDataTwelve: any;
  wDataOne: any;
  wDataTwo: any;
  wDataFour: any;
  wDataElevenNight: any;
  wDataEleven: any;
  hrs=40
  wDataTen: any;
  wDataNine: any;
  wDataEight: any;
  wDataSeven: any;
  wDataSix: any;
  wDataFive: any;
  ishidden = false;
  x
  checkUserAccess=false
  status: boolean = true;
  editScheduleDataForm: FormGroup;
workPattern
  public HideId: boolean = false;
  public showHideText: boolean = false;
  editData: any;
   exampleArray = []
  valid: any =false;
  tempScheduleDataStored: any[];
  data1: any[];
  gapBetweenshift: any;
  da: any[];
  static urlArray;
  workD: any;
  scheduleShiftLine: any;
  scheduleLData: any;
  workLoadData: any=data222;
  testing: any[];
  static data5;
  data2: any;
  pattern
  work_Pattern: any;
  disableAddButton=true
  dat1: any;
  addScheduleDataFormForNineHours:FormGroup
  addScheduleDataForm: FormGroup;
  shiftLine: any;
  shift_line_name
  newId: any;
  convertStringToCharLeft
  convertStringToCharRight
  patternRight
  patternLeft
  allShiftName=[] as any
  allShiftData
  temp
  shift_line
  shift_length
  schedule_id
  edit_schedule_id: any;
  all_Schedule: any;
  edit_schedule: any;
  shiftCategoryName = [
    'MID', 'EVE', 'DAY', 'M/D', 'D/E', 'E/M'
  ];
  user_data: any;
  days = [
    { name: 'Sun', shortName: 'Sun' },
    { name: 'Mon', shortName: 'Mon' },
    { name: 'Tue', shortName: 'Tue' },
    { name: 'Wed', shortName: 'Wed' },
    { name: 'Thu', shortName: 'Thu' },
    { name: 'Fri', shortName: 'Fri' },
    { name: 'Sat', shortName: 'Sat' },
  ];
  
  // workloadData=data222
  constructor(private route: Router,
    public workLoadDataService: WorkLoadService,
    public busniessRulesValidation: BusinessRulesValidationService,
    public dataService: ScheduleDataService,
    public requiredWorkforceSer: RequiredWorkforceService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public viewCtrl: ModalController,
    private localData: LocalDataService,
    private headerTitleService: HeaderTitleForModalPageService,
    public formBuilder: FormBuilder
  ) {
    this.schedule_id = navParams.get('schedule_id')
    this.edit_schedule = navParams.get('edit_schedule')
    this.addScheduleDataFormForNineHours = new FormGroup({
      id: new FormControl,
      Mon1: new FormControl,
      Tue1: new FormControl,
      Wed1: new FormControl,
      Thu1: new FormControl,
      Fri1: new FormControl,
      Sat1: new FormControl,
      Sun1: new FormControl,
      Mon2: new FormControl,
      Tue2: new FormControl,
      Wed2: new FormControl,
      Thu2: new FormControl,
      Fri2: new FormControl,
      Sat2: new FormControl,
      Sun2: new FormControl,
      Pattern: new FormControl,
      // Pattern:[this.da1[8]],
      BMLRule: new FormControl,
      SL: new FormControl,
    });
    this.addScheduleDataForm = new FormGroup({
      id:new FormControl,
      Mon: new FormControl,
      Tue:new FormControl,
      Wed: new FormControl,
      Thu:new FormControl,
      Fri:new FormControl,
      Sat: new FormControl,
      Sun: new FormControl,
      Pattern:new FormControl,
      SL:new FormControl
    })
  }
  ngOnInit() {
    if(sessionStorage.getItem('token')!=undefined){
      this.checkUserAccess=true
    }else{
     this.checkUserAccess=false
    }
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.headerTitleService.setTitle('Add New Shift Line');
    this.updateLocalShiftData();
    if(this.edit_schedule=='edit_schedule'){
      this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
      this.scheduleShiftLine=JSON.parse(this.localData.getItem('editCustomizedScheduleShiftLine'))
      this.selected_shiftline_schedule_duration=Number(this.scheduleShiftLine[0].shiftdurationp)
    }else{
        this.scheduleShiftLine=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
        this.scheduleShiftLine=this.scheduleShiftLine[this.schedule_id]
        this.selected_shiftline_schedule_duration=Number(this.scheduleShiftLine[0].shiftdurationp)
        this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
        this.workLoadData=this.allShiftData
    }
    if(this.edit_schedule==='edit_schedule'){
    this.newId=Number(this.scheduleShiftLine[(this.scheduleShiftLine.length)+ - +1].seq_id)+ + +1
    }else{
      this.newId=Number(this.scheduleShiftLine[(this.scheduleShiftLine.length)+ - +1].id)+ + +1
    }
    this.hrs=0

    this.addScheduleDataForm = this.formBuilder.group({
      id:[this.newId],
      Mon: ['X'],
      Tue:['X'],
      Wed: ['X'],
      Thu: ['X'],
      Fri: ['X'],
      Sat: ['X'],
      Sun: ['X'],
      Pattern:[''],
      SL:['']

    })
    return  this.wDataOne,this.wDataTwo,this.wDataThree,this.wDataFour,this.wDataFive,this.wDataSix,this.wDataSeven,this.wDataEight,this.wDataNine,this.wDataTen,this.wDataEleven,this.wDataElevenNight, this.wDataTwelve

  }

 async segmentChanged(event){
    this.selected_shift_duration=Number(event.detail.value)
    this.disableAddButton=true
    this.valid=false
    if(this.selected_shift_duration==9){
    await  this.ngOnInitForNineHours()
    }else{
      this.ngOnInit()
    }

    }
    oldtempScheduleDataStoredForNineHoursOne=['X','X','X','X','X','X','X']
    oldtempScheduleDataStoredForNineHoursTwo=['X','X','X','X','X','X','X']
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
      if(checkAddNew==true){
        if(this.checkUserAccess==true){
          const modal = await this.modalCtrl.create({
            component: CreateNewShiftDefintionPage,
            componentProps: { shift_duration:this.selected_shift_duration },
            cssClass: 'AddNewShiftDefintion',
            swipeToClose:true
          });
          modal.onDidDismiss().then(async ()=>{
            if (this.selected_shift_duration == 9) {
              await this.updateLocalShiftData();
              this.tempScheduleDataStoredForNineHoursTwo= [this.addScheduleDataFormForNineHours.controls.Sun2.value,this.addScheduleDataFormForNineHours.controls.Mon2.value,this.addScheduleDataFormForNineHours.controls.Tue2.value,this.addScheduleDataFormForNineHours.controls.Wed2.value,this.addScheduleDataFormForNineHours.controls.Thu2.value,this.addScheduleDataFormForNineHours.controls.Fri2.value,this.addScheduleDataFormForNineHours.controls.Sat2.value];
              this.tempScheduleDataStoredForNineHoursOne= [this.addScheduleDataFormForNineHours.controls.Sun1.value,this.addScheduleDataFormForNineHours.controls.Mon1.value,this.addScheduleDataFormForNineHours.controls.Tue1.value,this.addScheduleDataFormForNineHours.controls.Wed1.value,this.addScheduleDataFormForNineHours.controls.Thu1.value,this.addScheduleDataFormForNineHours.controls.Fri1.value,this.addScheduleDataFormForNineHours.controls.Sat1.value];
              this.addScheduleDataFormForNineHours = this.formBuilder.group({
                id:[this.newId],
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
                SL:['']

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
        if(this.selected_shift_duration==9){

          this.businessRuleValidationForNineHours()
        }
        else if(this.selected_shift_duration==10){
          this.businessRuleValidation()
        }
        else{

          this.businessRuleValidation()
        }

      }
    }
    oldValue=['X','X','X','X','X','X','X']
    async checkAddNewShiftDefintion(){
      this.tempScheduleDataStored =  [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];
      var checkAddNew=false
      var count
      for(var j=0;j<this.tempScheduleDataStored.length;j++){
        if(this.tempScheduleDataStored[j]=='add'){
          checkAddNew=true
          if(j==0){this.addScheduleDataForm.controls.Sun.setValue(this.oldValue[0])}
          else if(j==1){this.addScheduleDataForm.controls.Mon.setValue(this.oldValue[1])}
          else if(j==2){this.addScheduleDataForm.controls.Tue.setValue(this.oldValue[2])}
          else if(j==3){this.addScheduleDataForm.controls.Wed.setValue(this.oldValue[3])}
          else if(j==4){this.addScheduleDataForm.controls.Thu.setValue(this.oldValue[4])}
          else if(j==5){this.addScheduleDataForm.controls.Fri.setValue(this.oldValue[5])}
          else if(j==6){this.addScheduleDataForm.controls.Sat.setValue(this.oldValue[6])}
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
          modal.onDidDismiss().then(() => {
            if(this.selected_shift_duration==9){
              this.updateShiftDefintionData()
            }else{
              this.updateShiftDefintionData()

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
        if(this.selected_shift_duration==9){
          this.businessRuleValidationForNineHours()
        }else{
          this.businessRuleValidation()
        }

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

    if (this.selected_shift_duration == 9) {
      all_defined_shifts = all_defined_shifts.sort((a, b) => a.shift_duration - b.shift_duration)
    }
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
  async updateShiftDefintionData() {
    await this.updateLocalShiftData();
  }
  tempScheduleDataStoredForNineHoursOne=[]
  tempScheduleDataStoredForNineHoursTwo=[]
 businessRuleValidation(){
  var count=0
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
    this.addScheduleDataForm = this.formBuilder.group({
      id:[this.newId],
      Mon: [this.Mon.value],
      Tue:[this.Tue.value],
      Wed: [this.Wed.value],
      Thu: [this.Thu.value],
      Fri: [this.Fri.value],
      Sat: [this.Sat.value],
      Sun: [this.Sun.value],
      Pattern:[this.work_Pattern],
      SL:[this.shiftLine]
    })
    if(Number(this.selected_shift_duration)==8){
    if(count==2){
      this.nextValidation()
    }else{
      this.disableAddButton=true
    }
    }else{
      if(Number(this.selected_shift_duration)==10){
        if(count==3){
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
      async (response)=>{
        this.valid=response['business_rules']
        var tempArr=[],checkRDO='X'
        for(var j=0;j<this.tempScheduleDataStored.length;j++){
          if(this.tempScheduleDataStored[j]!='X'){
           for(var k=0;k<this.allShiftName.length;k++){
             if(this.tempScheduleDataStored[j]==this.allShiftName[k].shiftData){
              tempArr.push(this.allShiftName[k].shift_StartTime)
             }
            }
            }else{
              tempArr.push('X')
           }
         }
         var tempObj
         tempObj={
            "shift_line": tempArr,
         }
        this.requiredWorkforceSer.checkShiftlineName(tempObj).subscribe((res)=>{

        var temp
        temp=res
        if(temp.shift_line_name){
          this.disableAddButton=false

        }else{
          this.disableAddButton=true
        }
        this.shiftLine=temp.shift_line_name
        this.addScheduleDataForm = this.formBuilder.group({
          id:[this.newId],
          Mon: [this.Mon.value],
          Tue:[this.Tue.value],
          Wed: [this.Wed.value],
          Thu: [this.Thu.value],
          Fri: [this.Fri.value],
          Sat: [this.Sat.value],
          Sun: [this.Sun.value],
          Pattern:[this.work_Pattern],
          SL:[this.shiftLine]
        })
        },(err)=>{
          this.disableAddButton=true
          console.log(err)},()=>{})
    },
    (error: any)=>{
      this.disableAddButton=true
      this.errorMsg=error;console.log(this.errorMsg)},
    async () => {
    }
    );
}
get Mon(){
  return this.addScheduleDataForm.get('Mon')
}

get Tue(){
  return this.addScheduleDataForm.get('Tue')
}
get Wed(){
  return this.addScheduleDataForm.get('Wed')
}
get Thu(){
  return this.addScheduleDataForm.get('Thu')
}
get Fri(){
  return this.addScheduleDataForm.get('Fri')
}
get Sat(){
  return this.addScheduleDataForm.get('Sat')
}
get Sun(){
  return this.addScheduleDataForm.get('Sun')
}
get Mon1(){
  return this.addScheduleDataForm.get('Mon1')
}

get Tue1(){
  return this.addScheduleDataForm.get('Tue1')
}
get Wed1(){
  return this.addScheduleDataForm.get('Wed1')
}
get Thu1(){
  return this.addScheduleDataForm.get('Thu1')
}
get Fri1(){
  return this.addScheduleDataForm.get('Fri1')
}
get Sat1(){
  return this.addScheduleDataForm.get('Sat1')
}
get Sun1(){
  return this.addScheduleDataForm.get('Sun1')
}
get Mon2(){
  return this.addScheduleDataForm.get('Mon2')
}

get Tue2(){
  return this.addScheduleDataForm.get('Tue2')
}
get Wed2(){
  return this.addScheduleDataForm.get('Wed2')
}
get Thu2(){
  return this.addScheduleDataForm.get('Thu2')
}
get Fri2(){
  return this.addScheduleDataForm.get('Fri2')
}
get Sat2(){
  return this.addScheduleDataForm.get('Sat2')
}
get Sun2(){
  return this.addScheduleDataForm.get('Sun2')
}
get Pattern(){
  return this.addScheduleDataForm.get('Pattern')
}

checkID(sl){
  var scheduleShift=this.scheduleShiftLine
  var tempArr=[]

  for(var i=0; i<=scheduleShift.length;i++)
  {
    if(scheduleShift[i] !=undefined){
      if(scheduleShift[i]?.SL  == sl || scheduleShift[i]?.SL  == (sl+'-A')){
      tempArr.push(Number(scheduleShift[i]?.seq))
      }
    }
  }

tempArr=tempArr.sort((a,b)=>{return b - a})
  // var newid=tempArr.indexOf(id)
  if(tempArr.length>0){
    return   tempArr[0]
  }else{
    return   1
  }


}
  async addNewShiftLine(){
          var addNewShiftLineData=this.addScheduleDataForm.value
            if(this.edit_schedule==='edit_schedule'){
              var  tempObj

              if(Number(this.selected_shift_duration)==9){
                this.tempScheduleDataStoredForNineHoursTwo= [this.addScheduleDataFormForNineHours.controls.Sun2.value,this.addScheduleDataFormForNineHours.controls.Mon2.value,this.addScheduleDataFormForNineHours.controls.Tue2.value,this.addScheduleDataFormForNineHours.controls.Wed2.value,this.addScheduleDataFormForNineHours.controls.Thu2.value,this.addScheduleDataFormForNineHours.controls.Fri2.value,this.addScheduleDataFormForNineHours.controls.Sat2.value];
                this.tempScheduleDataStoredForNineHoursOne= [this.addScheduleDataFormForNineHours.controls.Sun1.value,this.addScheduleDataFormForNineHours.controls.Mon1.value,this.addScheduleDataFormForNineHours.controls.Tue1.value,this.addScheduleDataFormForNineHours.controls.Wed1.value,this.addScheduleDataFormForNineHours.controls.Thu1.value,this.addScheduleDataFormForNineHours.controls.Fri1.value,this.addScheduleDataFormForNineHours.controls.Sat1.value];
                tempObj={
                  "id":null,
                  "seq_id":this.addScheduleDataFormForNineHours.controls.id.value,
                  "Mon":this.addScheduleDataFormForNineHours.controls.Mon1.value,
                  "Tue":this.addScheduleDataFormForNineHours.controls.Tue1.value,
                  "Wed": this.addScheduleDataFormForNineHours.controls.Wed1.value,
                  "Thu": this.addScheduleDataFormForNineHours.controls.Thu1.value,
                  "Fri": this.addScheduleDataFormForNineHours.controls.Fri1.value,
                  "Sat": this.addScheduleDataFormForNineHours.controls.Sat1.value,
                  "shiftdurationp":this.selected_shiftline_schedule_duration,
                  "Sun": this.addScheduleDataFormForNineHours.controls.Sun1.value,
                  "Monshift2":this.addScheduleDataFormForNineHours.controls.Mon2.value,
                  "Tueshift2":this.addScheduleDataFormForNineHours.controls.Tue2.value,
                  "Wedshift2": this.addScheduleDataFormForNineHours.controls.Wed2.value,
                  "Thushift2": this.addScheduleDataFormForNineHours.controls.Thu2.value,
                  "Frishift2": this.addScheduleDataFormForNineHours.controls.Fri2.value,
                  "Satshift2": this.addScheduleDataFormForNineHours.controls.Sat2.value,
                  "Sunshift2": this.addScheduleDataFormForNineHours.controls.Sun2.value,
                  "BMLRule":this.valid,
                  "SL": 'NC-A',
                  "seq":this.checkID('NC-A')+1,
                  "shiftdurationc":Number(this.selected_shift_duration),
                  "Pattern":this.work_Pattern,
                  "userid": this.scheduleShiftLine[0].userid
                }

              } else{
                
                 tempObj={
                  "id":null,

                  "schedule_id": this.scheduleShiftLine[0].schedule_id,
                  "seq_id":addNewShiftLineData.id,
                  "Mon":addNewShiftLineData.Mon.split('-')[0],
                  "Tue": addNewShiftLineData.Tue.split('-')[0],
                  "Wed": addNewShiftLineData.Wed.split('-')[0],
                  "Thu": addNewShiftLineData.Thu.split('-')[0],
                  "Fri": addNewShiftLineData.Fri.split('-')[0],
                  "Sat": addNewShiftLineData.Sat.split('-')[0],
                  "Sun": addNewShiftLineData.Sun.split('-')[0],
                  "BMLRule":this.valid,
                  "shiftdurationp":this.selected_shiftline_schedule_duration,
                  "schedulename": this.scheduleShiftLine[0].schedulename,
                  "SL": addNewShiftLineData.SL+'-A',
                  "seq":this.checkID(addNewShiftLineData.SL) +1,
                  "shiftdurationc":Number(this.selected_shift_duration),
                  "areaid": this.scheduleShiftLine[0].areaid,
                  "Pattern":addNewShiftLineData.Pattern,
                  "userid": this.scheduleShiftLine[0].userid
                }
              }
              this.scheduleShiftLine.push(tempObj)
              this.localData.setItem('editCustomizedScheduleShiftLine',JSON.stringify(this.scheduleShiftLine))
              this.localData.setItem('hideBLrulesLabels',JSON.stringify({"hideBLrulesLabels":true}))
              this.modalCtrl.dismiss();
              const alert = await this.alertCtrl.create({
                cssClass: 'my-custom-class',
                header: 'Alert',
                message: "Successfully added!!!",
                buttons: ['OK']
              });
              await alert.present();
            }else{
              var  tempObjNew,getDefaultShiftlineScheduleDuration

              getDefaultShiftlineScheduleDuration

              if(Number(this.selected_shift_duration)==9){
                this.tempScheduleDataStoredForNineHoursTwo= [this.addScheduleDataFormForNineHours.controls.Sun2.value,this.addScheduleDataFormForNineHours.controls.Mon2.value,this.addScheduleDataFormForNineHours.controls.Tue2.value,this.addScheduleDataFormForNineHours.controls.Wed2.value,this.addScheduleDataFormForNineHours.controls.Thu2.value,this.addScheduleDataFormForNineHours.controls.Fri2.value,this.addScheduleDataFormForNineHours.controls.Sat2.value];
                this.tempScheduleDataStoredForNineHoursOne= [this.addScheduleDataFormForNineHours.controls.Sun1.value,this.addScheduleDataFormForNineHours.controls.Mon1.value,this.addScheduleDataFormForNineHours.controls.Tue1.value,this.addScheduleDataFormForNineHours.controls.Wed1.value,this.addScheduleDataFormForNineHours.controls.Thu1.value,this.addScheduleDataFormForNineHours.controls.Fri1.value,this.addScheduleDataFormForNineHours.controls.Sat1.value];
                tempObjNew={
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
                  "SL": this.shift_line_name+'-A',
                  "shiftdurationp":this.selected_shiftline_schedule_duration,
                  "BMLRule":this.valid,
                  "seq":this.checkID(this.shift_line_name+'-A')+ - +1,
                  "shiftdurationc":Number(this.selected_shift_duration),
                  "Pattern":this.work_Pattern,
                }

              } else{
              tempObjNew={
                    "id":addNewShiftLineData.id,
                    "Mon":addNewShiftLineData.Mon.split('-')[0],
                    "Tue": addNewShiftLineData.Tue.split('-')[0],
                    "Wed": addNewShiftLineData.Wed.split('-')[0],
                    "Thu": addNewShiftLineData.Thu.split('-')[0],
                    "Fri": addNewShiftLineData.Fri.split('-')[0],
                    "Sat": addNewShiftLineData.Sat.split('-')[0],
                    "Sun": addNewShiftLineData.Sun.split('-')[0],
                    "SL": addNewShiftLineData.SL+'-A',
                    "shiftdurationp":this.selected_shiftline_schedule_duration,
                    "BMLRule":this.valid,
                    "seq":this.checkID(addNewShiftLineData.SL),
                    "shiftdurationc":Number(this.selected_shift_duration),
                    "Pattern":addNewShiftLineData.Pattern,
                }
              }
              this.scheduleShiftLine.push(tempObjNew)
              var current_customized_schedule=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
              var temp_schedule=[],after_add_new_shift_line=[]

              for(var i=0;i<current_customized_schedule.length;i++){
                if(i==Number(this.schedule_id)){
                  temp_schedule=this.scheduleShiftLine
                }else{
                  temp_schedule=current_customized_schedule[i]
                }
                after_add_new_shift_line.push(temp_schedule)
              }
                  this.localData.removeItem('customizedScheduleShiftLine')
                  this.localData.setItem('focusShiftLine',JSON.stringify({"shift_line":addNewShiftLineData,"schedule_id":this.schedule_id}))
                  this.localData.setItem('customizedScheduleShiftLine',JSON.stringify(after_add_new_shift_line))
                  this.localData.setItem('hideBLrulesLabels',JSON.stringify({"hideBLrulesLabels":true}))
                  // location.reload()
                  this.modalCtrl.dismiss();
                  const alert = await this.alertCtrl.create({
                    cssClass: 'my-custom-class',
                    header: 'Alert',
                    message: "Successfully added!!!",
                    buttons: ['OK']
                  });
                  await alert.present();
              }

  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  showHide(){
    this.showHideText = !this.showHideText;
  }
  reset(){
    this.hrs=0
    this.valid=false
    this.disableAddButton=true
    if(Number(this.selected_shift_duration)==9){

      this.selected_shift_duration=9
    this.work_Pattern=''
    this.addScheduleDataFormForNineHours = this.formBuilder.group({
      id:[this.newId],
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
      SL:['']

    })
    }else{
      this.work_Pattern=''
      this.addScheduleDataForm = this.formBuilder.group({
        id:[],
        Mon: ['X'],
        Tue:['X'],
        Wed: ['X'],
        Thu: ['X'],
        Fri: ['X'],
        Sat: ['X'],
        Sun: ['X'],
        Pattern:[''],
        SL:['']
      })
    }
  }
  async ngOnInitForNineHours(){
    this.headerTitleService.setTitle('Add New Shift Line');
    await this.updateLocalShiftData();
    if(this.edit_schedule=='edit_schedule'){
      this.allShiftData = JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
      this.scheduleShiftLine=JSON.parse(this.localData.getItem('editCustomizedScheduleShiftLine'))
    }else{
        this.scheduleShiftLine=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
        this.scheduleShiftLine=this.scheduleShiftLine[this.schedule_id]
        this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
        this.workLoadData=this.allShiftData
    }
    
    if(this.edit_schedule==='edit_schedule'){
    this.newId=Number(this.scheduleShiftLine[(this.scheduleShiftLine.length)+ - +1].seq_id)+ + +1
    }else{
      this.newId=Number(this.scheduleShiftLine[(this.scheduleShiftLine.length)+ - +1].id)+ + +1
    }
    this.hrs=0
    this.addScheduleDataFormForNineHours = this.formBuilder.group({
      id:[this.newId],
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
      SL:['']

    })
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
          this.shiftLine='NC-A'

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

               this.shift_line_name='NC'
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
          this.shift_line_name='NC'

     }
  }
}
