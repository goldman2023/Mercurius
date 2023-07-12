import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController, PopoverController, NavParams, NavController, ActionSheetController } from '@ionic/angular';
import { EditScheduleDataPage } from 'src/app/dashboard/generated_schedule/add-edit-shift-lines/edit-schedule-data/edit-schedule-data.page';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';


@Component({
  selector: 'app-schedule-one',
  templateUrl: './schedule-one.component.html',
  styleUrls: ['./schedule-one.component.scss'],
})
export class ScheduleOneComponent implements OnInit {

  hideSplitShiftMidDay=false
  hideSplitShiftDayEve=false
  hideSplitShiftEveMid=false
  scheduleShift: any []=[]
  afterdeleteShiftLines:any []=[]
  deleteShiftLines:any []=[]
  requiredEmpData:any
  generatedEmpData

  exportData=[] as any
  defscheduleShift: any;
  schedule_id
  shift: any;
  defRequiredData: any;
  defGeneratedData: any;
  customizeScheduleShiftLines=[] as any
  customizeShiftData: any;
  focusShiftLine
  allShiftData: any;
  allShiftName: any[];
  expand_shiftlineid
  constructor(public modalCtrl: ModalController,
              private route:Router,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,

              private router: ActivatedRoute,public navParams: NavParams,
              public navCtrl: NavController,
              private cdref: ChangeDetectorRef,
              public formBuilder: FormBuilder,
              private localData: LocalDataService,
              public busniessRulesValidation:BusinessRulesValidationService,
              public actionsheetCtrl: ActionSheetController,
              ) {
              this.router.queryParams.subscribe((res)=>{
                this.schedule_id=0
            });
          }


   ngOnInit() {
this.cdref.detectChanges()
this.exportData=[]
this.customizeShiftData=[]
     this.customizeScheduleShiftLines=[]
     this.defGeneratedData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.defRequiredData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.generatedEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.requiredEmpData=JSON.parse(this.localData.getItem('requiredEmpData'))
     this.scheduleShift=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
     this.defscheduleShift=JSON.parse(this.localData.getItem('defaultScheduleShiftLine'))
     this.focusShiftLine=JSON.parse(this.localData.getItem('focusShiftLine'))
     this.allShiftData=  JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))

if(this.focusShiftLine!=null || this.focusShiftLine!=undefined){

  if(this.focusShiftLine.schedule_id==0){
    this.focusShiftLine=this.focusShiftLine.shift_line.id
  }else{
    this.focusShiftLine=undefined
  }
}

    this.defscheduleShift=this.defscheduleShift[this.schedule_id]
    this.scheduleShift=this.scheduleShift[this.schedule_id]
    this.convertRDOtoShiftDefintion(3,8)

}
convertRDOtoShiftDefintion(rdo,shiftlength){
  if(String(rdo)=='X' || String(rdo)=='x'){
    return rdo
  }
  else{
    for(var i=0;i<this.allShiftData.length;i++){
      if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
        return String(this.allShiftData[i].startTime)
      }
    }

  }
}
   async removeItem(sd){

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
          handler: () => {

            let j = 0;
            this.afterdeleteShiftLines=[]
            this.deleteShiftLines=[]
        do {
        if( this.scheduleShift[j] == sd && this.scheduleShift[j].id==sd.id){
          // console.log(this.scheduleShift[j],sd,this.scheduleShift[j].id,sd.id)

            if(this.scheduleShift[j]?.Sun == 'X' && this.scheduleShift[j]?.Sat == 'X' &&this.scheduleShift[j]?.id == sd.id && this.scheduleShift[j] == sd){
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

          }
          this.afterdeleteShiftLines.push(this.scheduleShift[j])
          j++;
        }while(j < this.scheduleShift.length)
        // console.log(this.afterdeleteShiftLines)
        for(var i=0;i<this.afterdeleteShiftLines.length;i++){
          if(this.afterdeleteShiftLines[i]!=null){
            this.deleteShiftLines.push(this.afterdeleteShiftLines[i])
          }
        }


var current_customized_schedule=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
var temp_schedule,after_delete=[]

for(var i=0;i<current_customized_schedule.length;i++){
  if(i==0){
    temp_schedule=this.deleteShiftLines
  }else{
    temp_schedule=current_customized_schedule[i]
  }
  after_delete.push(temp_schedule)
}
        this.localData.removeItem('customizedScheduleShiftLine')
        this.localData.setItem('customizedScheduleShiftLine',JSON.stringify(after_delete))
        this.localData.setItem('focusShiftLine',JSON.stringify({"shift_line":'',"schedule_id":this.schedule_id}))
        location.reload()

        // this.ngOnInit();
              }
            }
          ]
        });
    await confirm.present();

}

