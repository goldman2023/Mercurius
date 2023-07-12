import { Component, OnInit } from '@angular/core';
import { WorkLoadService } from 'src/app/services/work-load.service';
import workloadData from 'src/app/json/work-load-data.json';
import { ModalController, NavParams } from '@ionic/angular';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
@Component({
  selector: 'app-shift-alias-info',
  templateUrl: './shift-alias-info.component.html',
  styleUrls: ['./shift-alias-info.component.scss'],
})
export class ShiftAliasInfoComponent implements OnInit {
  allShift=[]
  allShiftDef=[]
  managerIdForCurrentBidSchdule
  default_work_load_data=workloadData
  shiftlineSummary
  bidSchduleInfo
  shiftlineData
  spinner=false
  constructor(private shiftDefSer:WorkLoadService,
    public navParams: NavParams,
    public generatedScheduleSer:GeneratedScheduleService,
    public modalCtrl: ModalController,
    ) {
    this.shiftlineSummary=navParams.get('shiftlineData');
    this.managerIdForCurrentBidSchdule=this.shiftlineSummary.currentBidManagerIdforBidSchadule
  }

  ngOnInit() {
    this.spinner=true
    // console.this.shiftlineSummary.shiftlineidref
    this.generatedScheduleSer.newGetShiftLineBasedOnShiftLineId(this.shiftlineSummary.shiftlineidref).subscribe(
      (res)=>{
        this.shiftlineData=res
      this. getAllShiftDefintionData()},
      (err)=>{console.log(err)},()=>{})
  }
  getAllShiftDefintionData(){
      this.shiftDefSer.getAllShiftDefinition(this.managerIdForCurrentBidSchdule).subscribe(
        (res)=>{
          this.allShift=res;
              var user_all_shift=[]
              for(var i=0;i<this.allShift.length;i++){
                if(Number(this.allShift[i].userid)==Number(this.managerIdForCurrentBidSchdule)){
                  var convertTimetoString:any = Array.from(this.allShift[i].sh_starttime)
                  var sh_startTime=convertTimetoString[0] + convertTimetoString[1] + convertTimetoString[3]+convertTimetoString[4]
                    var shift_name=this.allShift[i].sh_name
                  user_all_shift.push({
                  "startTime": sh_startTime,
                  "shiftName":shift_name,
                  "shift_duration":this.allShift[i].sh_duration,
                  "shiftCategory":this.allShift[i].sh_category_id,
                  "shift_created_by":this.allShift[i].sh_created_by,
                  "sh_include_exclude":this.allShift[i].sh_include_exclude
                 })
                }
              }
              for(var i=0;i<this.default_work_load_data.length;i++){
                  user_all_shift.push({
                  "startTime": this.default_work_load_data[i].startTime,
                  "shiftName":this.default_work_load_data[i].shiftName,
                  "shift_duration":this.default_work_load_data[i].shift_duration,
                  "shiftCategory":this.default_work_load_data[i].shiftCategory,
                  "shift_created_by":this.default_work_load_data[i].shift_created_by,
                  "sh_include_exclude":this.default_work_load_data[i].sh_include_exclude
                 })
              }
              this.allShiftDef=user_all_shift
              this.spinner=false
        },

      (error: any)=>{console.log(error)
        var user_all_shift=[]
        for(var i=0;i<this.default_work_load_data.length;i++){
          user_all_shift.push({
          "startTime": this.default_work_load_data[i].startTime,
          "shiftName":this.default_work_load_data[i].shiftName,
          "shift_duration":this.default_work_load_data[i].shift_duration,
          "shiftCategory":this.default_work_load_data[i].shiftCategory,
          "shift_created_by":this.default_work_load_data[i].shift_created_by,
          "sh_include_exclude":this.default_work_load_data[i].sh_include_exclude
         })
        }
        this.allShiftDef=user_all_shift
        this.spinner=false
    },
      ()=>{

      }
      );
  }
  dismiss(){
    this.modalCtrl.dismiss()
  }
  getShiftDef(sh_name,sl_len){
    var shiftTime=''
    if(sh_name=='X'){
      shiftTime='RDO'
    }else{
      for(var i=0;i<this.allShiftDef.length;i++){
        if(sl_len!=9){
          if(this.allShiftDef[i].shift_duration==sl_len && this.allShiftDef[i].shiftName==sh_name ){
            shiftTime=this.allShiftDef[i].startTime+' (' + String( this.allShiftDef[i].shift_duration)+'hr)'
          }
        }else{
          if(this.allShiftDef[i].shift_duration==Number(sh_name.split('-')[1]) && this.allShiftDef[i].shiftName==sh_name.split('-')[0] ){
            shiftTime=this.allShiftDef[i].startTime+' (' + String( this.allShiftDef[i].shift_duration)+'hr)'
          }
        }

      }
    }
    return shiftTime
  }
}
