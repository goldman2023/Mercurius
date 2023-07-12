import { Component, OnInit } from '@angular/core';
import straightlines_io_apis from 'src/app/json/apis.json';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { Buffer } from 'buffer';
import workloadData from 'src/app/json/work-load-data.json';
import { WorkLoadService } from 'src/app/services/work-load.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { HttpClient } from '@angular/common/http';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { GenerateScheduleHelper } from 'src/app/helper/schedule.helper';
@Component({
  selector: 'app-select-option-for-shiftline-edit-delete',
  templateUrl: './select-option-for-shiftline-edit-delete.component.html',
  styleUrls: ['./select-option-for-shiftline-edit-delete.component.scss']
})
export class SelectOptionForShiftlineEditDeleteComponent implements OnInit {
  positionStyle: Object;
  all_schedule=[]
  currentShiftlineScheduleShiftDuration=8
  allShiftName=[]
  defReqVsGeneData
  mid_day_summary: any[];
  eve_mid_summary: any[];
  day_eve_summary: any[];
  spinner=true
 ReqVsGeneData
  updateDefscheduleShiftId
  schedule_id
  schedule_length
  selected_shift_duration
  title = 'angular-app';
  fileName= 'Schedule Data.xlsx';
  hideSplitShiftMidDay=false
  shiftline_schedule_name
  hideSplitShiftDayEve=false
  hideSplitShiftEveMid=false
  allShiftData=[]
  ReqVsGeneTotalData;ReqVsGeneMidData: any;ReqVsGeneDayData: any;ReqVsGeneEveData: any;ReqVsGeneMidDayData: any;ReqVsGeneDayEveData: any;ReqVsGeneEveMidData: any;dayTitleforExcel:any;
  req_shift_1_data;req_shift_2_data;req_shift_3_data;req_shift_4_data;req_shift_5_data;
  gen_shift_1_data;gen_shift_2_data;gen_shift_3_data;gen_shift_4_data;gen_shift_5_data;
  defReqVsGeneTotalData;defReqVsGeneMidData: any;defReqVsGeneDayData: any;defReqVsGeneEveData: any;defReqVsGeneMidDayData: any;defReqVsGeneDayEveData: any;defReqVsGeneEveMidData: any;
  def_gen_shift_1_data;def_gen_shift_2_data;def_gen_shift_3_data;def_gen_shift_4_data;def_gen_shift_5_data
  def=[];defSun=[];defMon=[];defTue=[];defWed=[];defThu=[];defFri=[];defSat=[]
  customized=[];customizedSun=[];customizedMon=[];customizedTue=[];customizedWed=[];customizedThu=[];customizedFri=[];customizedSat=[]
  reqDataShiftTime=[];reqDataSun=[];reqDataMon=[];reqDataTue=[];reqDataWed=[];reqDataThu=[];reqDataFri=[];reqDataSat=[]
  reqvsgenDefDataShiftTime=[];reqvsgenDefDataSun=[];reqvsgenDefDataMon=[];reqvsgenDefDataTue=[];reqvsgenDefDataWed=[];reqvsgenDefDataThu=[];reqvsgenDefDataFri=[];reqvsgenDefDataSat=[]
  reqvsgenDataShiftTime=[];reqvsgenDataSun=[];reqvsgenDataMon=[];reqvsgenDataTue=[];reqvsgenDataWed=[];reqvsgenDataThu=[];reqvsgenDataFri=[];reqvsgenDataSat=[]
  sun_mid: number=0;sun_day: number=0;sun_eve: number=0;sun_mid_day: number=0;sun_day_eve: number=0;sun_eve_mid: number=0;
  mon_mid: number=0;mon_day: number=0;mon_eve: number=0;mon_mid_day: number=0;mon_day_eve: number=0;mon_eve_mid: number=0;
  tue_mid: number=0;tue_day: number=0;tue_eve: number=0;tue_mid_day: number=0;tue_day_eve: number=0;tue_eve_mid: number=0;
  wed_mid: number=0;wed_day: number=0;wed_eve: number=0;wed_mid_day: number=0;wed_day_eve: number=0;wed_eve_mid: number=0;
  thu_mid: number=0;thu_day: number=0;thu_eve: number=0;thu_mid_day: number=0;thu_day_eve: number=0;thu_eve_mid: number=0;
  fri_mid: number=0;fri_day: number=0;fri_eve: number=0;fri_mid_day: number=0;fri_day_eve: number=0;fri_eve_mid: number=0;
  sat_mid: number=0;sat_day: number=0;sat_eve: number=0;sat_mid_day: number=0;sat_day_eve: number=0;sat_eve_mid: number=0;

