import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { IncludeExcludeShiftService } from 'src/app/services/include-exclude-shift.service';
import { RequiredWorkforceService } from 'src/app/services/required-workforce.service';
import { ScheduleDataService } from 'src/app/services/schedule-data.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-import-excel-sheet-for-schedule',
  templateUrl: './import-excel-sheet-for-schedule.component.html',
  styleUrls: ['./import-excel-sheet-for-schedule.component.scss'],
})
export class ImportExcelSheetForScheduleComponent implements OnInit {
  formData:FormData;
  defaultscheduleShift: any[];
  scheduleShift: any[];
  scheduleDataArray: any[];
  scheduleData: any;
  comparisonData: any;
  comparisonDataArray: any[];
  gDatamon: any;
  gDatasun: any;
  gDatatue: any;
  gDatawed: any;
  gDatafri: any;
  gDatasat: any;
  gDataPattern: any;
  gData
  gDatathu: any;
  allDefaultGeneratedSchedule=[];
  allGeneratedSchedule=[];
  testing: { scheduleData: any[]; };
  errorMsg: any;
  constructor(public modalCtrl: ModalController,
    private route:Router,
    public navCtrl: NavController,
    public shiftDefSer:WorkLoadService,
    private routeData: ActivatedRoute,
    private headerTitleService: HeaderTitleService,
    // public workLoadReport:WorkloadDataReportGeneratePage,
    private renderer: Renderer2,
    public loadingController: LoadingController,
    private requiredWorkforce: RequiredWorkforceService,
    public dataService:ScheduleDataService,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private localData: LocalDataService,
    private includeExcludeSer:IncludeExcludeShiftService,
    public dialogs: MatDialog) { }

  ngOnInit() {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setDefaultHeader(true)
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.select_option_for_generate_schedule);
    this.headerTitleService.setForwardUrl(null);this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        this.formData = new FormData();
        this.formData.append('file', file);
        let headers = new Headers();