async edit(scheduleShift) {

      const modal = await this.modalCtrl.create({
        component: EditScheduleDataPage,
        cssClass: 'editSchedule',
        componentProps: { scheduleData: scheduleShift ,schedule_id:this.schedule_id},
        swipeToClose:true
      })
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }

    expand(expandShiftlineId,selectedShiftline){
      if(this.expand_shiftlineid==expandShiftlineId){
        this.expand_shiftlineid=null
      }else{
        this.expand_shiftlineid=expandShiftlineId
        this.scheduleData=selectedShiftline
        this.editShiftline()
      }
      this.cdref.detectChanges()
      // this.expandlistSlide(selectedShiftline)
    }
    numberMargin(i,j){
      var temp
      temp=i+j

      if(Array.from(temp).length<4){
        return 'margin3'
      }
      else if(Array.from(temp).length<5){
        if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
          return 'margin41'
        }else{
          return 'margin4'
        }

      }
      else if(Array.from(temp).length<6){
        return 'margin5'
      }
      else if(Array.from(temp).length<7){
        // return 'margin6'
        if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
          return 'margin61'
        }else{
          return 'margin6'
        }
      }
      else{
        return 'margin7'
      }

    }

    expandlistSlide(i,j,l){
      var temp
      temp=i+j
      if((Number(this.focusShiftLine)+ + +1)==j){
        if(Array.from(temp).length<4){
          return 'expand3 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<5){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand41 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand4 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<6){
          return 'expand5 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<7){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand61 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand6 title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<8){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand7 ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand7 ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else{
          return 'default-expand title-background-color ion-text-center ion-no-padding ion-no-margin font-size'
        }
      }else{
        if(Array.from(temp).length<4){
          return 'expand3 ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<5){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand41 ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand4 ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<6){
          return 'expand5 ion-text-center ion-no-padding ion-no-margin font-size'
        }
        else if(Array.from(temp).length<7){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand61 ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand6 ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else if(Array.from(temp).length<8){
          if(Array.from(temp)[0]=='W' || Array.from(temp)[1]=='W' || Array.from(temp)[2]=='W'){
            return 'expand7 ion-text-center ion-no-padding ion-no-margin font-size'
          }else{
            return 'expand7 ion-text-center ion-no-padding ion-no-margin font-size'
          }
        }
        else{
          return 'default-expand ion-text-center ion-no-padding ion-no-margin font-size'
        }
      }
  }
  workShiftLine=[] as any;
  resultShiftLine=[] as any
  finalResultShiftLine=[]as any
  scheduleDataId: any;
  scheduleData: any;
  errorMsg: any;
  scheduleDataSunSat: any;
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
  testing: any[];
  static data5;
  data2: any;
  pattern
  work_Pattern: any;
  dat1: any;
  workPattern
  workPatternResult
  convertStringToCharLeft
  workLoadData
  convertStringToCharRight
  patternLeft
  patternRight
  shift_Pattern
  hrs
  shift_line: {};
  temp: any;
  editShiftline(){
    let countValueOfX=0
    let countValueOfM=0
    this.da =[this.scheduleData.id,String(this.scheduleData.Sun),String(this.scheduleData.Mon),String(this.scheduleData.Tue),String(this.scheduleData.Wed),String(this.scheduleData.Thu),String(this.scheduleData.Fri),String(this.scheduleData.Sat),String(this.scheduleData.Pattern),this.scheduleData.SL]
    this.tempScheduleDataStored = [String(this.scheduleData.Sun),String(this.scheduleData.Mon),String(this.scheduleData.Tue),String(this.scheduleData.Wed),String(this.scheduleData.Thu),String(this.scheduleData.Fri),String(this.scheduleData.Sat)]
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
      if(this.scheduleData.Sun ===  "M" && this.scheduleData.Mon === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Mon ===  "M" && this.scheduleData.Tue === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Tue ===  "M" && this.scheduleData.Wed === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Wed ===  "M" && this.scheduleData.Thu === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Thu ===  "M" && this.scheduleData.Fri === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Fri ===  "M" && this.scheduleData.Sat === "6" ){
        this.gapBetweenshift=false
      }
      else if(this.scheduleData.Sat ===  "M" && this.scheduleData.Sun === "6" ){
        this.gapBetweenshift=false
      }
      else{
        this.gapBetweenshift=true
      }

    this.allShiftData=  JSON.parse(this.localData.getItem('allShiftRequiredData'))
this.data2=JSON.parse(this.localData.getItem('workData'))

this.workLoadData=this.data2
console.log(this.workLoadData)
this.allShiftName=[]
for(var i=0;i<this.allShiftData.length;i++){
  // if(this.allShiftData[i].shift_duration==8){
  if(isNaN(this.allShiftData[i].shiftName)==false ){
    if(this.allShiftData[i].shiftCategory==1){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'MID',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==2){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'EVE',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==3){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'DAY',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==4){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'M/D',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==5){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'D/E',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==6){
      this.allShiftName.push({"shiftName":Number(this.allShiftData[i].shiftName),"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'E/M',"shift_duration":this.allShiftData[i].shift_duration})
    }
  }else{
    if(this.allShiftData[i].shiftCategory==1){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'MID',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==2){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'EVE',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==3){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'DAY',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==4){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'M/D',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==5){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'D/E',"shift_duration":this.allShiftData[i].shift_duration})
    }
    else if(this.allShiftData[i].shiftCategory==6){
      this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shift_StartTime":this.allShiftData[i].startTime,"shift_category_name":'E/M',"shift_duration":this.allShiftData[i].shift_duration})
    }
  }
  // }
}
    const test=[]

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
        "shift_length":8
    }

    this.busniessRulesValidation.businessRulesCheck(this.shift_line).subscribe(
      async (response)=>{
        this.valid=response['business_rules']
    },
    (error: any)=>{this.errorMsg=error;console.log(this.errorMsg)},
    async () => {
    }
    );
    this.scheduleShiftLine=JSON.parse(this.localData.getItem('customizedScheduleShiftLine'))
    this.scheduleShiftLine=this.scheduleShiftLine[this.schedule_id]
    this.data2=JSON.parse(this.localData.getItem('workData'))
    this.workLoadData=this.data2
    this.workPattern=this.da1[8]
    this.editScheduleDataForm = this.formBuilder.group({
      id:[this.scheduleData.id],
      Mon: [this.da1[2]],
      Tue:[this.da1[3]],
      Wed: [this.da1[4]],
      Thu: [this.da1[5]],
      Fri: [this.da1[6]],
      Sat: [this.da1[7]],
      Sun: [this.da1[1]],
      Pattern:[this.da1[8]],
      BMLRule: [this.valid],
      SL:[this.scheduleData.SL]

    })
    this.hrs=Number(Array.from(this.da1[8]).length*8);
    return  this.wDataOne,this.wDataTwo,this.wDataThree,this.wDataFour,this.wDataFive,this.wDataSix,this.wDataSeven,this.wDataEight,this.wDataNine,this.wDataTen,this.wDataEleven,this.wDataElevenNight, this.wDataTwelve

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
  get BMRule(){
    return this.editScheduleDataForm.get('BMRule')
  }
  get Pattern(){
    return this.editScheduleDataForm.get('Pattern')
  }


  businessRuleValidation(){

    this.tempScheduleDataStored = [this.Sun.value,this.Mon.value,this.Tue.value,this.Wed.value,this.Thu.value,this.Fri.value,this.Sat.value];
    this.work_Pattern=''
    for(var j=0;j<this.tempScheduleDataStored.length;j++){
      for(var k=0;k<this.allShiftName.length;k++){
        if(this.tempScheduleDataStored[j]==this.allShiftName[k].shiftName){
          this.work_Pattern=this.work_Pattern+this.allShiftName[k].shiftCategory
        }
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
    this.hrs=Number(Array.from(this.work_Pattern).length*8)
    const test=[]

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
        "shift_length":8
    }
    console.log(this.editScheduleDataForm.value)

    this.busniessRulesValidation.businessRulesCheck(this.shift_line).subscribe(
      async (response)=>{
        this.valid=response['business_rules']
    },
    (error: any)=>{this.errorMsg=error;console.log(this.errorMsg)},
    async () => {
    }
    );
  }
  BusinessRulesPdf(){
    this.showHideText = !this.showHideText;
  }
  reset(){
    this.hrs=Number(Array.from(this.da[8]).length*8)
    this.workPattern=this.da[8]
    this.editScheduleDataForm = this.formBuilder.group({
      id:[this.scheduleData.id],
      Mon: [this.da1[2]],
      Tue:[this.da1[3]],
      Wed: [this.da1[4]],
      Thu: [this.da1[5]],
      Fri: [this.da1[6]],
      Sat: [this.da1[7]],
      Sun: [this.da1[1]],
      Pattern:[this.da[8]],
      BMLRule: [this.valid],
      SL:[this.scheduleData.SL]

    })
    // this.hrs=Number(Array.from(this.da[8]).length*8)
  }
  update(data){
    this.editData={
      "BMLRule": this.editScheduleDataForm.value.BMLRule,
      "Fri": this.editScheduleDataForm.value.Fri,
      "Mon": this.editScheduleDataForm.value.Mon,
      "Pattern": this.workPattern,
      "SL": this.editScheduleDataForm.value.SL,
      "Sat": this.editScheduleDataForm.value.Sat,
      "Sun": this.editScheduleDataForm.value.Sun,
      "Thu": this.editScheduleDataForm.value.Thu,
      "Tue": this.editScheduleDataForm.value.Tue,
      "Wed": this.editScheduleDataForm.value.Wed,
      "id": this.editScheduleDataForm.value.id
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
        this.finalResultShiftLine=[]
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
    var temp_schedule
    var after_edit=[]
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
        location.reload()
    }
}
