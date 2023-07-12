import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController, PopoverController, NavParams, NavController, ActionSheetController } from '@ionic/angular';
import { EditScheduleDataPage } from 'src/app/dashboard/generated_schedule/add-edit-shift-lines/edit-schedule-data/edit-schedule-data.page';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
// import { WorkloadDataReportGeneratePage } from 'src/app/generated_schedule/workload-data-report-generate/workload-data-report-generate.page';

@Component({
  selector: 'app-schedule-three',
  templateUrl: './schedule-three.component.html',
  styleUrls: ['./schedule-three.component.scss'],
  providers:[NavParams]
})
export class ScheduleThreeComponent implements OnInit {
  expand_shiftlineid
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

  constructor(public modalCtrl: ModalController,
              private route:Router,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private router: ActivatedRoute,public navParams: NavParams,
              public navCtrl: NavController,
              public actionsheetCtrl: ActionSheetController,
              public busniessRulesValidation:BusinessRulesValidationService,
              private cdref: ChangeDetectorRef,
              private localData: LocalDataService,
              public formBuilder: FormBuilder,
              ) {
              this.router.queryParams.subscribe((res)=>{
                this.schedule_id=2
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

if(this.scheduleShift.length<2){
  this.schedule_id=0
}else{
  this.schedule_id=2
}


if(this.focusShiftLine!=null || this.focusShiftLine!=undefined){
  if(this.focusShiftLine.schedule_id==2){
    this.focusShiftLine=this.focusShiftLine.shift_line.id
  }else{
    this.focusShiftLine=undefined
  }
}
for(var i=0;i<this.allShiftData.length;i++){
  if( Number(this.allShiftData[i].shiftCategory)==4){
     this.hideSplitShiftMidDay=true
  }
  else if( Number(this.allShiftData[i].shiftCategory)==5){
    this.hideSplitShiftDayEve=true
  }
  else if( Number(this.allShiftData[i].shiftCategory)==6){
     this.hideSplitShiftEveMid=true
  }
}
this.allShiftName=[]
this.allShiftName.push({"shiftName":'X',"shiftCategory":'X'})
for(var i=0;i<this.allShiftData.length;i++){
  this.allShiftName.push({"shiftName":this.allShiftData[i].shiftName,"shiftCategory":this.allShiftData[i].shiftCategory,"shiftTime":this.allShiftData[i].startTime})
}






this.shift=['M',6,7,1,3]

this.defscheduleShift=this.defscheduleShift[this.schedule_id]
this.scheduleShift=this.scheduleShift[this.schedule_id]

}
convertRDOtoShiftDefintion(rdo,shiftlength){
  return rdo
  // if(String(rdo)=='X' || String(rdo)=='x'){
  //   return rdo
  // }
  // else{
  //   for(var i=0;i<this.allShiftData.length;i++){
  //     if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
  //       return String(this.allShiftData[i].startTime)
  //     }
  //   }

  // }
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
if(i==2){
  temp_schedule=this.deleteShiftLines
}else{
  temp_schedule=current_customized_schedule[i]
}
after_delete.push(temp_schedule)
}
      this.localData.removeItem('customizedScheduleShiftLine')
      this.localData.setItem('focusShiftLine',JSON.stringify({"shift_line":'',"schedule_id":this.schedule_id}))
      this.localData.setItem('customizedScheduleShiftLine',JSON.stringify(after_delete))
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
      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

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
  }