        /** In Angular 5, including the header Content-Type can invalidate your request */
    }
}
  async submit(){

  let loading = await this.loadingController.create({
    cssClass: 'custom-loading',
    spinner:'bubbles',
    message: '',
    duration: 10000,

  });
  await loading.present();
  this.requiredWorkforce.importExcelSheet(this.formData).subscribe(
    async (response)=>{

      var res=JSON.stringify(response[0])
      var convertResponseToJsonStrigify=JSON.parse(response[0]?.["generated_schedule_1"]?.["schedule"])
     this.scheduleData= JSON.parse(response[0]?.["generated_schedule_1"]?.["schedule"])

     this.comparisonData=JSON.parse(response[0]?.["generated_schedule_1"]?.["schedule"])

   this.scheduleDataArray=[]
   this.comparisonDataArray=[]
   this.scheduleDataArray.push(this.scheduleData)
   this.comparisonDataArray.push(this.comparisonData)
   this.gDatasun=this.scheduleDataArray?.[0].SUN
   this.gDatamon=this.scheduleDataArray?.[0].MON
   this.gDatatue=this.scheduleDataArray?.[0].TUE
   this.gDatawed=this.scheduleDataArray?.[0].WED
   this.gDatathu=this.scheduleDataArray?.[0].THU
   this.gDatafri=this.scheduleDataArray?.[0].FRI
   this.gDatasat=this.scheduleDataArray?.[0].SAT
   this.gDataPattern=this.scheduleDataArray?.[0].Pattern

   this.scheduleShift=[]
         for(var i=0;i<i+1 && this.gDatasun[i]!=null;i++){

          this.gData={"id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":i}
                    //    for(var j=0;j<this.allShiftName.length;j++){
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatasun[i]))||(this.allShiftName[j].startTime==this.gDatasun[i])){
                    //        this.gDatasun[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatamon[i]))||(this.allShiftName[j].startTime==this.gDatamon[i])){
                    //        this.gDatamon[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatatue[i]))||(this.allShiftName[j].startTime==this.gDatatue[i])){
                    //        this.gDatatue[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatawed[i]))||(this.allShiftName[j].startTime==this.gDatawed[i])){
                    //        this.gDatawed[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatathu[i]))||(this.allShiftName[j].startTime==this.gDatathu[i])){
                    //        this.gDatathu[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatafri[i]))||(this.allShiftName[j].startTime==this.gDatafri[i])){
                    //        this.gDatafri[i]=this.allShiftName[j].shift_name
                    //      }
                    //      if((Number(this.allShiftName[j].startTime)==Number(this.gDatasat[i]))||(this.allShiftName[j].startTime==this.gDatasat[i])){
                    //        this.gDatasat[i]=this.allShiftName[j].shift_name
                    //    }
                    //    this.gData={"id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":i}
                    //  }
                    // this.gData={"id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":i}
                     if((this.gData.Sun=='X' && this.gData.Sat=='X')||(this.gData.Sun=='x' && this.gData.Sat=='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'SS'}
                       this.scheduleShift.push(this.gData)

                     }
                     else if((this.gData.Sun==='X' && this.gData.Mon==='X')||(this.gData.Sun==='x' && this.gData.Mon==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'SM'}
                       this.scheduleShift.push(this.gData)
                     }
                     else if((this.gData.Mon==='X' && this.gData.Tue==='X')||(this.gData.Mon==='x' && this.gData.Tue==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'MT'}
                       this.scheduleShift.push(this.gData)
                     }
                     else if((this.gData.Tue==='X' && this.gData.Wed==='X')||(this.gData.Tue==='x' && this.gData.Wed==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'TW'}
                       this.scheduleShift.push(this.gData)
                     }
                     else if((this.gData.Wed==='X' && this.gData.Thu==='X')||(this.gData.Wed==='x' && this.gData.Thu==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'WT'}
                       this.scheduleShift.push(this.gData)
                     }
                     else if((this.gData.Thu==='X' && this.gData.Fri==='X')||(this.gData.Thu==='x' && this.gData.Fri==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'TF'}
                       this.scheduleShift.push(this.gData)
                     }
                     else if((this.gData.Fri==='X' && this.gData.Sat==='X')||(this.gData.Fri==='x' && this.gData.Sat==='x')){
                       this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i],"SL":'FS'}
                       this.scheduleShift.push(this.gData)
                     }
                   }
                  //
                   this.defaultscheduleShift=[]
                   for(var i=0;i<i+1 && this.gDatasun[i]!=null;i++){
                     this.gData={"seq_id":i,"Sun":this.gDatasun[i],"Mon":this.gDatamon[i],"Tue":this.gDatatue[i],"Wed":this.gDatawed[i],"Thu":this.gDatathu[i],"Fri":this.gDatafri[i],"Sat":this.gDatasat[i],"Pattern":this.gDataPattern[i]
                     }
                       this.defaultscheduleShift.push(this.gData)


                   }

                   this.testing={"scheduleData":this.scheduleShift}
                   this.allGeneratedSchedule.push(this.scheduleShift)

                   this.allDefaultGeneratedSchedule.push(this.defaultscheduleShift)
                   this.localData.setItem('editCustomizedScheduleShiftLine',JSON.stringify(this.scheduleShift))
      this.localData.setItem('editDefaultScheduleShiftLine',JSON.stringify(this.scheduleShift))
      this.localData.setItem('focusShiftLine',JSON.stringify(''))
      await loading.dismiss();
        this.navCtrl.navigateForward([straightlines_io_apis.apis.edit_schedule_api+'/'+"I"])

   },async (error)=>{
    this.errorMsg=error;console.log(this.errorMsg)
    if(this.errorMsg!=null){
      // setTimeout(async function(){

                    await loading.dismiss();
          //   },15000);
          //  }
          let alert = this.alertCtrl.create({
            // title: 'Low battery',
            header:'Error!' ,
            subHeader:'Please try again',
            buttons: ['Cancel']
          });
          (await alert).present();
        }
   },async ()=>{
    await loading.dismiss();
   })
}
}