  def_sun_mid: number=0;def_sun_day: number=0;def_sun_eve: number=0;def_sun_mid_day: number=0;def_sun_day_eve: number=0;def_sun_eve_mid: number=0;
  def_mon_mid: number=0;def_mon_day: number=0;def_mon_eve: number=0;def_mon_mid_day: number=0;def_mon_day_eve: number=0;def_mon_eve_mid: number=0;
  def_tue_mid: number=0;def_tue_day: number=0;def_tue_eve: number=0;def_tue_mid_day: number=0;def_tue_day_eve: number=0;def_tue_eve_mid: number=0;
  def_wed_mid: number=0;def_wed_day: number=0;def_wed_eve: number=0;def_wed_mid_day: number=0;def_wed_day_eve: number=0;def_wed_eve_mid: number=0;
  def_thu_mid: number=0;def_thu_day: number=0;def_thu_eve: number=0;def_thu_mid_day: number=0;def_thu_day_eve: number=0;def_thu_eve_mid: number=0;
  def_fri_mid: number=0;def_fri_day: number=0;def_fri_eve: number=0;def_fri_mid_day: number=0;def_fri_day_eve: number=0;def_fri_eve_mid: number=0;
  def_sat_mid: number=0;def_sat_day: number=0;def_sat_eve: number=0;def_sat_mid_day: number=0;def_sat_day_eve: number=0;def_sat_eve_mid: number=0;


customizeShiftData=[]
customizeScheduleShiftLines=[]
allShiftDataWithIncludeExclude
  allShift=[]
    user_data: any;
    all_Schedule=[];
    default_work_load_data=workloadData
    work_load_data=[]
    errorMsg: any;
    userDefinedShift=[]
    reqShift: any[];
    all_shift: any[];
    convertTimetoString=[];
    arrangeShiftdefintionL: any[];
    arrangeShiftdefintionG: any[];
    all_bid_schedule
    bid_schedule=[]
    usedScheduleInBidSchedule=[]
    rdosArr=[]
    defrdosArr=[]
    shiftline_Schedule_data
    defGeneratedData= {"SUN_DAY":0,"SUN_MID":0,"SUN_EVE":0,"SUN_MID_DAY":0,"SUN_DAY_EVE":0,"SUN_EVE_MID":0,
  "MON_DAY":0,"MON_MID":0,"MON_EVE":0,"MON_MID_DAY":0,"MON_DAY_EVE":0,"MON_EVE_MID":0,
  "TUE_DAY":0,"TUE_MID":0,"TUE_EVE":0,"TUE_MID_DAY":0,"TUE_DAY_EVE":0,"TUE_EVE_MID":0,
  "WED_DAY":0,"WED_MID":0,"WED_EVE":0,"WED_MID_DAY":0,"WED_DAY_EVE":0,"WED_EVE_MID":0,
  "THU_DAY":0,"THU_MID":0,"THU_EVE":0,"THU_MID_DAY":0,"THU_DAY_EVE":0,"THU_EVE_MID":0,
  "FRI_DAY":0,"FRI_MID":0,"FRI_EVE":0,"FRI_MID_DAY":0,"FRI_DAY_EVE":0,"FRI_EVE_MID":0,
  "SAT_DAY":0,"SAT_MID":0,"SAT_EVE":0,"SAT_MID_DAY":0,"SAT_DAY_EVE":0,"SAT_EVE_MID":0
}
generatedEmpData={"SUN_DAY":0,"SUN_MID":0,"SUN_EVE":0,"SUN_MID_DAY":0,"SUN_DAY_EVE":0,"SUN_EVE_MID":0,
                  "MON_DAY":0,"MON_MID":0,"MON_EVE":0,"MON_MID_DAY":0,"MON_DAY_EVE":0,"MON_EVE_MID":0,
                  "TUE_DAY":0,"TUE_MID":0,"TUE_EVE":0,"TUE_MID_DAY":0,"TUE_DAY_EVE":0,"TUE_EVE_MID":0,
                  "WED_DAY":0,"WED_MID":0,"WED_EVE":0,"WED_MID_DAY":0,"WED_DAY_EVE":0,"WED_EVE_MID":0,
                  "THU_DAY":0,"THU_MID":0,"THU_EVE":0,"THU_MID_DAY":0,"THU_DAY_EVE":0,"THU_EVE_MID":0,
                  "FRI_DAY":0,"FRI_MID":0,"FRI_EVE":0,"FRI_MID_DAY":0,"FRI_DAY_EVE":0,"FRI_EVE_MID":0,
                  "SAT_DAY":0,"SAT_MID":0,"SAT_EVE":0,"SAT_MID_DAY":0,"SAT_DAY_EVE":0,"SAT_EVE_MID":0
                }
  defaultSun: any;defaultSunDayRequired= [];defaultSunDayGenerated= [];defaultDiffSunMid: any;defaultDiffSunDay: any;defaultDiffSunEve: any;defaultTotalSunRequired: any;defaultTotalSunGenerated: any;defaultTotalSundiff: any;defaultDiffSunMidDay: any;defaultDiffSunDayEve: any;defaultDiffSunEveMid: any;
  defaultMon: any;defaultMonDayRequired= [];defaultMonDayGenerated= [];defaultDiffMonMid: any;defaultDiffMonDay: any;defaultDiffMonEve: any;defaultTotalMonRequired: any;defaultTotalMonGenerated: any;defaultTotalMondiff: any;defaultDiffMonMidDay: any;defaultDiffMonDayEve: any;defaultDiffMonEveMid: any;
  defaultTue: any;defaultTueDayRequired= [];defaultTueDayGenerated= [];defaultDiffTueMid: any;defaultDiffTueDay: any;defaultDiffTueEve: any;defaultTotalTueRequired: any;defaultTotalTueGenerated: any;defaultTotalTuediff: any;defaultDiffTueMidDay: any;defaultDiffTueDayEve: any;defaultDiffTueEveMid: any;
  defaultWed: any;defaultWedDayRequired= [];defaultWedDayGenerated= [];defaultDiffWedMid: any;defaultDiffWedDay: any;defaultDiffWedEve: any;defaultTotalWedRequired: any;defaultTotalWedGenerated: any;defaultTotalWeddiff: any;defaultDiffWedMidDay: any;defaultDiffWedDayEve: any;defaultDiffWedEveMid: any;
  defaultThu: any;defaultThuDayRequired= [];defaultThuDayGenerated= [];defaultDiffThuMid: any;defaultDiffThuDay: any;defaultDiffThuEve: any;defaultTotalThuRequired: any;defaultTotalThuGenerated: any;defaultTotalThudiff: any;defaultDiffThuMidDay: any;defaultDiffThuDayEve: any;defaultDiffThuEveMid: any;
  defaultFri: any;defaultFriDayRequired= [];defaultFriDayGenerated= [];defaultDiffFriMid: any;defaultDiffFriDay: any;defaultDiffFriEve: any;defaultTotalFriRequired: any;defaultTotalFriGenerated: any;defaultTotalFridiff: any;defaultDiffFriMidDay: any;defaultDiffFriDayEve: any;defaultDiffFriEveMid: any;
  defaultSat: any;defaultSatDayRequired= [];defaultSatDayGenerated= [];defaultDiffSatMid: any;defaultDiffSatDay: any;defaultDiffSatEve: any;defaultTotalSatRequired: any;defaultTotalSatGenerated: any;defaultTotalSatdiff: any;defaultDiffSatMidDay: any;defaultDiffSatDayEve: any;defaultDiffSatEveMid: any;
  sun:any;SunDayRequired = [];SunDayGenerated = [];totalSundiff: any;totalSunGenerated: any;totalSunRequired: any;diffSunMid: any;diffSunDay: any;diffSunEve: any;diffSunMidDay: any;diffSunDayEve: any;diffSunEveMid: any;validSunMid: boolean;validSunDay: boolean;validSunEve: boolean;
  mon: any;MonDayRequired= [];MonDayGenerated= [];diffMonMid: any;diffMonDay: any;diffMonEve: any;totalMonRequired: any;totalMonGenerated: any;totalMondiff: any;diffMonMidDay: any;diffMonDayEve: any;diffMonEveMid: any;
  tue:any;TueDayRequired= [];TueDayGenerated= [];diffTueMid: any;diffTueDay: any;diffTueEve: any;totalTueRequired: any;totalTueGenerated: any;totalTuediff: any;diffTueMidDay: any;diffTueDayEve: any;diffTueEveMid: any;
  wed:any;WedDayRequired= [];WedDayGenerated= [];diffWedMid: any;diffWedDay: any;diffWedEve: any;totalWedRequired: any;totalWedGenerated: any;totalWeddiff: any;diffWedMidDay: any;diffWedDayEve: any;diffWedEveMid: any;
  thu:any;ThuDayRequired= [];ThuDayGenerated= [];diffThuMid: any;diffThuDay: any;diffThuEve: any;totalThuRequired: any;totalThuGenerated: any;totalThudiff: any;diffThuMidDay: any;diffThuDayEve: any;diffThuEveMid: any;
  fri:any;FriDayRequired= [];FriDayGenerated= [];diffFriMid: any;diffFriDay: any;diffFriEve: any;totalFriRequired: any;totalFriGenerated: any;totalFridiff: any;diffFriMidDay: any;diffFriDayEve: any;diffFriEveMid: any;
  sat:any;SatDayRequired= [];SatDayGenerated= [];diffSatMid: any;diffSatDay: any;diffSatEve: any;totalSatRequired: any;totalSatGenerated: any;totalSatdiff: any;diffSatMidDay: any;diffSatDayEve: any;diffSatEveMid: any;

  countSunSat=0;countSunMon=0;countMonTue=0;countTueWed=0;countWedThu=0;countThuFri=0;countFriSat=0;
  countFSS=0;countSMS=0;countSMT=0;countMTW=0;countTWT=0;countWTF=0;countTFS=0;countNC=0;
  SunSat=0;SunMon=0;MonTue=0;TueWed=0;WedThu=0;ThuFri=0;FriSat=0;
  mid_Summary=[];day_Summary=[];eve_Summary=[]
  def_mid_Summary=[];def_day_Summary=[];def_eve_Summary=[]
  final_mid_Summary=[];final_day_Summary=[];final_eve_Summary=[]
  final_def_mid_Summary=[];final_def_day_Summary=[];final_def_eve_Summary=[]
  exportData=[] as any
  exportScheduleData=[] as any
  sunDay=[] as any
  defscheduleShift: any;
  sundAy= [] as any;mondAy= [] as any;tuedAy= [] as any;weddAy= [] as any;thudAy= [] as any;fridAy= [] as any;satdAy= [] as any;
  def_sundAy= [] as any;def_mondAy= [] as any;def_tuedAy= [] as any;def_weddAy= [] as any;def_thudAy= [] as any;def_fridAy= [] as any;def_satdAy= [] as any;
    allScheduleName: any[];
    scheduleShift=[]
    updatedDefScheduleShiftLines=[]
    totalCount;
    initloading=false;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private scheduleService:GeneratedScheduleService,
    private headerTitleService: HeaderTitleService,
    public loadingController: LoadingController,
    public http : HttpClient,
    private bidSer:BidScheduleService,
    public modalCtrl: ModalController,
    private localData: LocalDataService,
    public navParams: NavParams,
    public shiftDefSer:WorkLoadService,
    public generateScheduleHelper: GenerateScheduleHelper,
    ) {
      this.shiftline_Schedule_data=navParams.get('shiftlineSchedule_data');
     }

  async ngOnInit() {
    this.initloading = true;
    this.spinner = true;
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.shiftline_schedule_name=this.shiftline_Schedule_data.schedulename
    if(this.shiftline_schedule_name!=undefined && this.shiftline_schedule_name!='' && this.shiftline_schedule_name!=null ){
      this.fileName=this.shiftline_schedule_name +' Shiftline-Schedule Data.xlsx'
    }
    await this.updateLocalShiftData();
    this.getUserDefinedShift()
    this.getAllBidSchedule()
    this.getSchedule()
    this.spinner = false;
    
  }
  async removeSchedule(index){
    var count=0
    index=this.shiftline_Schedule_data
for(var i=0;i<this.allScheduleName.length;i++){
  if(this.allScheduleName[i]==index.sh_schedule_id){
    count++

  }
  this.initloading=false;
}

const imageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
const base64Image = Buffer.from(imageData).toString('base64');
if(count<1){
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
            // this.scheduleService.deleteScheduleBasedOnName(index.schedule_name).subscribe(
              this.scheduleService.newDeleteShiftLineSchedule(index.sh_schedule_id).subscribe(
              async (res)=>{


                    this.ngOnInit()
                const confirm = await this.alertCtrl.create({
                    header: 'Success',
                    message: 'Successfully deleted',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => {

                        }
                      }]})
                      await confirm.present();
              },async (err)=>{
                      // if(err.error.text=='deleted'){
                        this.ngOnInit()
                        const confirm = await this.alertCtrl.create({
                            header: '"Success',
                            message: '"Successfully deleted"',
                            buttons: [
                              {
                                text: 'OK',
                                role: 'cancel',
                                handler: () => {

                                }
                              }]})
                              await confirm.present();
                        console.log(err)
              },()=>{
                this.modalCtrl.dismiss('delete')
              }
            )

          }
        }]
        })
        await confirm.present();
      }else{

        const confirm = await this.alertCtrl.create({
          header: 'Alert',
          message: "Can't delete the Shiftline Schedule because it is included in a Bid Schedule.",
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
  close(){
    this.modalCtrl.dismiss()
  }
  checkID(id,sl,scheduleShift){
    var tempArr=[]
    for(var i=0; i<=scheduleShift.length;i++)
    {
      if(scheduleShift[i] !=undefined){
      if(scheduleShift[i]?.shiftname  == sl || scheduleShift[i]?.shiftname  == (sl+'-A')){
       tempArr.push(Number(scheduleShift[i]?.seq_id))
      }
      }
    }
    tempArr=tempArr.sort((a,b)=>{return a -b})
    var newid=tempArr.indexOf(id)
    return newid
  }
  show(checkCondition){
        var selectScheduleData=this.shiftline_Schedule_data
        var ob,tempArr=[],tempAllShiftAlias=[]
        this.currentShiftlineScheduleShiftDuration=selectScheduleData.shiftdurationp
        for(var i=0;i<selectScheduleData.schild.length;i++){
          ob={
      "schedule_id":selectScheduleData.sh_schedule_id,
      "shiftdurationp":selectScheduleData.shiftdurationp,
      "shiftdurationc":selectScheduleData.schild[i].shiftdurationc,
            "areaid": selectScheduleData.areaid,
            "seq":this.checkID(selectScheduleData.schild[i].seq_id, selectScheduleData.schild[i].shiftname,selectScheduleData.schild),
            "Fri":selectScheduleData.schild[i].fri,
              "id":selectScheduleData.schild[i].sh_line_id,
              "Mon": selectScheduleData.schild[i].mon,
              "Sat": selectScheduleData.schild[i].sat,
              "schedulename": selectScheduleData.schedulename,
              "seq_id":selectScheduleData.schild[i].seq_id,
              "SL": selectScheduleData.schild[i].shiftname,
              "Sun": selectScheduleData.schild[i].sun,
              "Thu": selectScheduleData.schild[i].thu,
              "Tue": selectScheduleData.schild[i].tue,
              "Sunshift2": selectScheduleData.schild[i].sunshift2,
              "Wedshift2": selectScheduleData.schild[i].wedshift2,
              "Monshift2": selectScheduleData.schild[i].monshift2,
              "Frishift2":selectScheduleData.schild[i].frishift2,
              "Satshift2": selectScheduleData.schild[i].satshift2,
              "Thushift2": selectScheduleData.schild[i].thushift2,
              "Tueshift2": selectScheduleData.schild[i].tueshift2,
              "userid": selectScheduleData.userid,
              "Wed": selectScheduleData.schild[i].wed,
              "Pattern":selectScheduleData.schild[i].pattern
          }
          tempAllShiftAlias.push(ob.Sun,ob.Mon,ob.Tue,ob.Wed,ob.Thu,ob.Fri,ob.Sat)

          tempArr.push(ob)
        }
        
        var unique = tempAllShiftAlias.filter((v, i, a) => a.indexOf(v) === i);

    this.reqShift=[]

    for(var i=0;i<this.all_shift.length;i++){
      for(var j=0;j<unique.length;j++){
        if(String(this.all_shift[i].shiftName)===String(unique[j])){
          this.reqShift.push(this.all_shift[i])
        }
      }
    }
    this.arrangeShiftdefintionG=[]
    this.arrangeShiftdefintionL=[]
    for(var i=0;i<this.reqShift.length;i++){
        if(Number(this.reqShift[i].startTime)>2200){
    this.arrangeShiftdefintionG.push(this.reqShift[i])
        }else if(Number(this.reqShift[i].startTime)<=2200){
          this.arrangeShiftdefintionL.push(this.reqShift[i])
        }
      }
      this.arrangeShiftdefintionG.sort((a,b) => a.startTime.localeCompare(b.startTime));
      this.arrangeShiftdefintionL.sort((a,b) => a.startTime.localeCompare(b.startTime));
    var finalArr=[]
      for(var i=0;i<this.arrangeShiftdefintionG.length;i++){
        finalArr.push(this.arrangeShiftdefintionG[i])
      }
      for(var i=0;i<this.arrangeShiftdefintionL.length;i++){
        finalArr.push(this.arrangeShiftdefintionL[i])
      }
          this.localData.setItem('editCustomizedScheduleShiftLine',JSON.stringify(tempArr))
          this.localData.setItem('editDefaultScheduleShiftLine',JSON.stringify(tempArr))
          this.localData.setItem('allShiftRequiredDataForEditSchedule',JSON.stringify(finalArr))
          this.localData.setItem('focusShiftLine',JSON.stringify(''))
          if(checkCondition==true){
          this.modalCtrl.dismiss()
          if(this.user_data.role=='bidmanager'){
            this.navCtrl.navigateForward([straightlines_io_apis.apis.edit_schedule_api+'/'+this.shiftline_Schedule_data.sh_schedule_id+'/'+this.shiftline_Schedule_data.schedulename])
          }else{
            this.navCtrl.navigateForward([straightlines_io_apis.apis.guest_edit_schedule_api+'/'+this.shiftline_Schedule_data.sh_schedule_id+'/'+this.shiftline_Schedule_data.schedulename])
          }
        }

  }
  getShiftDefintion(scheduleName){

    this.scheduleService.getSaveShiftDefintionDataBasedOnScheduleName(scheduleName).subscribe((res)=>{

    },(err)=>{console.log(err)},()=>{})
  }

  getUserDefinedShift(){
    this.userDefinedShift=[]
    this.shiftDefSer.getAllShiftDefinition(this.user_data.id).subscribe(
      (res)=>{
        this.allShift=res;


        for(var i=0;i<this.allShift.length;i++){
          if(Number(this.allShift[i].userid)==Number(this.user_data.id)){
            this.userDefinedShift.push(this.allShift[i])
          }
        }
        // return this.userDefinedShift
        var user_shift=this.userDefinedShift

          for(var i=0;i<this.default_work_load_data.length;i++){
            this.work_load_data.push(this.default_work_load_data[i])
          }

          var allShift=[]
          for(var i=0;i<this.work_load_data.length;i++){
            allShift.push({
              "id": this.work_load_data[i].id,
              "shiftCategory": this.work_load_data[i].shiftCategory,
              "shiftName": this.work_load_data[i].shiftName,
              "shift_duration":this.work_load_data[i].shift_duration,
              "startTime": this.work_load_data[i].startTime})
          }

          if(user_shift.length>0){
            for(var i=0;i<this.userDefinedShift.length;i++){
              this.convertTimetoString=Array.from(this.userDefinedShift[i].sh_starttime)
              var sh_startTime=this.convertTimetoString[0]+this.convertTimetoString[1]+this.convertTimetoString[3]+this.convertTimetoString[4]
              allShift.push({
                "id": this.userDefinedShift[i].sh_id,
                "shiftCategory": this.userDefinedShift[i].sh_category_id,
                "shiftName": this.userDefinedShift[i].sh_name,
                "shift_duration":this.userDefinedShift[i].sh_duration,
                "startTime": sh_startTime})
            }
          }

          this.all_shift=[]
          this.all_shift=allShift
      },
    (error: any)=>{this.errorMsg=error
    console.log(this.errorMsg)
    for(var i=0;i<this.default_work_load_data.length;i++){
      this.work_load_data.push(this.default_work_load_data[i])
    }
    var allShift=[]
    for(var i=0;i<this.work_load_data.length;i++){
      allShift.push({
        "id": this.work_load_data[i].id,
        "shiftCategory": this.work_load_data[i].shiftCategory,
        "shift_duration":this.userDefinedShift[i].shift_duration,
        "shiftName": this.work_load_data[i].shiftName,
        "startTime": this.work_load_data[i].startTime})
    }
    this.all_shift=allShift

},
    ()=>{
      this.show(false)
    }
    );

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
    this.allScheduleName=[]
    for(var i=0;i<uniques.length;i++){
      if(uniques[i].shiftdefmap.length>0){
    for(var j=0;j<uniques[i].shiftdefmap.length;j++){
    this.allScheduleName.push(uniques[i].shiftdefmap[j].shiftdefref)
    }
      }
    }
  }
  getSchedule(){
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
  convertRDOtoShiftDefintion(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{
      for(var i=0;i<this.allShiftDataWithIncludeExclude.length;i++){
        if(Number(shiftlength)==9){
          if(String(this.allShiftDataWithIncludeExclude[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(this.allShiftDataWithIncludeExclude[i].shift_duration)){
            return String(this.allShiftDataWithIncludeExclude[i].startTime)
          }
        }else{
          if(String(this.allShiftDataWithIncludeExclude[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftDataWithIncludeExclude[i].shift_duration)){
            return String(this.allShiftDataWithIncludeExclude[i].startTime)
          }
        }
      }

    }
  }
 
  getShiftCategory(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{
      for(var i=0;i<this.allShiftData.length;i++){
        if(Number(shiftlength)==9){
          if(String(this.allShiftData[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(this.allShiftData[i].shift_duration)){
            return this.allShiftData[i].shiftCategory
          }
        }else{
          if(String(this.allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(this.allShiftData[i].shift_duration)){
            return this.allShiftData[i].shiftCategory
          }
        }
      }
    }
  }
  getShiftDuration(rdo,shiftlength){
    if(String(rdo)=='X' || String(rdo)=='x'){
      return rdo
    }
    else{

        if(Number(shiftlength)==9){
            return Number(rdo.split('-')[1])
        }else{
          return Number(shiftlength)
        }
    }
  }

  async Export(){
    this.loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner:'bubbles',
      message: 'Please Wait...',
      duration: 10000,

    });
    await this.loading.present();
    this.exportData=[]
    this.customizeShiftData=[]
         this.customizeScheduleShiftLines=[]
    this.allShiftDataWithIncludeExclude=JSON.parse(this.localData.getItem('updatedallShiftRequiredData'))
    this.allShiftData=this.allShiftDataWithIncludeExclude
    this.scheduleShift=JSON.parse(this.localData.getItem('editCustomizedScheduleShiftLine'))

    this.defscheduleShift=JSON.parse(this.localData.getItem('editDefaultScheduleShiftLine'))

    this.schedule_length=this.scheduleShift.length
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

    this.defrdosArr = this.initializeAndCreateRdosArr(this.defscheduleShift);
    this.rdosArr = this.initializeAndCreateRdosArr(this.scheduleShift);
    /* refactoring end*/

    this.updatedDefScheduleShiftLines=[]
    for(var i=0;i<this.defscheduleShift.length;i++){
      this.updateDefscheduleShiftId=[this.defscheduleShift[i].SL+(this.defscheduleShift[i].id+ + +1),this.defscheduleShift[i].Sun,this.defscheduleShift[i].Mon,this.defscheduleShift[i].Tue,this.defscheduleShift[i].Wed,this.defscheduleShift[i].Thu,this.defscheduleShift[i].Fri,this.defscheduleShift[i].Sat,this.defscheduleShift[i].Pattern,this.defscheduleShift[i].shiftdurationc]
      this.updatedDefScheduleShiftLines.push(this.updateDefscheduleShiftId)
    }
    this.customizeScheduleShiftLines=[]
    for(var i=0;i<this.scheduleShift.length;i++){
      if(this.scheduleShift[i]!=undefined){
        if(this.scheduleShift[i].SL!=undefined && this.scheduleShift[i].SL!=null){
          this.customizeShiftData=[this.scheduleShift[i].SL+(this.scheduleShift[i].id+ + + 1 ),this.scheduleShift[i].Sun,this.scheduleShift[i].Mon,this.scheduleShift[i].Tue,this.scheduleShift[i].Wed,this.scheduleShift[i].Thu,this.scheduleShift[i].Fri,this.scheduleShift[i].Sat,this.scheduleShift[i].Pattern,this.scheduleShift[i].shiftdurationc]
        this.customizeScheduleShiftLines.push(this.customizeShiftData)
        }
      }
    }
/** refactor start */
    this.initdAy();

    const countCustomizedDays = (dayData) => {
      return [...dayData.reduce((r, e) => {
        let k = `${e.shiftDefintion}|${e.shift_duration}`;
        if (!r.has(k)) r.set(k, {...e, totalEmp: 1});
        else r.get(k).totalEmp++;
        return r;
      }, new Map).values()];
    };
    
    var countsCustomizedSunDay = countCustomizedDays(this.sundAy);
    var countsCustomizedMonDay = countCustomizedDays(this.mondAy);
    var countsCustomizedTueDay = countCustomizedDays(this.tuedAy);
    var countsCustomizedWedDay = countCustomizedDays(this.weddAy);
    var countsCustomizedThuDay = countCustomizedDays(this.thudAy);
    var countsCustomizedFriDay = countCustomizedDays(this.fridAy);
    var countsCustomizedSatDay = countCustomizedDays(this.satdAy);

    /** refactor end */
    /** refactor start */

    const isShiftFound = (countsCustomizedDay, shiftData) => {
      return countsCustomizedDay.some(element => {
        if (element.shiftDefintion === shiftData.startTime && shiftData.shift_duration === element.shift_duration) {
          return true;
        }
      });
    };
    
    const addShiftToDay = (countsCustomizedDay, shiftData) => {
      countsCustomizedDay.push({
        "shiftName": shiftData.shiftName,
        "shiftDefintion": shiftData.startTime,
        "shift_duration": shiftData.shift_duration,
        "shiftCategory": shiftData.shiftCategory,
        "totalEmp": 0
      });
    };
    
    for (const shiftData of this.allShiftData) {
      const isFoundSun = isShiftFound(countsCustomizedSunDay, shiftData);
      const isFoundMon = isShiftFound(countsCustomizedMonDay, shiftData);
      const isFoundTue = isShiftFound(countsCustomizedTueDay, shiftData);
      const isFoundWed = isShiftFound(countsCustomizedWedDay, shiftData);
      const isFoundThu = isShiftFound(countsCustomizedThuDay, shiftData);
      const isFoundFri = isShiftFound(countsCustomizedFriDay, shiftData);
      const isFoundSat = isShiftFound(countsCustomizedSatDay, shiftData);
    
      if (shiftData.shift_duration !== this.currentShiftlineScheduleShiftDuration &&
        !isFoundSun && !isFoundMon && !isFoundTue && !isFoundWed && !isFoundThu && !isFoundFri && !isFoundSat) {
        continue;
      } else {
        if (!isFoundSun) addShiftToDay(countsCustomizedSunDay, shiftData);
        if (!isFoundMon) addShiftToDay(countsCustomizedMonDay, shiftData);
        if (!isFoundTue) addShiftToDay(countsCustomizedTueDay, shiftData);
        if (!isFoundWed) addShiftToDay(countsCustomizedWedDay, shiftData);
        if (!isFoundThu) addShiftToDay(countsCustomizedThuDay, shiftData);
        if (!isFoundFri) addShiftToDay(countsCustomizedFriDay, shiftData);
        if (!isFoundSat) addShiftToDay(countsCustomizedSatDay, shiftData);
      }
    }
    /** refactor end */

    /** refactor start */
    
      // Initialize shifts
      this.initializeShifts();
    
      // Update counts for each day
      this.updateCounts(countsCustomizedSunDay, 'sun');
      this.updateCounts(countsCustomizedMonDay, 'mon');
      this.updateCounts(countsCustomizedTueDay, 'tue');
      this.updateCounts(countsCustomizedWedDay, 'wed');
      this.updateCounts(countsCustomizedThuDay, 'thu');
      this.updateCounts(countsCustomizedFriDay, 'fri');
      this.updateCounts(countsCustomizedSatDay, 'sat');
    
    /** refactor end */
    /** refactor start */
    this.initdAy('def');

    var countsCustomizedDefSunDay = countCustomizedDays(this.def_sundAy);
    var countsCustomizedDefMonDay = countCustomizedDays(this.def_mondAy);
    var countsCustomizedDefTueDay = countCustomizedDays(this.def_tuedAy);
    var countsCustomizedDefWedDay = countCustomizedDays(this.def_weddAy);
    var countsCustomizedDefThuDay = countCustomizedDays(this.def_thudAy);
    var countsCustomizedDefFriDay = countCustomizedDays(this.def_fridAy);
    var countsCustomizedDefSatDay = countCustomizedDays(this.def_satdAy);

    for (const shiftData of this.allShiftData) {
      var isFoundSun = isShiftFound(countsCustomizedDefSunDay, shiftData);
      var isFoundMon = isShiftFound(countsCustomizedDefMonDay, shiftData);
      var isFoundTue = isShiftFound(countsCustomizedDefTueDay, shiftData);
      var isFoundWed = isShiftFound(countsCustomizedDefWedDay, shiftData);
      var isFoundThu = isShiftFound(countsCustomizedDefThuDay, shiftData);
      var isFoundFri = isShiftFound(countsCustomizedDefFriDay, shiftData);
      var isFoundSat = isShiftFound(countsCustomizedDefSatDay, shiftData);
    
      if (shiftData.shift_duration !== this.currentShiftlineScheduleShiftDuration &&
        !isFoundSun && !isFoundMon && !isFoundTue && !isFoundWed && !isFoundThu && !isFoundFri && !isFoundSat) {
        continue;
      } else {
        if (!isFoundSun) addShiftToDay(countsCustomizedDefSunDay, shiftData);
        if (!isFoundMon) addShiftToDay(countsCustomizedDefMonDay, shiftData);
        if (!isFoundTue) addShiftToDay(countsCustomizedDefTueDay, shiftData);
        if (!isFoundWed) addShiftToDay(countsCustomizedDefWedDay, shiftData);
        if (!isFoundThu) addShiftToDay(countsCustomizedDefThuDay, shiftData);
        if (!isFoundFri) addShiftToDay(countsCustomizedDefFriDay, shiftData);
        if (!isFoundSat) addShiftToDay(countsCustomizedDefSatDay, shiftData);
      }
    }
   
    this.initializeShifts('def');
    this.updateCounts(countsCustomizedDefSunDay, 'def_sun');
    this.updateCounts(countsCustomizedDefMonDay, 'def_mon');
    this.updateCounts(countsCustomizedDefTueDay, 'def_tue');
    this.updateCounts(countsCustomizedDefWedDay, 'def_wed');
    this.updateCounts(countsCustomizedDefThuDay, 'def_thu');
    this.updateCounts(countsCustomizedDefFriDay, 'def_fri');
    this.updateCounts(countsCustomizedDefSatDay, 'def_sat');

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const daySuffixes = ['_MID', '_DAY', '_EVE', '_MID_DAY', '_DAY_EVE', '_EVE_MID'];
    const suffWithoutUnderline = ['Mid','Day','Eve','MidDay','DayEve','EveMid'];
    days.forEach((day,index) => {
      daySuffixes.forEach(suffix => {
        this.generatedEmpData[day + suffix] = this[day.toLowerCase() + suffix.toLowerCase()];
        this.defGeneratedData[day + suffix] = this['def_' + day.toLowerCase() + suffix.toLowerCase()];
      });

      const generated = daySuffixes.map(suffix => this.generatedEmpData[day + suffix]);
      const defGenerated = daySuffixes.map(suffix => this.defGeneratedData[day + suffix]);
      const upperDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      this[upperDay + 'DayGenerated'] = generated;
      this[upperDay + 'DayRequired'] = [];
      this['total' + upperDay + 'Generated'] = generated.reduce((acc, curr) => acc + curr, 0);
      const id = [0,3,1,4,2,5]
      this['default' + upperDay + 'DayRequired'] = [];
      this['default' + upperDay + 'DayGenerated'] = defGenerated;
      this['defaultTotal' + upperDay + 'Generated'] = defGenerated.reduce((acc, curr) => acc + curr, 0);
      var temp = [];
      suffWithoutUnderline.forEach((suff,index) => {
        this['diff'+upperDay+suff] = this[upperDay + 'DayGenerated'][index] - this['default' + upperDay + 'DayGenerated'][index]
        temp.push(this['diff'+upperDay+suff]);
      });
      this['total'+upperDay+'diff'] =  this['total' + upperDay + 'Generated']-this['defaultTotal' + upperDay + 'Generated'];
    });
    for(var i=0;i<this.allShiftData.length;i++){
      this.req_shift_1_data={"shiftTime":this.allShiftData[i].startTime,"sun":this.allShiftData[i].Sun,"mon":this.allShiftData[i].Mon,"tue":this.allShiftData[i].Tue,"wed":this.allShiftData[i].Wed,"thu":this.allShiftData[i].Thu,"fri":this.allShiftData[i].Fri,"sat":this.allShiftData[i].Sat}
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countsCustomizedDays = {
      Sun: countsCustomizedSunDay,
      Mon: countsCustomizedMonDay,
      Tue: countsCustomizedTueDay,
      Wed: countsCustomizedWedDay,
      Thu: countsCustomizedThuDay,
      Fri: countsCustomizedFriDay,
      Sat: countsCustomizedSatDay,
    };

    this.reqvsgenDataShiftTime = [
      { shift_start: 'Shifts', shift_length: 'Duration', shift_name: 'Shift Name' },
    ];

    weekDays.forEach((day) => {
      this[`reqvsgenData${day}`] = [{ shiftTime: '', [day]: day }];
    });

    this.reqvsgUpdate(countsCustomizedDays);

    const countsCustomizedDefDays = {
      Sun: countsCustomizedDefSunDay,
      Mon: countsCustomizedDefMonDay,
      Tue: countsCustomizedDefTueDay,
      Wed: countsCustomizedDefWedDay,
      Thu: countsCustomizedDefThuDay,
      Fri: countsCustomizedDefFriDay,
      Sat: countsCustomizedDefSatDay,
    };

    this.reqvsgenDefDataShiftTime = [
      { shift_start: 'Shifts', shift_length: 'Duration', shift_name: 'Shift Name' },
    ];

    weekDays.forEach((day) => {
      this[`reqvsgenDefData${day}`] = [{ shiftTime: '', [day]: day }];
    });

    this.reqvsgUpdate(countsCustomizedDefDays);
    this.final_day_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 3), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 3));
    this.final_eve_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 2), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 2));
    this.final_mid_Summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 1), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 1));
    this.eve_mid_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 6), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 6));
    this.day_eve_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 5), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 5));
    this.mid_day_summary = this.createSummary(this.reqvsgenDataSun.filter(data => data.shiftCategory === 4), this.reqvsgenDefDataSun.filter(data => data.shiftCategory === 4));
    this.ReqVsGeneData=[]
    this.defReqVsGeneData=[]
    this.ReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    this.ReqVsGeneData.push(["MID",this.generatedEmpData.SUN_MID,this.generatedEmpData.MON_MID,this.generatedEmpData.TUE_MID,this.generatedEmpData.WED_MID,this.generatedEmpData.THU_MID,this.generatedEmpData.FRI_MID,this.generatedEmpData.SAT_MID])
    this.ReqVsGeneData.push(["DAY",this.generatedEmpData.SUN_DAY,this.generatedEmpData.MON_DAY,this.generatedEmpData.TUE_DAY,this.generatedEmpData.WED_DAY,this.generatedEmpData.THU_DAY,this.generatedEmpData.FRI_DAY,this.generatedEmpData.SAT_DAY])
    this.ReqVsGeneData.push(["EVE",this.generatedEmpData.SUN_EVE,this.generatedEmpData.MON_EVE,this.generatedEmpData.TUE_EVE,this.generatedEmpData.WED_EVE,this.generatedEmpData.THU_EVE,this.generatedEmpData.FRI_EVE,this.generatedEmpData.SAT_EVE])
    this.ReqVsGeneData.push(["MID-DAY",this.generatedEmpData.SUN_MID_DAY,this.generatedEmpData.MON_MID_DAY,this.generatedEmpData.TUE_MID_DAY,this.generatedEmpData.WED_MID_DAY,this.generatedEmpData.THU_MID_DAY,this.generatedEmpData.FRI_MID_DAY,this.generatedEmpData.SAT_MID_DAY])
    this.ReqVsGeneData.push(["DAY-EVE",this.generatedEmpData.SUN_DAY_EVE,this.generatedEmpData.MON_DAY_EVE,this.generatedEmpData.TUE_DAY_EVE,this.generatedEmpData.WED_DAY_EVE,this.generatedEmpData.THU_DAY_EVE,this.generatedEmpData.FRI_DAY_EVE,this.generatedEmpData.SAT_DAY_EVE])
    this.ReqVsGeneData.push(["EVE-MID",this.generatedEmpData.SUN_EVE_MID,this.generatedEmpData.MON_EVE_MID,this.generatedEmpData.TUE_EVE_MID,this.generatedEmpData.WED_EVE_MID,this.generatedEmpData.THU_EVE_MID,this.generatedEmpData.FRI_EVE_MID,this.generatedEmpData.SAT_EVE_MID])
    this.ReqVsGeneData.push(["", this.totalSunGenerated, this.totalMonGenerated, this.totalTueGenerated, this.totalWedGenerated,this.totalThuGenerated, this.totalFriGenerated, this.totalSatGenerated])
    this.defReqVsGeneData.push(["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    this.defReqVsGeneData.push(["MID",this.defGeneratedData.SUN_MID,this.defGeneratedData.MON_MID,this.defGeneratedData.TUE_MID,this.defGeneratedData.WED_MID,this.defGeneratedData.THU_MID,this.defGeneratedData.FRI_MID,this.defGeneratedData.SAT_MID])
    this.defReqVsGeneData.push(["DAY",this.defGeneratedData.SUN_DAY,this.defGeneratedData.MON_DAY,this.defGeneratedData.TUE_DAY,this.defGeneratedData.WED_DAY,this.defGeneratedData.THU_DAY,this.defGeneratedData.FRI_DAY,this.defGeneratedData.SAT_DAY])
    this.defReqVsGeneData.push(["EVE",this.defGeneratedData.SUN_EVE,this.defGeneratedData.MON_EVE,this.defGeneratedData.TUE_EVE,this.defGeneratedData.WED_EVE,this.defGeneratedData.THU_EVE,this.defGeneratedData.FRI_EVE,this.defGeneratedData.SAT_EVE])
    this.defReqVsGeneData.push(["MID-DAY",this.defGeneratedData.SUN_MID_DAY,this.defGeneratedData.MON_MID_DAY,this.defGeneratedData.TUE_MID_DAY,this.defGeneratedData.WED_MID_DAY,this.defGeneratedData.THU_MID_DAY,this.defGeneratedData.FRI_MID_DAY,this.defGeneratedData.SAT_MID_DAY])
    this.defReqVsGeneData.push(["DAY-EVE",this.defGeneratedData.SUN_DAY_EVE,this.defGeneratedData.MON_DAY_EVE,this.defGeneratedData.TUE_DAY_EVE,this.defGeneratedData.WED_DAY_EVE,this.defGeneratedData.THU_DAY_EVE,this.defGeneratedData.FRI_DAY_EVE,this.defGeneratedData.SAT_DAY_EVE])
    this.defReqVsGeneData.push(["EVE-MID",this.defGeneratedData.SUN_EVE_MID,this.defGeneratedData.MON_EVE_MID,this.defGeneratedData.TUE_EVE_MID,this.defGeneratedData.WED_EVE_MID,this.defGeneratedData.THU_EVE_MID,this.defGeneratedData.FRI_EVE_MID,this.defGeneratedData.SAT_EVE_MID])
    this.defReqVsGeneData.push(["",this.defaultTotalSunGenerated,this.defaultTotalMonGenerated,this.defaultTotalTueGenerated,this.defaultTotalWedGenerated,this.defaultTotalThuGenerated, this.defaultTotalFriGenerated, this.defaultTotalSatGenerated])
    this.export()
  }

  private initializeCounts(data){
    this.totalCount=0;this.countNC=0
    this.countSunSat=0;this.countSunMon=0;this.countMonTue=0;this.countTueWed=0;this.countWedThu=0;this.countThuFri=0;this.countFriSat=0;
    this.countFSS=0;this.countSMS=0;this.countSMT=0;this.countMTW=0;this.countTWT=0;this.countWTF=0;this.countTFS=0;
    for (let i = 0; i <= data.length; i++) {
      const shift = data[i];
    
      if (shift) {
        const { SL } = shift;
    
        if (SL == 'SS' || SL == 'SS-A') this.countSunSat++;
        else if (SL == 'SM' || SL == 'SM-A') this.countSunMon++;
        else if (SL == 'MT' || SL == 'MT-A') this.countMonTue++;
        else if (SL == 'TW' || SL == 'TW-A') this.countTueWed++;
        else if (SL == 'WT' || SL == 'WT-A' || SL == 'WTh' || SL == 'WTh-A') this.countWedThu++;
        else if (SL == 'TF' || SL == 'TF-A' || SL == 'ThF' || SL == 'ThF-A') this.countThuFri++;
        else if (SL == 'FS' || SL == 'FS-A') this.countFriSat++;
        else if (SL == 'TFS' || SL == 'TFS-A' || SL == 'ThFS' || SL == 'ThFS-A') this.countTFS++;
        else if (SL == 'FSS' || SL == 'FSS-A') this.countFSS++;
        else if (SL == 'SMS' || SL == 'SMS-A') this.countSMS++;
        else if (SL == 'SMT' || SL == 'SMT-A') this.countSMT++;
        else if (SL == 'MTW' || SL == 'MTW-A') this.countMTW++;
        else if (SL == 'TWT' || SL == 'TWT-A' || SL == 'TWTh' || SL == 'TWTh-A') this.countTWT++;
        else if (SL == 'WTF' || SL == 'WTF-A' || SL == 'WThF' || SL == 'WThF-A') this.countWTF++;
        else this.countNC++;
        this.totalCount++
      }
    }
  }

  private initializeAndCreateRdosArr(scheduleShift) {
    this.initializeCounts(scheduleShift);
    const baseRdos = [
      {'rdo':'SS','rdoInfo':'Sat-Sun','rdoTitle':'SunSat',},
      {'rdo':'SM','rdoInfo':'Sun-Mon','rdoTitle':'SunMon'},
      {'rdo':'MT','rdoInfo':'Mon-Tue','rdoTitle':'MonTue'},
      {'rdo':'TW','rdoInfo':'Tue-Wed','rdoTitle':'TueWed'},
      {'rdo':'WTh','rdoInfo':'Wed-Thu','rdoTitle':'WedThu'},
      {'rdo':'ThF','rdoInfo':'Thu-Fri','rdoTitle':'ThuFri'},
      {'rdo':'FS','rdoInfo':'Fri-Sat','rdoTitle':'FriSat'},
      {'rdo':'FSS','rdoInfo':'Fri-Sat-Sun','rdoTitle':'FSS'},
      {'rdo':'SMS','rdoInfo':'Sun-Mon-Sat','rdoTitle':'SMS'},
      {'rdo':'SMT','rdoInfo':'Sun-Mon-Tue','rdoTitle':'SMT'},
      {'rdo':'MTW','rdoInfo':'Mon-Tue-Wed','rdoTitle':'MTW'},
      {'rdo':'TWTh','rdoInfo':'Tue-Wed-Thu','rdoTitle':'TWTh'},
      {'rdo':'WThF','rdoInfo':'Wed-Thu-Fri','rdoTitle':'WThF'},
      {'rdo':'ThFS','rdoInfo':'Thu-Fri-Sat','rdoTitle':'ThFS'},
      {'rdo':'NC','rdoInfo':'NC','rdoTitle':'NC'},
    ];
  
    const rdosArr = baseRdos.map(rdo => ({...rdo, 'count': this[`count${rdo.rdoTitle}`]})).filter(rdo => rdo.count > 0);
    return rdosArr;
  }

  private initializeShifts(def?:string) {
    const days =def?['def_sun', 'def_mon', 'def_tue', 'def_wed', 'def_thu', 'def_fri', 'def_sat']: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (const day of days) {
      for (let i = 1; i <= 6; i++) {
        this[`${day}_` + ['mid', 'day', 'eve', 'mid_day', 'day_eve', 'eve_mid'][i - 1]] = 0;
      }
    }
  }
  
 private updateCounts(dayCounts, dayPrefix) {
    for (const count of dayCounts) {
      switch (count.shiftCategory) {
        case '1': case 1: this[`${dayPrefix}_mid`] += +count.totalEmp; break;
        case '3':case 3: this[`${dayPrefix}_day`] += +count.totalEmp; break;
        case '2': case 2:this[`${dayPrefix}_eve`] += +count.totalEmp; break;
        case '4': case 4:this[`${dayPrefix}_mid_day`] += +count.totalEmp; break;
        case '5': case 5:this[`${dayPrefix}_day_eve`] += +count.totalEmp; break;
        case '6': case 6:this[`${dayPrefix}_eve_mid`] += +count.totalEmp; break;
      }
    }
  }
  private initdAy(def?:string){
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const underdef = def ? def + '_':'';
    const defScedule = def? 'defscheduleShift':'scheduleShift';
    const dayArrays = days.map(day => this[`${underdef}${day.toLowerCase()}dAy`] = []);
    
    for (let i = 0; i < this[defScedule].length; i++) {
      const shift = this[defScedule][i];
      const shiftDuration = shift.shiftdurationc;
    
      days.forEach((day, idx) => {
        const dayShifts = dayArrays[idx];
        const mainShift = shift[day];
        const secondShift = shift[`${day}shift2`];
    
        if (mainShift && mainShift.toLowerCase() !== 'x') {
          const isNine = Number(shiftDuration) === 9;
          const shiftName = isNine ? mainShift.split('-')[0] : mainShift;
          this[`${underdef}${day.toLowerCase()}dAy`].push({
            "shiftName": shiftName,
            "shiftDefintion": this.convertRDOtoShiftDefintion(mainShift, shiftDuration),
            "shift_duration": this.getShiftDuration(mainShift, shiftDuration),
            "shiftCategory": this.getShiftCategory(mainShift, shiftDuration)
          });
        }
    
        if (secondShift && secondShift.toLowerCase() !== 'x') {
          const shiftName = secondShift.split('-')[0];
          this[`${underdef}${day.toLowerCase()}dAy`].push({
            "shiftName": shiftName,
            "shiftDefintion": this.convertRDOtoShiftDefintion(secondShift, shiftDuration),
            "shift_duration": this.getShiftDuration(secondShift, shiftDuration),
            "shiftCategory": this.getShiftCategory(secondShift, shiftDuration)
          });
        }
      });
    }
  }

  private reqvsgUpdate(countsCustomizedDays:any,def?:string){
    const t1 = def?'reqvsgenDefDataShiftTime':'reqvsgenDataShiftTime';
    const t2 = def?'reqvsgenDefData':'reqvsgenData';
    function processDayData(dayData) {
      const r1 = [];
      const r = [];
      dayData.forEach((e) => {
        if (e['shiftCategory'] === 1) {
          r1.unshift(e);
        } else {
          r.push(e);
        }
      });
      r1.sort((a, b) => Number(b.shiftDefintion) - Number(a.shiftDefintion));
      r.sort((a, b) => Number(a.shiftDefintion) - Number(b.shiftDefintion));
      return r1.concat(r).sort((a, b) => Number(a.shift_duration) - Number(b.shift_duration));
    }

    Object.keys(countsCustomizedDays).forEach((day) => {
      countsCustomizedDays[day] = processDayData(countsCustomizedDays[day]);
    });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.allShiftData.forEach((shift) => {
      weekDays.forEach((day) => {
        const dayData = countsCustomizedDays[day];
        for (let j = 0; j < dayData.length; j++) {
          if (Number(shift.startTime) === Number(dayData[j].shiftDefintion) && Number(shift.shift_duration) === Number(dayData[j].shift_duration)) {
            if (day === 'Sun') {
              this[t1].push({ shift_start: String(shift.startTime), shift_length: String(shift.shift_duration), shift_name: String(shift.shiftName) });
            }
            this[`${t2}${day}`].push({
              shiftTime: String(shift.startTime),
              [day]: Number(dayData[j].totalEmp),
              shiftCategory: Number(dayData[j].shiftCategory),
              shift_duration: Number(dayData[j].shift_duration),
            });
          }
        }
      });
    });
  }

  private createSummary(reqData: any[], defData: any[]): any[] {
    return reqData.map(req => {
      const matchingDef = defData.find(def => 
        req.shiftTime === def.shiftTime && 
        req.shiftCategory === def.shiftCategory && 
        req.shift_duration === def.shift_duration
      );
  
      if (matchingDef) {
        return {
          shiftTime: req.shiftTime,
          shiftCategory: Number(req.shiftCategory),
          shift_duration: Number(req.shift_duration),
          ...this.calculateDifferences(req, matchingDef),
        };
      }
  
      return null;
    }).filter(item => item !== null);
  }
  
  private calculateDifferences(req: any, def: any): any {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = {};
  
    days.forEach(day => {
      result[`def${day}`] = def[day];
      result[day] = req[day];
      result[`diff${day}`] = Number(req[day]) - Number(def[day]);
    });
  
    return result;
  }

      loading
  async export() {
      await this.generateScheduleHelper.export(this.allShiftData,
        this.allShiftData,
        this.shiftline_schedule_name,
        this.scheduleShift,
        this.rdosArr,
        this.defrdosArr,
        this.ReqVsGeneData,
        this.defscheduleShift,
        this.reqvsgenDataShiftTime,
        this.defReqVsGeneData,
        this.reqvsgenDefDataShiftTime,
        this.reqvsgenDataSun,
        this.reqvsgenDataMon,
        this.reqvsgenDataTue,
        this.reqvsgenDataWed,
        this.reqvsgenDataThu,
        this.reqvsgenDataFri,
        this.reqvsgenDataSat,
        this.reqvsgenDefDataSun,
        this.reqvsgenDefDataMon,
        this.reqvsgenDefDataThu,
        this.reqvsgenDefDataWed,
        this.reqvsgenDefDataThu,
        this.reqvsgenDefDataFri,
        this.reqvsgenDefDataSat,
        this.fileName)
          await this.loading.dismiss();

  }
  getPermission(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }

  async updateLocalShiftData() {
    var all_defined_shifts = await this.shiftDefSer
      .getAllSystemDefinedShiftDefinition(8)
      .toPromise();
    
    var system_defined_ten_hours_shifts = await this.shiftDefSer
      .getAllSystemDefinedShiftDefinition(10)
      .toPromise();
    
    system_defined_ten_hours_shifts.forEach((shift) => all_defined_shifts.push(shift));
    
    var user_defined_shifts = await this.shiftDefSer
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
      all_defined_shifts = all_defined_shifts.sort((a, b) => a.shift_duration - b.shift_duration);
    }

    this.allShiftData = all_defined_shifts;
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(all_defined_shifts)
    );
  }
}
